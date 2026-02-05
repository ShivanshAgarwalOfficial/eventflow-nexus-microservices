import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { CancelBookingCommand } from '../impl/cancel-booking.command';
import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '@eventflow/shared-types';
import { BOOKING_EVENTS } from '@eventflow/message-contracts';

@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler implements ICommandHandler<CancelBookingCommand> {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @Inject('RABBITMQ_CLIENT')
        private readonly client: ClientProxy,
    ) { }

    async execute(command: CancelBookingCommand): Promise<Booking> {
        const { bookingId } = command;

        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId }
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }

        booking.status = BookingStatus.CANCELLED;
        const updatedBooking = await this.bookingRepository.save(booking);

        // Publish booking.cancelled event
        this.client.emit(BOOKING_EVENTS.BOOKING_CANCELLED, {
            bookingId: updatedBooking.id,
            userId: updatedBooking.userId,
            eventId: updatedBooking.eventId,
            quantity: updatedBooking.quantity,
        });

        return updatedBooking;
    }
}
