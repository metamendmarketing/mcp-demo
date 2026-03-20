import React from 'react';
import { notFound } from 'next/navigation';
import { getBrandConfig } from '@/lib/brands/config';
import { getThemeStyles } from '@/lib/brands/themes';
import { Header } from '@/components/layout/Header';

interface BrandLayoutProps {
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}

export default async function BrandLayout({
  children,
  params,
}: BrandLayoutProps) {
  const { brand: brandId } = await params;
  const brand = getBrandConfig(brandId);

  if (!brand) {
    notFound();
  }

  const themeStyles = getThemeStyles(brand.theme);

  return (
    <div style={themeStyles} className="min-h-screen flex flex-col">
      <Header brand={brand} />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
