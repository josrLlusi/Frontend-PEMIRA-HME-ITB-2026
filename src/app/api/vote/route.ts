import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { username, pilihan, category, token } = await req.json();

  if (token !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
  }

  const db = await openDb();

  // 1. Pastikan user ada di tabel votes (jika belum, buat baris baru)
  // Menggunakan INSERT OR IGNORE agar tidak error jika sudah ada
  await db.run('INSERT OR IGNORE INTO votes (nim) VALUES (?)', [username]);

  // 2. Update kolom sesuai kategori
  if (category === 'ketua') {
    await db.run(
      'UPDATE votes SET pilihan_kahim = ?, waktu_kahim = datetime("now") WHERE nim = ?', 
      [pilihan, username]
    );
  } else if (category === 'senator') {
    await db.run(
      'UPDATE votes SET pilihan_senator = ?, waktu_senator = datetime("now") WHERE nim = ?', 
      [pilihan, username]
    );
  }

  return NextResponse.json({ message: 'Vote Berhasil' });
}