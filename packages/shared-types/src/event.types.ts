// Event related types
export interface Event {
    id: string;
    title: string;
    description: string;
    organizerId: string;
    categoryId: string;
    location: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    availableTickets: number;
    price: number;
    imageUrl?: string;
    status: EventStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum EventStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export interface CreateEventDto {
    title: string;
    description: string;
    categoryId: string;
    location: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    price: number;
    imageUrl?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}
