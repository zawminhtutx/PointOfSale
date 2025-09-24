import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { usePOSStore } from '@/store/posStore';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function ProductGrid() {
  const { data: products, isLoading, error, isSuccess } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api('/api/products'),
  });
  const addProductToCart = usePOSStore((state) => state.addProductToCart);
  const setProducts = usePOSStore((state) => state.setProducts);
  useEffect(() => {
    if (isSuccess && products) {
      setProducts(products);
    }
  }, [isSuccess, products, setProducts]);
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={addProductToCart} />
      ))}
    </div>
  );
}