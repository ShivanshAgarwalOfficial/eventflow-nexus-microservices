// Booking related types
export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    quantity: number;
    totalAmount: number;
    status: BookingStatus;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export interface CreateBookingDto {
    eventId: string;
    quantity: number;
}

export interface CancelBookingDto {
    bookingId: string;
    reason?: string;
}
