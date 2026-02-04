// User related types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    ORGANIZER = 'organizer',
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
