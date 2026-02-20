import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { username, imageUrl, token } = await req.json();

  if (token !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
  }

  const db = await openDb();
  await db.run(
    'INSERT INTO attendance (nim, image_url, waktu) VALUES (?, ?, datetime("now"))',
    [username, imageUrl]
  );

  return NextResponse.json({ message: 'Foto Tersimpan' });
}