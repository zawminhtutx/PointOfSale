import React, { useState } from 'react';
import { usePOSStore, useCart, useCartTotals } from '@/store/posStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart } from 'lucide-react';
import { CheckoutDialog } from './CheckoutDialog';
export function OrderSummary() {
  const cart = useCart();
  const { subtotal, tax, total } = useCartTotals();
  // FIX: Select actions individually to prevent re-renders.
  // The previous implementation `usePOSStore(state => ({...}))` returned a new object
  // on every render, causing a critical "Maximum update depth exceeded" error.
  const updateItemQuantity = usePOSStore((state) => state.updateItemQuantity);
  const removeItemFromCart = usePOSStore((state) => state.removeItemFromCart);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value, 10);
    // Ensure quantity is a valid number (0 or greater), otherwise default to 1
    updateItemQuantity(itemId, isNaN(quantity) || quantity < 0 ? 1 : quantity);
  };
  return (
    <aside className="bg-card border-l flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-semibold font-display">Current Order</h2>
      </div>
      <Separator />
      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Add products to get started.</p>
        </div>
      ) : (
        <ScrollArea className="flex-grow">
          <div className="p-6 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.imageUrl || 'https://placehold.co/64x64/fafafa/242427?text=Zenith'} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 h-9 text-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => removeItemFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      <div className="p-6 border-t bg-background/50">
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (8%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-2xl font-bold text-foreground">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <Button
          className="w-full mt-6 h-14 text-lg bg-zenith-blue text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
          disabled={cart.length === 0}
          onClick={() => setCheckoutOpen(true)}
        >
          Charge
        </Button>
      </div>
      <CheckoutDialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen} />
    </aside>
  );
}