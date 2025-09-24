import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Product, CartItem } from '@shared/types';
type POSState = {
  products: Product[];
  cart: CartItem[];
  taxRate: number; // e.g., 0.08 for 8%
};
type POSActions = {
  setProducts: (products: Product[]) => void;
  addProductToCart: (product: Product) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  getProductByBarcode: (barcode: string) => Product | undefined;
};
const calculateTotals = (cart: CartItem[], taxRate: number) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};
export const usePOSStore = create<POSState & POSActions>()(
  immer((set, get) => ({
    products: [],
    cart: [],
    taxRate: 0.08, // Default 8% tax
    setProducts: (products) => set({ products }),
    addProductToCart: (product) => {
      set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.cart.push({ ...product, quantity: 1 });
        }
      });
    },
    updateItemQuantity: (productId, quantity) => {
      set((state) => {
        const item = state.cart.find((item) => item.id === productId);
        if (item) {
          if (quantity > 0) {
            item.quantity = quantity;
          } else {
            state.cart = state.cart.filter((i) => i.id !== productId);
          }
        }
      });
    },
    removeItemFromCart: (productId) => {
      set((state) => {
        state.cart = state.cart.filter((item) => item.id !== productId);
      });
    },
    clearCart: () => set({ cart: [] }),
    getProductByBarcode: (barcode) => {
      return get().products.find((p) => p.barcode === barcode);
    },
  }))
);
// Selectors
export const useCart = () => usePOSStore((state) => state.cart);
export const useCartTotals = () => {
  const cart = usePOSStore((state) => state.cart);
  const taxRate = usePOSStore((state) => state.taxRate);
  return calculateTotals(cart, taxRate);
};