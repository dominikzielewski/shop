import { IsString, IsInt, IsOptional, Min, Length } from 'class-validator';

export class CreateProductDto {
    @IsString({ message: 'Nazwa produktu musi być tekstem' })
    @Length(3, 50, { message: 'Nazwa musi mieć od 3 do 50 znaków' })
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt({ message: 'Cena musi być liczbą całkowitą (w groszach)' })
    @Min(100, { message: 'Cena nie może być niższa niż 1 PLN (100 groszy)' })
    price: number;
}