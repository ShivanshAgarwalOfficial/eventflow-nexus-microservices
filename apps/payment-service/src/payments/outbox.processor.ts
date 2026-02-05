import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { OutboxMessage } from './entities/outbox-message.entity';

@Injectable()
export class OutboxProcessor {
    private readonly logger = new Logger(OutboxProcessor.name);

    constructor(
        @InjectRepository(OutboxMessage)
        private readonly outboxRepo: Repository<OutboxMessage>,
        @Inject('RABBITMQ_CLIENT')
        private readonly client: ClientProxy,
    ) { }

    // Run every 10 seconds
    @Cron('*/10 * * * * *')
    async processOutbox() {
        const messages = await this.outboxRepo.find({
            where: { sent: false },
            take: 100,
            order: { createdAt: 'ASC' },
        });

        if (messages.length === 0) {
            return;
        }

        this.logger.log(`Processing ${messages.length} outbox messages...`);

        for (const message of messages) {
            try {
                // Publish to RabbitMQ
                this.client.emit(message.eventType, message.payload);

                // Mark as sent
                message.sent = true;
                message.sentAt = new Date();
                await this.outboxRepo.save(message);

                this.logger.log(`Published: ${message.eventType} (ID: ${message.id})`);
            } catch (error) {
                this.logger.error(
                    `Failed to publish message ${message.id}: ${error.message}`,
                    error.stack,
                );
                // Will retry on next run
            }
        }
    }

    // Cleanup old sent messages (run daily)
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanupOldMessages() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await this.outboxRepo.delete({
            sent: true,
            sentAt: LessThan(thirtyDaysAgo),
        });

        this.logger.log(`Cleaned up ${result.affected} old outbox messages`);
    }
}
