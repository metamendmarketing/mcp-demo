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

export async function saveProductConfig(productId: string, data: { hotspots: any[], heroImageUrl?: string, overheadImageUrl?: string }) {
  console.log(`[Admin] Attempting save for Product: ${productId}`, { 
    hotspotCount: data.hotspots?.length,
    hasHero: !!data.heroImageUrl,
    hasOverhead: !!data.overheadImageUrl
  });

  try {
    const auth = await isAuthenticated();
    if (!auth) {
      console.warn("[Admin] Save blocked: Not Authenticated");
      throw new Error('Not authorized');
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        hotspots: JSON.stringify(data.hotspots),
        ...(data.heroImageUrl && { heroImageUrl: data.heroImageUrl }),
        ...(data.overheadImageUrl && { overheadImageUrl: data.overheadImageUrl }),
      },
    });

    console.log(`[Admin] Save SUCCESS for Product: ${productId} (${updated.modelName})`);

    revalidatePath(`/admin/hotspots/${productId}`);
    revalidatePath('/admin');
    revalidatePath('/mcp/demo'); 
    
    return { success: true, message: 'Configuration saved successfully.' };
  } catch (error: any) {
    console.error(`[Admin] Save FATAL for Product: ${productId}:`, error.message);
    return { success: false, error: error.message || 'Database update failed.' };
  }
}

