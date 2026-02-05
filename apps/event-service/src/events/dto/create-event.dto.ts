import {
    IsString,
    IsNumber,
    IsDateString,
    IsEnum,
    IsOptional,
    Min,
} from 'class-validator';
import { EventStatus, CreateEventDto as ICreateEventDto } from '@eventflow/shared-types';

export class CreateEventDto implements ICreateEventDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    categoryId: string;

    @IsString()
    location: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsNumber()
    @Min(1)
    capacity: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
