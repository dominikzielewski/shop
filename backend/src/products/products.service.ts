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
        return this.prisma.product.findMany();
    }

    findOne(id: number) {
        return 'this.prisma.product.findFirst(id)';
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return 'this.prisma.product.update(id, updateProductDto)';
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
