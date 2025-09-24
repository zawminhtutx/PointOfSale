import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Transaction } from '@shared/types';
import { format } from 'date-fns';
interface SalesReportChartProps {
  data: Transaction[];
}
export function SalesReportChart({ data }: SalesReportChartProps) {
  const processData = (transactions: Transaction[]) => {
    const salesByDay: { [key: string]: number } = {};
    transactions.forEach(t => {
      const day = format(new Date(t.timestamp), 'MMM d');
      if (!salesByDay[day]) {
        salesByDay[day] = 0;
      }
      salesByDay[day] += t.total;
    });
    return Object.keys(salesByDay).map(day => ({
      name: day,
      total: salesByDay[day],
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  };
  const chartData = processData(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Report</CardTitle>
        <CardDescription>Total revenue by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend />
            <Bar dataKey="total" fill="rgb(var(--color-zenith-blue))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}