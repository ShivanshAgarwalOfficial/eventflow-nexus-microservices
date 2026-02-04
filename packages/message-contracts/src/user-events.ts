// User service event patterns for RabbitMQ
export const USER_EVENTS = {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
} as const;

export interface UserCreatedEvent {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
}

export interface UserUpdatedEvent {
    userId: string;
    updates: Partial<{
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
    updatedAt: Date;
}

export interface UserDeletedEvent {
    userId: string;
    deletedAt: Date;
}
