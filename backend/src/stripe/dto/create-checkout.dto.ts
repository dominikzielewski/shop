import { IsArray, ValidateNested, ArrayMinSize, IsString, IsEmail } from 'class-validator';import { Type } from 'class-transformer';
import { CheckoutItemDto } from './checkout-item.dto';

export class CreateCheckoutDto {
    @IsArray({ message: 'Pole items musi być tablicą' })
    @ArrayMinSize(1, { message: 'Koszyk nie może być pusty' })
    @ValidateNested({ each: true })
    @Type(() => CheckoutItemDto)
    items: CheckoutItemDto[];

    @IsEmail({}, { message: 'Niepoprawny format email' })
    email: string;

    @IsString() firstName: string;
    @IsString() lastName: string;
    @IsString() phone: string;

    @IsString() country: string;
    @IsString() city: string;
    @IsString() postalCode: string;
    @IsString() address: string;
}