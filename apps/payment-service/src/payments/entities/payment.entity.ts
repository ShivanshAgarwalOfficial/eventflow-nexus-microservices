import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentStatus, PaymentProvider } from '@eventflow/shared-types';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @Column()
    userId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'USD' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentProvider,
    })
    provider: PaymentProvider;

    @Column({ nullable: true })
    providerPaymentId: string; // External payment ID from Stripe/PayPal

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
