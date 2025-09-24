import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { ProductFormValues } from '@shared/zod-schemas';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, ArrowLeft, AlertCircle, History } from 'lucide-react';
import { getColumns } from '@/components/product-management/columns';
import { ProductDataTable } from '@/components/product-management/ProductDataTable';
import { ProductFormDialog } from '@/components/product-management/ProductFormDialog';
import { DeleteProductAlert } from '@/components/product-management/DeleteProductAlert';
export function ProductManagementPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api('/api/products'),
  });
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setFormOpen(false);
      setAlertOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast.error('An error occurred', { description: error.message });
    },
  };
  const createMutation = useMutation({
    mutationFn: (newProduct: ProductFormValues) => api<Product>('/api/products', { method: 'POST', body: JSON.stringify(newProduct) }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Product created successfully!');
      mutationOptions.onSuccess();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (updatedProduct: ProductFormValues) => api<Product>(`/api/products/${updatedProduct.id}`, { method: 'PUT', body: JSON.stringify(updatedProduct) }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Product updated successfully!');
      mutationOptions.onSuccess();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => api(`/api/products/${productId}`, { method: 'DELETE' }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      mutationOptions.onSuccess();
    },
  });
  const handleFormSubmit = (values: ProductFormValues) => {
    if (selectedProduct) {
      updateMutation.mutate({ ...values, id: selectedProduct.id });
    } else {
      createMutation.mutate(values);
    }
  };
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setAlertOpen(true);
  };
  const confirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };
  const columns = useMemo(() => getColumns(handleEdit, handleDelete), []);
  const isPending = createMutation.isPending || updateMutation.isPending;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to POS
            </Link>
            <h1 className="text-4xl font-bold font-display text-zenith-dark dark:text-zenith-light">Product Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage your product catalog.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/history">
                <History className="mr-2 h-4 w-4" />
                History
              </Link>
            </Button>
            <Button onClick={() => { setSelectedProduct(null); setFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </header>
        <main>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-96 w-full" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Products</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && <ProductDataTable columns={columns} data={products} />}
        </main>
      </div>
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isPending={isPending}
        initialData={selectedProduct}
      />
      <DeleteProductAlert
        open={isAlertOpen}
        onOpenChange={setAlertOpen}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}