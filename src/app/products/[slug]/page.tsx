import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/products/ProductDetailView';

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
    <main className="min-h-screen bg-slate-50 pt-20">
      <ProductDetailView 
        product={formattedProduct as any} 
        mode="static" 
        zip={zip}
      />
    </main>
  );
}
