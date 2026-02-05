import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { CreateBookingHandler } from './commands/handlers/create-booking.handler';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking]),
        CqrsModule,
    ],
    controllers: [BookingsController],
    providers: [],
})
export class BookingsModule { }
