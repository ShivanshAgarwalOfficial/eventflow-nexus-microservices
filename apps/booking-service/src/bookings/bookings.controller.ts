import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingCommand } from './commands/impl/create-booking.command';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        // TODO: Extract userId from JWT (mocking for now)
        const userId = 'user-123';
        return this.commandBus.execute(
            new CreateBookingCommand(
                userId,
                createBookingDto.eventId,
                createBookingDto.quantity,
            ),
        );
    }
}
