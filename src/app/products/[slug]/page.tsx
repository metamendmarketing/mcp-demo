import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/products/ProductDetailView';
import { House, CaretRight } from '@/components/icons';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    zip?: string;
  }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { zip } = await searchParams;

  const productRes = await prisma.product.findUnique({
    where: { slug },
    include: {
      series: true
    }
  });

  if (!productRes) {
    notFound();
  }

  const product = productRes as any;

  // Safe JSON parsing with fallbacks
  const safeParse = (data: any, fallback: any = []) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return fallback;
      }
    }
    return data || fallback;
  };

  const formattedProduct = {
    ...product,
    usageTags: safeParse(product.usageTags),
    shellColors: safeParse(product.shellColors),
    cabinetColors: safeParse(product.cabinetColors),
    staticReasons: safeParse(product.staticReasons),
    hotspots: safeParse(product.hotspots),
    series: product.series ? {
      name: product.series.name,
      positioningTier: product.positioningTier || undefined
    } : undefined
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="w-full bg-[#181818] py-4 border-b border-white/5 sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <a href="/mcp/demo/" className="flex items-center gap-8 group cursor-pointer">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-500" />
          </a>
          <nav className="hidden xl:flex items-center gap-12 text-[11px] uppercase font-black tracking-[0.1em] text-white">
            <Link href="/products" className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Hot<br/>Tubs</Link>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Swim<br/>Spas</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Options &<br/>Accessories</span>
          </nav>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 italic">
          <a href="/mcp/demo/" className="hover:text-marquis-blue cursor-pointer transition-colors flex items-center gap-1.5">
            <House className="w-3.5 h-3.5" weight="fill" />
            Home
          </a>
          <CaretRight className="w-3 h-3 text-slate-300" weight="bold" />
          <Link href="/products" className="hover:text-marquis-blue cursor-pointer transition-colors">Products</Link>
          <CaretRight className="w-3 h-3 text-slate-300" weight="bold" />
          <span className="text-marquis-blue">{product.modelName}</span>
        </div>
      </div>

      <div className="pt-8">
        <ProductDetailView 
          product={formattedProduct as any} 
          mode="static" 
          zip={zip}
        />
      </div>
    </main>
  );
}
