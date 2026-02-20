// scripts/setup-db.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setup() {
  // Buka (atau buat baru) file database.db
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  console.log('🔄 Membuat tabel...');

  // 1. Tabel USERS (Daftar Mahasiswa)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      nim TEXT PRIMARY KEY,
      nama TEXT,
      password TEXT
    );
  `);

  // 2. Tabel VOTES (Suara)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
      nim TEXT PRIMARY KEY,
      pilihan_kahim TEXT,
      waktu_kahim DATETIME,
      pilihan_senator TEXT,
      waktu_senator DATETIME
    );
  `);

  // 3. Tabel ATTENDANCE (Absensi Foto)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nim TEXT,
      image_url TEXT,
      waktu DATETIME
    );
  `);

  console.log('✅ Tabel berhasil dibuat!');
  console.log('INSERT Data Dummy Mahasiswa...');

  // Masukkan User Dummy (Password: 12345)
  // Anda bisa login pakai NIM: 13221001 / Password: 12345
  await db.run(`INSERT OR IGNORE INTO users (nim, nama, password) VALUES ('13221001', 'Budi Santoso', '12345')`);
  await db.run(`INSERT OR IGNORE INTO users (nim, nama, password) VALUES ('13221002', 'Siti Aminah', '12345')`);
  await db.run(`INSERT OR IGNORE INTO users (nim, nama, password) VALUES ('13221003', 'Asep Knalpot', '12345')`);
  await db.run(`INSERT OR IGNORE INTO users (nim, nama, password) VALUES ('13224013', 'Jose Ganteng', 'BANGGANTENG')`);
  await db.run(`INSERT OR IGNORE INTO users (nim, nama, password) VALUES ('1300014', 'Dimas Ganteng', 'BANGGANTENG')`);

  console.log('🎉 Database siap digunakan! File: database.db');
}

setup();