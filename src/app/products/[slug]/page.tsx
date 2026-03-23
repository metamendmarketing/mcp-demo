import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/products/ProductDetailView';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params;

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

  // Type cast or transform to match Product interface in ProductDetailView
  const formattedProduct = {
    ...product,
    usageTags: typeof product.usageTags === 'string' ? JSON.parse(product.usageTags) : product.usageTags,
    shellColors: typeof product.shellColors === 'string' ? JSON.parse(product.shellColors) : product.shellColors,
    cabinetColors: typeof product.cabinetColors === 'string' ? JSON.parse(product.cabinetColors) : product.cabinetColors,
    staticReasons: typeof product.staticReasons === 'string' ? JSON.parse(product.staticReasons) : product.staticReasons,
    hotspots: typeof product.hotspots === 'string' ? JSON.parse(product.hotspots) : product.hotspots,
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
      />
    </main>
  );
}
