import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const startingPrice = product.variants.length > 0
        ? Math.min(...product.variants.map(v => v.price))
        : 0;

    return (
        <Link href={`/shop/${product.id}`} className="flex flex-col border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer">

            {/* Prawdziwe zdjęcie z bazy danych */}
            <div className="bg-gray-50 rounded-xl h-48 mb-4 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                {product.name}
            </h2>

            <p className="text-gray-500 mb-6 flex-grow line-clamp-2">
                {product.description || 'Ten produkt nie ma jeszcze opisu.'}
            </p>

            <div className="flex justify-between items-end mt-auto">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Cena od</p>
                    <span className="text-2xl font-black text-blue-600">
            {(startingPrice / 100).toFixed(2)} PLN
          </span>
                </div>

                <span className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
          Zobacz
        </span>
            </div>
        </Link>
    );
}