import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GetUserBookingsQuery } from '../impl/get-user-bookings.query';
import { Booking } from '../../entities/booking.entity';

@QueryHandler(GetUserBookingsQuery)
export class GetUserBookingsHandler implements IQueryHandler<GetUserBookingsQuery> {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
    ) { }

    async execute(query: GetUserBookingsQuery): Promise<Booking[]> {
        const { userId } = query;

        return this.bookingRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
}
