import { IsString, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    userId: string;

    @IsString()
    eventId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}
