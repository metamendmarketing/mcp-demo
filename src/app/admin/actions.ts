'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const COOKIE_NAME = 'marquis_admin_session';

/**
 * Basic login action for the demo admin portal.
 */
export async function login(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === 'admin' && password === 'test') {
    (await cookies()).set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin');
  }

  return { error: 'Invalid credentials' };
}

/**
 * Logout action.
 */
export async function logout() {
  (await cookies()).delete(COOKIE_NAME);
  redirect('/admin/login');
}

/**
 * Check if the current user is authenticated.
 */
export async function isAuthenticated() {
  const session = (await cookies()).get(COOKIE_NAME);
  return session?.value === 'authenticated';
}

/**
 * Saves the hotspot configuration for a product.
 */
export async function saveProductConfig(productId: string, data: { hotspots: any[], heroImageUrl?: string, overheadImageUrl?: string }) {
  if (!(await isAuthenticated())) {
    throw new Error('Not authorized');
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      hotspots: JSON.stringify(data.hotspots),
      ...(data.heroImageUrl && { heroImageUrl: data.heroImageUrl }),
      ...(data.overheadImageUrl && { overheadImageUrl: data.overheadImageUrl }),
    },
  });

  revalidatePath(`/admin/hotspots/${productId}`);
  revalidatePath('/mcp/demo'); // Revalidate frontend path if matching
  return { success: true };
}
