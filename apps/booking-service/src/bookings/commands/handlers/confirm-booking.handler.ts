import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { ConfirmBookingCommand } from '../impl/confirm-booking.command';
import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '@eventflow/shared-types';
import { BOOKING_EVENTS } from '@eventflow/message-contracts';

@CommandHandler(ConfirmBookingCommand)
export class ConfirmBookingHandler implements ICommandHandler<ConfirmBookingCommand> {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @Inject('RABBITMQ_CLIENT')
        private readonly client: ClientProxy,
    ) { }

    async execute(command: ConfirmBookingCommand): Promise<Booking> {
        const { bookingId } = command;

        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId }
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }

        booking.status = BookingStatus.CONFIRMED;
        const updatedBooking = await this.bookingRepository.save(booking);

        // Publish booking.confirmed event
        this.client.emit(BOOKING_EVENTS.BOOKING_CONFIRMED, {
            bookingId: updatedBooking.id,
            userId: updatedBooking.userId,
            eventId: updatedBooking.eventId,
        });

        return updatedBooking;
    }
}
