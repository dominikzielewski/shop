import { getProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <main className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
                Nowości w Sklepie
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}