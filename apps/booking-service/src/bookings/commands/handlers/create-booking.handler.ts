import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingCommand } from '../impl/create-booking.command';
import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '@eventflow/shared-types';

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
    ) { }

    async execute(command: CreateBookingCommand): Promise<Booking> {
        const { userId, eventId, quantity } = command;

        // TODO: Verify event availability via Event Service (HTTP/RPC)
        // For now, assuming availability

        const booking = this.bookingRepository.create({
            userId,
            eventId,
            quantity,
            totalPrice: quantity * 10, // Mock price calculation
            status: BookingStatus.PENDING,
        });

        return this.bookingRepository.save(booking);
    }
}
