const admin = require("firebase-admin");
const serviceAccount = require("./path/to/serviceAccountKey.json"); // Unduh dari Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
});

module.exports = admin;
