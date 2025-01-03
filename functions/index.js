const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Fungsi untuk menetapkan role (Admin atau SuperAdmin)
exports.assignRole = functions.https.onCall(async (data, context) => {
  // Pastikan hanya SuperAdmin yang dapat memanggil fungsi ini
  if (context.auth.token.role !== 'SuperAdmin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Hanya SuperAdmin yang dapat menetapkan role pengguna.'
    );
  }

  const { email, role } = data; // Data dari frontend (email & role)

  // Validasi role
  if (!['Admin', 'SuperAdmin'].includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Role harus Admin atau SuperAdmin.'
    );
  }

  try {
    // Cari user berdasarkan email
    const user = await admin.auth().getUserByEmail(email);

    // Tetapkan custom claims (role)
    await admin.auth().setCustomUserClaims(user.uid, { role });

    return { message: `Role ${role} berhasil diberikan kepada ${email}.` };
  } catch (error) {
    console.error('Error assigning role:', error);
    throw new functions.https.HttpsError('internal', 'Gagal menetapkan role.');
  }
});
