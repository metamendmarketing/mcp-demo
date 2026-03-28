import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { writeFile } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'marquis_admin_session';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const session = (await cookies()).get(COOKIE_NAME);
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Generate Secure Unique Filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const fileName = `${timestamp}_${cleanName}`;
    
    // 4. Save to Public Directory
    // Note: Ensuring path is absolute and relative to the project root
    const uploadDir = path.join(process.cwd(), 'public', 'mcp', 'demo', 'assets', 'product-media');
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    console.log(`[API] File uploaded successfully: ${fileName}`);

    // 5. Return Public URL
    const publicUrl = `/mcp/demo/assets/product-media/${fileName}`;
    return NextResponse.json({ url: publicUrl });

  } catch (error: any) {
    console.error('[API] Upload failed:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
