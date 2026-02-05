import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateBookingCommand } from '../impl/create-booking.command';
import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '@eventflow/shared-types';
import { BOOKING_EVENTS } from '@eventflow/message-contracts';

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
    private readonly eventServiceUrl: string;

    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @Inject('RABBITMQ_CLIENT')
        private readonly client: ClientProxy,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL') || 'http://localhost:3002';
    }

    async execute(command: CreateBookingCommand): Promise<Booking> {
        const { userId, eventId, quantity } = command;

        // Fetch event details from Event Service
        let eventData;
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.eventServiceUrl}/events/${eventId}`)
            );
            eventData = response.data;
        } catch (error) {
            throw new BadRequestException(`Event with ID ${eventId} not found`);
        }

        // Validate ticket availability
        if (eventData.availableTickets < quantity) {
            throw new BadRequestException(
                `Not enough tickets available. Requested: ${quantity}, Available: ${eventData.availableTickets}`
            );
        }

        // Calculate total price
        const totalPrice = eventData.price * quantity;

        // Create booking
        const booking = this.bookingRepository.create({
            userId,
            eventId,
            quantity,
            totalPrice,
            status: BookingStatus.PENDING,
        });

        const savedBooking = await this.bookingRepository.save(booking);

        // Publish booking.created event
        this.client.emit(BOOKING_EVENTS.BOOKING_CREATED, {
            bookingId: savedBooking.id,
            userId: savedBooking.userId,
            eventId: savedBooking.eventId,
            quantity: savedBooking.quantity,
            totalPrice: savedBooking.totalPrice,
        });

        return savedBooking;
    }
}
