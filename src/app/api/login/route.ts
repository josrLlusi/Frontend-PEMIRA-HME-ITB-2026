import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { username, pass, token } = await req.json();

  // Validasi Token Rahasia
  if (token !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
  }

  const db = await openDb();
  // Cari user berdasarkan NIM dan Password (sederhana tanpa hash dulu biar mudah)
  const user = await db.get('SELECT * FROM users WHERE nim = ? AND password = ?', [username, pass]);

  if (user) {
    return NextResponse.json({ ID: user.nim, nama: user.nama });
  } else {
    return NextResponse.json({ message: 'NIM atau Password Salah' }, { status: 401 });
  }
}