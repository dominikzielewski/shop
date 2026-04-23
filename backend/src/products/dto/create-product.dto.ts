import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl({}, { message: 'Link do zdjęcia musi być poprawnym adresem URL' })
    @IsNotEmpty()
    image: string;
}