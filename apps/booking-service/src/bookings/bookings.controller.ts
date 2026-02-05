import { Controller, Post, Get, Body, Param, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingCommand } from './commands/impl/create-booking.command';
import { ConfirmBookingCommand } from './commands/impl/confirm-booking.command';
import { CancelBookingCommand } from './commands/impl/cancel-booking.command';
import { GetBookingQuery } from './queries/impl/get-booking.query';
import { GetUserBookingsQuery } from './queries/impl/get-user-bookings.query';

@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    async createBooking(@Body(ValidationPipe) dto: CreateBookingDto) {
        return this.commandBus.execute(
            new CreateBookingCommand(dto.userId, dto.eventId, dto.quantity)
        );
    }

    @Post(':id/confirm')
    async confirmBooking(@Param('id') id: string) {
        return this.commandBus.execute(new ConfirmBookingCommand(id));
    }

    @Post(':id/cancel')
    async cancelBooking(@Param('id') id: string) {
        return this.commandBus.execute(new CancelBookingCommand(id));
    }

    @Get(':id')
    async getBooking(@Param('id') id: string) {
        return this.queryBus.execute(new GetBookingQuery(id));
    }

    @Get('user/:userId')
    async getUserBookings(@Param('userId') userId: string) {
        return this.queryBus.execute(new GetUserBookingsQuery(userId));
    }
}
