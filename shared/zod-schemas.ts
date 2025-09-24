import { z } from 'zod';
export const productSchema = z.object({
  id: z.string().optional(), // Optional for creation, present for updates
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  sku: z.string().min(1, { message: "SKU is required." }),
  barcode: z.string().min(1, { message: "Barcode is required." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
export type ProductFormValues = z.infer<typeof productSchema>;