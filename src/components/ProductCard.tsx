import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Product } from '@shared/types';
import { cn } from '@/lib/utils';
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}
export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn("overflow-hidden flex flex-col h-full product-card-hover-effect cursor-pointer", className)}
        onClick={() => onAddToCart(product)}
      >
        <CardHeader className="p-0">
          <div className="aspect-w-4 aspect-h-3">
            <img
              src={product.imageUrl || 'https://placehold.co/400x300/fafafa/242427?text=Zenith'}
              alt={product.name}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="text-xl font-bold text-foreground">{formatCurrency(product.price)}</p>
          <Button variant="ghost" size="icon" className="text-zenith-blue hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full">
            <PlusCircle className="h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}