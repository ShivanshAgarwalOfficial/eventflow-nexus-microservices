// Event service event patterns for RabbitMQ
export const EVENT_EVENTS = {
    EVENT_CREATED: 'event.created',
    EVENT_UPDATED: 'event.updated',
    EVENT_PUBLISHED: 'event.published',
    EVENT_CANCELLED: 'event.cancelled',
} as const;

export interface EventCreatedEvent {
    eventId: string;
    title: string;
    organizerId: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    price: number;
    createdAt: Date;
}

export interface EventUpdatedEvent {
    eventId: string;
    updates: Record<string, any>;
    updatedAt: Date;
}

export interface EventPublishedEvent {
    eventId: string;
    publishedAt: Date;
}

export interface EventCancelledEvent {
    eventId: string;
    reason?: string;
    cancelledAt: Date;
}
