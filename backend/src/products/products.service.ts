import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateProductDto) {
        return this.prisma.product.create({
            data,
        });
    }

    findAll() {
        return this.prisma.product.findMany({
            include: { variants: true },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { variants: true },
        })

        if (!product) {
            throw new NotFoundException(`Produkt o ID ${id} nie zostal znaleziony.`);
        }

        return product;
    }

    async update(id: string, data: UpdateProductDto) {
        try {
            return this.prisma.product.update({
                where: { id },
                data,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Produkt o ID ${id} nie istnieje i nie może zostać zaktualizowany.`);
            }
            throw error;
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.product.delete({
                where: {id},
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Produkt o ID ${id} nie został znaleziony w bazie.`);
            }
            throw error;
        }
    }
}
