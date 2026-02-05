import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Booking } from './entities/booking.entity';
import { BookingsController } from './bookings.controller';

// Command Handlers
import { CreateBookingHandler } from './commands/handlers/create-booking.handler';
import { ConfirmBookingHandler } from './commands/handlers/confirm-booking.handler';
import { CancelBookingHandler } from './commands/handlers/cancel-booking.handler';

// Query Handlers
import { GetBookingHandler } from './queries/handlers/get-booking.handler';
import { GetUserBookingsHandler } from './queries/handlers/get-user-bookings.handler';

const CommandHandlers = [
    CreateBookingHandler,
    ConfirmBookingHandler,
    CancelBookingHandler,
];

const QueryHandlers = [
    GetBookingHandler,
    GetUserBookingsHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking]),
        CqrsModule,
        HttpModule,
        ClientsModule.registerAsync([
            {
                name: 'RABBITMQ_CLIENT',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
                        queue: 'booking_queue',
                        queueOptions: {
                            durable: false,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [BookingsController],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
    ],
})
export class BookingsModule { }
