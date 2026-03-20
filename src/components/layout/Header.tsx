import React from 'react';
import Link from 'next/link';
import { BrandConfig } from '@/lib/brands/config';

interface HeaderProps {
  brand: BrandConfig;
}

export const Header: React.FC<HeaderProps> = ({ brand }) => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${brand.id}`} className="flex items-center gap-2">
          {/* In a real app, use brand.theme.logoUrl */}
          <span className="text-xl font-bold text-brand-primary">
            {brand.name}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${brand.id}/recommend`} className="text-sm font-medium hover:text-brand-accent transition-colors">
            Find Your Spa
          </Link>
          <Link href={`/${brand.id}/compare`} className="text-sm font-medium hover:text-brand-accent transition-colors">
            Compare Models
          </Link>
          <Link href={`/${brand.id}/dealer`} className="text-sm font-medium hover:text-brand-accent transition-colors">
            Find a Dealer
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            {brand.copy.ctaPrimary}
          </button>
        </div>
      </div>
    </header>
  );
};
