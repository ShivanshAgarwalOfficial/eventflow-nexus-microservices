import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Payment } from './entities/payment.entity';
import { OutboxMessage } from './entities/outbox-message.entity';
import { PaymentsController } from './payments.controller';
import { PaymentService } from './payments.service';
import { OutboxProcessor } from './outbox.processor';
import { MockPaymentStrategy } from './strategies/mock-payment.strategy';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, OutboxMessage]),
        ScheduleModule.forRoot(),
        ClientsModule.registerAsync([
            {
                name: 'RABBITMQ_CLIENT',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
                        queue: 'payment_queue',
                        queueOptions: {
                            durable: false,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [PaymentsController],
    providers: [
        PaymentService,
        OutboxProcessor,
        MockPaymentStrategy,
        StripePaymentStrategy,
    ],
    exports: [PaymentService],
})
export class PaymentsModule { }
