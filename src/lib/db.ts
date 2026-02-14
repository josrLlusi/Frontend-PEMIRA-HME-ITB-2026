// lib/db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Fungsi untuk membuka koneksi ke file database.db
export async function openDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
}