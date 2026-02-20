import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { username } = await req.json();
  const db = await openDb();
  
  // Cek apakah user sudah memilih KAHIM dan SENATOR
  const vote = await db.get('SELECT * FROM votes WHERE nim = ?', [username]);

  // Logic: Harus sudah pilih dua-duanya baru dianggap "Selesai"
  if (vote && vote.pilihan_kahim && vote.pilihan_senator) {
    return NextResponse.json({ data: "true" });
  } else {
    return NextResponse.json({ data: "false" });
  }
}