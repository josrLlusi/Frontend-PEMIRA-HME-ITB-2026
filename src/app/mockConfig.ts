// app/mockConfig.ts
export const MOCK_SETTING = {
    isEnabled: true, // Ubah ke false untuk menonaktifkan mock dan menggunakan API asli
  // Status Login
  isLoginSuccess: true, 
  mockNIM: "13224013",
  mockName: "FAUZAN AL-GHAZALI",

  // Status Voting (Ubah true/false untuk tes tampilan tombol Selection)
  votedStatus: { 
    ketua: true,    // Jika true, tombol KAHIM akan jadi abu-abu & bertuliskan VOTED
    senator: true,   // Jika true, tombol SENATOR akan jadi abu-abu & bertuliskan VOTED
  },

  // Status Partisipasi (Untuk halaman Live Count)
  totalSuaraMasuk: 342,
  targetKuorum: 500,

  // Skenario Error (Ubah ke false untuk ngetes ErrorDialogBox)
  isApiHealthy: true, 
};