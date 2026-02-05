import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox_messages')
export class OutboxMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    aggregateType: string; // e.g., 'payment'

    @Column()
    aggregateId: string; // Payment ID

    @Column()
    eventType: string; // e.g., 'payment.completed'

    @Column({ type: 'json' })
    payload: any;

    @Column({ default: false })
    sent: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    sentAt: Date;
}
