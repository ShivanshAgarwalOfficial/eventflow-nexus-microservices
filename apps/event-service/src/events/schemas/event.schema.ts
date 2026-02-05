import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventStatus } from '@eventflow/shared-types';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    organizerId: string;

    @Prop({ required: true })
    categoryId: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true, min: 0 })
    capacity: number;

    @Prop({ required: true, min: 0 })
    availableTickets: number;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop()
    imageUrl: string;

    @Prop({
        required: true,
        enum: EventStatus,
        default: EventStatus.DRAFT,
    })
    status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
