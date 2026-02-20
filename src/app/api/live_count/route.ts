import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Agar tidak di-cache oleh Next.js

export async function GET() {
  const db = await openDb();
  
  // LOGIKA SQL: Hitung spesifik menggunakan SUM(CASE WHEN...)
  // Ini teknik "Pivot" sederhana agar cuma butuh 1 kali query ke database
  const result = await db.get(`
    SELECT 
      -- Hitung Total Partisipasi (Salah satu sudah terisi)
      SUM(CASE WHEN pilihan_kahim IS NOT NULL OR pilihan_senator IS NOT NULL THEN 1 ELSE 0 END) as total_partisipasi,
      
      -- Hitung Detail KAHIM
      SUM(CASE WHEN pilihan_kahim = '00' THEN 1 ELSE 0 END) as kahim_00,
      SUM(CASE WHEN pilihan_kahim = '01' THEN 1 ELSE 0 END) as kahim_01,
      
      -- Hitung Detail SENATOR
      SUM(CASE WHEN pilihan_senator = '00' THEN 1 ELSE 0 END) as senator_00,
      SUM(CASE WHEN pilihan_senator = '01' THEN 1 ELSE 0 END) as senator_01
    FROM votes
  `);
  
  // Kembalikan data lengkap
  return NextResponse.json({
    suara: result.total_partisipasi || 0, // Fallback ke 0 jika null
    detail: {
      kahim: {
        '00': result.kahim_00 || 0,
        '01': result.kahim_01 || 0
      },
      senator: {
        '00': result.senator_00 || 0,
        '01': result.senator_01 || 0
      }
    }
  }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}