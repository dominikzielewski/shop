import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutItemDto } from './checkout-item.dto';

export class CreateCheckoutDto {
    @IsArray({ message: 'Pole items musi być tablicą' })
    @ArrayMinSize(1, { message: 'Koszyk nie może być pusty' })
    @ValidateNested({ each: true })
    @Type(() => CheckoutItemDto)
    items: CheckoutItemDto[];
}