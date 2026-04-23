export type Product = {
    id: string;
    name: string;
    description: string | null;
    image: string;
    variants: ProductVariant[];
};

export type ProductVariant = {
    id: string;
    name: string;
    price: number;
    stock: number;
};