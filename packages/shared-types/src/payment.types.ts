// Payment related types
export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum PaymentProvider {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export interface ProcessPaymentDto {
    bookingId: string;
    amount: number;
    provider: PaymentProvider;
}
