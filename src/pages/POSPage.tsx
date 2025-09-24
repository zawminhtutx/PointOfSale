import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarcodeScannerInput } from '@/components/BarcodeScannerInput';
import { ProductGrid } from '@/components/ProductGrid';
import { OrderSummary } from '@/components/OrderSummary';
import { usePOSStore } from '@/store/posStore';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Settings, History, LogOut, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function POSPage() {
  const navigate = useNavigate();
  const addProductToCart = usePOSStore((state) => state.addProductToCart);
  const getProductByBarcode = usePOSStore((state) => state.getProductByBarcode);
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('You have been logged out.');
  };
  const handleBarcodeScan = (barcode: string) => {
    const product = getProductByBarcode(barcode);
    if (product) {
      addProductToCart(product);
      toast.success(`${product.name} added to cart.`);
    } else {
      toast.error('Product not found', {
        description: `No product with barcode "${barcode}" exists.`,
      });
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground bg-pos-hero">
      <ThemeToggle className="absolute top-6 right-8 z-10" />
      <div className="md:grid md:grid-cols-3 max-w-screen-2xl mx-auto">
        <main className="md:col-span-2 p-4 sm:p-6 lg:p-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold font-display text-zenith-dark dark:text-zenith-light">Zenith POS</h1>
              <p className="text-muted-foreground">A new day, a new sale. Let's get started.</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {user?.name || 'Cashier'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/history">
                        <History className="w-4 h-4 mr-2" />
                        History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/manage">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Products
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.header>
          <div className="mb-8">
            <BarcodeScannerInput onScan={handleBarcodeScan} />
          </div>
          <ProductGrid />
        </main>
        <div className="md:col-span-1 md:sticky md:top-0 md:h-screen">
          <OrderSummary />
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}