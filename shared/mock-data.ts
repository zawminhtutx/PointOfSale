import type { User, Chat, ChatMessage, Product } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin', password: 'password123' },
  { id: 'u2', name: 'Cashier', password: 'password123' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod_1', name: 'Espresso', price: 2.50, sku: 'ZEN-ESP', barcode: '111111', imageUrl: 'https://images.unsplash.com/photo-1579954115545-b7cd92991697?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_2', name: 'Latte', price: 3.50, sku: 'ZEN-LAT', barcode: '222222', imageUrl: 'https://images.unsplash.com/photo-1561882468-91101f2e5f87?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_3', name: 'Cappuccino', price: 3.50, sku: 'ZEN-CAP', barcode: '333333', imageUrl: 'https://images.unsplash.com/photo-1557006029-3b2a4d8e2797?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_4', name: 'Americano', price: 3.00, sku: 'ZEN-AME', barcode: '444444', imageUrl: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_5', name: 'Mocha', price: 4.00, sku: 'ZEN-MOC', barcode: '555555', imageUrl: 'https://images.unsplash.com/photo-1608079845399-93a145b45b33?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_6', name: 'Iced Coffee', price: 3.25, sku: 'ZEN-ICE', barcode: '666666', imageUrl: 'https://images.unsplash.com/photo-1517701559435-56a42ea95b7f?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_7', name: 'Croissant', price: 2.75, sku: 'ZEN-CRO', barcode: '777777', imageUrl: 'https://images.unsplash.com/photo-1587668178277-2952e7f90c3d?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_8', name: 'Muffin', price: 2.50, sku: 'ZEN-MUF', barcode: '888888', imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_9', name: 'Bagel', price: 3.00, sku: 'ZEN-BAG', barcode: '999999', imageUrl: 'https://images.unsplash.com/photo-1598214886343-7c641b3a652e?q=80&w=2830&auto=format&fit=crop' },
  { id: 'prod_10', name: 'Scone', price: 2.85, sku: 'ZEN-SCO', barcode: '101010', imageUrl: 'https://images.unsplash.com/photo-1621994382629-6133a039913f?q=80&w=2830&auto=format&fit=crop' },
];