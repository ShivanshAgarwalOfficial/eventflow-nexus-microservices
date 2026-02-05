import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '@eventflow/shared-types';
import { EVENT_EVENTS } from '@eventflow/message-contracts';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @Inject('EVENT_SERVICE_RMQ') private readonly client: ClientProxy,
    ) { }

    async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
        const createdEvent = new this.eventModel({
            ...createEventDto,
            organizerId,
            availableTickets: createEventDto.capacity, // Initialize available tickets
            status: EventStatus.DRAFT,
        });

        const savedEvent = await createdEvent.save();

        // Publish event
        this.client.emit(EVENT_EVENTS.EVENT_CREATED, {
            eventId: savedEvent.id,
            title: savedEvent.title,
            organizerId: savedEvent.organizerId,
            startDate: savedEvent.startDate,
            endDate: savedEvent.endDate,
            capacity: savedEvent.capacity,
            price: savedEvent.price,
            createdAt: savedEvent['createdAt'],
        });

        return savedEvent;
    }

    async findAll(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
        const existingEvent = await this.eventModel
            .findByIdAndUpdate(id, updateEventDto, { new: true })
            .exec();

        if (!existingEvent) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return existingEvent;
    }

    async remove(id: string): Promise<void> {
        const result = await this.eventModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
    }
}
