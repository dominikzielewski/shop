import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CheckoutItemDto {
    @IsString({ message: 'ID produktu musi być tekstem (UUID)' })
    @IsNotEmpty({ message: 'ID produktu nie może być puste' })
    productId: string;

    @IsInt({ message: 'Ilość musi być liczbą całkowitą' })
    @Min(1, { message: 'Ilość musi wynosić minimum 1' })
    quantity: number;
}