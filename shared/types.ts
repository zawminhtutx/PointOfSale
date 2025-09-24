export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
  password?: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Zenith POS Types
export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  barcode: string;
  imageUrl?: string;
}
export interface CartItem extends Product {
  quantity: number;
}
export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  cashierId?: string;
  cashierName?: string;
}