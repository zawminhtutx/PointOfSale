import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import type { Transaction } from '@shared/types';
import { Toaster } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, DollarSign, ShoppingBag, BarChart } from 'lucide-react';
import { StatCard } from '@/components/transaction-history/StatCard';
import { SalesReportChart } from '@/components/transaction-history/SalesReportChart';
import { getColumns } from '@/components/transaction-history/columns';
import { TransactionDataTable } from '@/components/transaction-history/TransactionDataTable';
export function TransactionHistoryPage() {
  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => api('/api/transactions'),
  });
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalRevenue: 0, totalSales: 0, totalItemsSold: 0 };
    }
    const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
    const totalSales = transactions.length;
    const totalItemsSold = transactions.reduce((acc, t) => acc + t.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);
    return { totalRevenue, totalSales, totalItemsSold };
  }, [transactions]);
  const columns = useMemo(() => getColumns(), []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to POS
            </Link>
            <h1 className="text-4xl font-bold font-display text-zenith-dark dark:text-zenith-light">Transaction History</h1>
            <p className="text-muted-foreground">Review past sales and analyze performance.</p>
          </div>
        </header>
        <main className="space-y-8">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={DollarSign} title="Total Revenue" value={stats.totalRevenue} format="currency" />
              <StatCard icon={ShoppingBag} title="Total Sales" value={stats.totalSales} />
              <StatCard icon={BarChart} title="Items Sold" value={stats.totalItemsSold} />
            </div>
          )}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {isLoading ? <Skeleton className="h-96 w-full" /> : <SalesReportChart data={transactions} />}
            </div>
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-1/3" />
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Transactions</AlertTitle>
                  <AlertDescription>{(error as Error).message}</AlertDescription>
                </Alert>
              ) : (
                <TransactionDataTable columns={columns} data={transactions} />
              )}
            </div>
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}