import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { username, category } = await req.json();
  const db = await openDb();
  
  const vote = await db.get('SELECT * FROM votes WHERE nim = ?', [username]);

  if (!vote) return NextResponse.json({ data: "false" });

  if (category === 'ketua' && vote.pilihan_kahim) {
    return NextResponse.json({ data: "true" });
  } 
  
  if (category === 'senator' && vote.pilihan_senator) {
    return NextResponse.json({ data: "true" });
  }

  return NextResponse.json({ data: "false" });
}