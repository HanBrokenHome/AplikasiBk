import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Inisialisasi Firebase Admin SDK dengan service account key
admin.initializeApp({
  credential: admin.credential.cert('../config/service.json'),
});

const db = admin.firestore();

// Membaca file JSON
const data = JSON.parse(readFileSync('./siswa.json', 'utf8'));

// Fungsi untuk mengimpor data ke Firestore dengan tambahan properti
const importData = async () => {
  const batch = db.batch();

  // Menambahkan data siswa dengan properti tambahan
  data.forEach((siswa, index) => {
    const siswaRef = db.collection('siswa').doc(`siswa_${index + 1}`);
    batch.set(siswaRef, {
      ...siswa,
      role: 'siswa', // Menambahkan role default
      bayar: false,  // Status bayar default
    });
  });
  try {
    await batch.commit();
    console.log('Data berhasil diimpor ke Firestore dengan tambahan properti');
  } catch (error) {
    console.error('Gagal mengimpor data:', error);
  }
};

importData();
