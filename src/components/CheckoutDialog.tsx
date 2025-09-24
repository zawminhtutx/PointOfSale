import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { usePOSStore, useCartTotals } from '@/store/posStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { Transaction } from '@shared/types';
interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { total } = useCartTotals();
  const cart = usePOSStore((state) => state.cart);
  const clearCart = usePOSStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  const handleCharge = async () => {
    setIsLoading(true);
    try {
      const transaction: Omit<Transaction, 'id'> = {
        items: cart,
        total: total,
        timestamp: Date.now(),
        cashierId: user?.id,
        cashierName: user?.name,
      };
      await api('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });
      toast.success('Transaction Complete!', {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      clearCart();
      onOpenChange(false);
    } catch (error) {
      toast.error('Transaction Failed', {
        description: 'There was an issue processing the payment.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Confirm Payment</DialogTitle>
          <DialogDescription>
            The total amount to be charged is shown below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-6xl font-bold font-display text-foreground">
            {formatCurrency(total)}
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full h-14 text-lg bg-zenith-blue text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
            onClick={handleCharge}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Charge'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}