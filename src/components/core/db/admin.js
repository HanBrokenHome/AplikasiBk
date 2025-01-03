const admin = require("firebase-admin");
const serviceAccount = require("./path/to/serviceAccountKey.json"); // Ganti dengan path yang benar

// Inisialisasi Firebase Admin SDK dengan credential
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // Optional jika menggunakan Realtime Database
});

// Pastikan Anda sudah mengakses Firestore dengan benar
const dbAdmin = admin.firestore(); // Inisialisasi Firestore

module.exports = { admin, dbAdmin };
