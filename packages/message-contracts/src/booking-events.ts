// Booking service event patterns for RabbitMQ
export const BOOKING_EVENTS = {
    BOOKING_CREATED: 'booking.created',
    BOOKING_CONFIRMED: 'booking.confirmed',
    BOOKING_CANCELLED: 'booking.cancelled',
    BOOKING_REFUNDED: 'booking.refunded',
} as const;

export interface BookingCreatedEvent {
    bookingId: string;
    userId: string;
    eventId: string;
    quantity: number;
    totalAmount: number;
    createdAt: Date;
}

export interface BookingConfirmedEvent {
    bookingId: string;
    userId: string;
    eventId: string;
    paymentId: string;
    confirmedAt: Date;
}

export interface BookingCancelledEvent {
    bookingId: string;
    userId: string;
    reason?: string;
    cancelledAt: Date;
}

export interface BookingRefundedEvent {
    bookingId: string;
    userId: string;
    refundAmount: number;
    refundedAt: Date;
}
