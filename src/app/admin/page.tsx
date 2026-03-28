import React from 'react';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from './actions';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    return <AdminLogin />;
  }

  const products = await prisma.product.findMany({
    include: { series: true },
    orderBy: { modelName: 'asc' }
  });

  return <AdminDashboard products={products} />;
}
