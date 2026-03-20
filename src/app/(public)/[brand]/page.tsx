import React from 'react';
import { getBrandConfig } from '@/lib/brands/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export default async function BrandPage(props: BrandPageProps) {
  const { brand: brandId } = await props.params;
  const brand = getBrandConfig(brandId);

  if (!brand) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-brand-primary mb-6">
        {brand.copy.heroTitle}
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        {brand.copy.heroSubtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href={`/${brand.id}/recommend`}
          className="bg-brand-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform"
        >
          {brand.copy.ctaPrimary}
        </Link>
        <Link 
          href={`/${brand.id}/compare`}
          className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-primary hover:text-white transition-colors"
        >
          {brand.copy.ctaSecondary}
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-4">Step 1: Discover</h3>
          <p className="text-gray-600">Answer a few questions about your needs and lifestyle.</p>
        </div>
        <div className="p-8 border rounded-2xl bg-white shadow-sm border-brand-accent">
          <h3 className="text-xl font-bold mb-4 text-brand-accent">Step 2: Compare</h3>
          <p className="text-gray-600">AI helps you understand the differences between best-fit models.</p>
        </div>
        <div className="p-8 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-4">Step 3: Connect</h3>
          <p className="text-gray-600">Get a personalized buyer summary and find your local dealer.</p>
        </div>
      </div>
    </div>
  );
}
