// Payment service event patterns for RabbitMQ
export const PAYMENT_EVENTS = {
    PAYMENT_INITIATED: 'payment.initiated',
    PAYMENT_PROCESSING: 'payment.processing',
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_REFUNDED: 'payment.refunded',
} as const;

export interface PaymentInitiatedEvent {
    paymentId: string;
    bookingId: string;
    amount: number;
    currency: string;
    provider: string;
    initiatedAt: Date;
}

export interface PaymentProcessingEvent {
    paymentId: string;
    transactionId: string;
    processingAt: Date;
}

export interface PaymentCompletedEvent {
    paymentId: string;
    bookingId: string;
    transactionId: string;
    amount: number;
    completedAt: Date;
}

export interface PaymentFailedEvent {
    paymentId: string;
    bookingId: string;
    reason: string;
    failedAt: Date;
}

export interface PaymentRefundedEvent {
    paymentId: string;
    refundAmount: number;
    refundTransactionId: string;
    refundedAt: Date;
}
