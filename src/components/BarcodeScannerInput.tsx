import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
interface BarcodeScannerInputProps {
  onScan: (barcode: string) => void;
  className?: string;
}
export function BarcodeScannerInput({ onScan, className }: BarcodeScannerInputProps) {
  const [barcode, setBarcode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (barcode.trim()) {
        onScan(barcode.trim());
        setBarcode('');
      }
    }
  };
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Scan barcode or search products..."
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-12 h-14 text-lg rounded-lg shadow-sm"
        autoFocus
      />
    </div>
  );
}