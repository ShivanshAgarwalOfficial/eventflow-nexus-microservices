import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GetBookingQuery } from '../impl/get-booking.query';
import { Booking } from '../../entities/booking.entity';

@QueryHandler(GetBookingQuery)
export class GetBookingHandler implements IQueryHandler<GetBookingQuery> {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
    ) { }

    async execute(query: GetBookingQuery): Promise<Booking> {
        const { bookingId } = query;

        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId }
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }

        return booking;
    }
}
