import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { OutboxMessage } from './entities/outbox-message.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentProvider, PaymentStatus } from '@eventflow/shared-types';
import { MockPaymentStrategy } from './strategies/mock-payment.strategy';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';
import { PaymentStrategy } from './interfaces/payment-strategy.interface';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
        @InjectRepository(OutboxMessage)
        private readonly outboxRepo: Repository<OutboxMessage>,
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly mockStrategy: MockPaymentStrategy,
        private readonly stripeStrategy: StripePaymentStrategy,
    ) { }

    async createPayment(dto: CreatePaymentDto): Promise<Payment> {
        // Select strategy based on provider
        const strategy = this.getStrategy(dto.provider);
        const currency = dto.currency || this.configService.get('DEFAULT_CURRENCY', 'USD');

        // Process payment with provider
        const result = await strategy.processPayment(dto.amount, currency, {
            bookingId: dto.bookingId,
            userId: dto.userId,
            ...dto.metadata,
        });

        // Save payment + outbox message in transaction (Outbox Pattern!)
        return await this.dataSource.transaction(async (manager) => {
            // Create payment record
            const payment = manager.create(Payment, {
                bookingId: dto.bookingId,
                userId: dto.userId,
                amount: dto.amount,
                currency,
                provider: dto.provider,
                providerPaymentId: result.paymentId,
                status: result.success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
                metadata: dto.metadata,
            });

            await manager.save(payment);

            // Create outbox message
            const eventType = result.success ? 'payment.completed' : 'payment.failed';
            const outboxMessage = manager.create(OutboxMessage, {
                aggregateType: 'payment',
                aggregateId: payment.id,
                eventType,
                payload: {
                    paymentId: payment.id,
                    bookingId: payment.bookingId,
                    userId: payment.userId,
                    amount: payment.amount,
                    currency: payment.currency,
                    provider: payment.provider,
                    status: payment.status,
                },
            });

            await manager.save(outboxMessage);

            return payment;
        });
    }

    async getPayment(id: string): Promise<Payment> {
        const payment = await this.paymentRepo.findOne({ where: { id } });
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }

    async getPaymentByBooking(bookingId: string): Promise<Payment> {
        const payment = await this.paymentRepo.findOne({ where: { bookingId } });
        if (!payment) {
            throw new NotFoundException(`Payment for booking ${bookingId} not found`);
        }
        return payment;
    }

    async refundPayment(id: string, amount?: number): Promise<Payment> {
        const payment = await this.getPayment(id);

        if (payment.status !== PaymentStatus.COMPLETED) {
            throw new BadRequestException('Only completed payments can be refunded');
        }

        const strategy = this.getStrategy(payment.provider);
        const refundAmount = amount || payment.amount;

        const result = await strategy.refundPayment(
            payment.providerPaymentId,
            refundAmount,
            payment.currency,
        );

        if (!result.success) {
            throw new BadRequestException(`Refund failed: ${result.error}`);
        }

        // Update payment status
        payment.status = PaymentStatus.REFUNDED;
        await this.paymentRepo.save(payment);

        // Create outbox message for refund event
        const outboxMessage = this.outboxRepo.create({
            aggregateType: 'payment',
            aggregateId: payment.id,
            eventType: 'payment.refunded',
            payload: {
                paymentId: payment.id,
                bookingId: payment.bookingId,
                userId: payment.userId,
                refundAmount,
                refundId: result.refundId,
            },
        });

        await this.outboxRepo.save(outboxMessage);

        return payment;
    }

    private getStrategy(provider: PaymentProvider): PaymentStrategy {
        switch (provider) {
            case PaymentProvider.STRIPE:
                return this.stripeStrategy;
            case PaymentProvider.MOCK:
                return this.mockStrategy;
            default:
                throw new BadRequestException(`Unsupported payment provider: ${provider}`);
        }
    }
}
