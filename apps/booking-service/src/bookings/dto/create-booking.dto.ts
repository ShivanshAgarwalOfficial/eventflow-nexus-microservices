import { IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    eventId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}
