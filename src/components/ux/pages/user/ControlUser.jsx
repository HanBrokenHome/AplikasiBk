import React, { useEffect, useState } from 'react';
import { Button, Popover, TextField, Typography, Alert, MenuItem, Select, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../../core/db/firebase'; // Import db firestore yang sudah disetting
import { doc, getDocs, updateDoc, deleteDoc, collection } from 'firebase/firestore';
const AccountControl = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState(null);

  // Fungsi untuk mengambil data akun dari Firestore
  
  const fetchAccounts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'accounts'));
      const accountsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Accounts fetched:', accountsData);
      setAccounts(accountsData);  // Menyimpan data akun ke state
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };
  

  useEffect(() => {
    fetchAccounts(); // Memanggil fetchAccounts saat pertama kali component dimuat
  }, []);

  const handlePopoverOpen = (event, email) => {
    setAnchorEl(event.currentTarget);
    setEmail(email);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setEmail('');
    setSuccess(false);
    setError(null);
  };

  const open = Boolean(anchorEl);

  const handleSendResetEmail = async () => {
    setError(null);
    if (!email) {
      setError('Email is required.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const accountRef = doc(db, 'accounts', id);
      await updateDoc(accountRef, { role: newRole });
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === id ? { ...acc, role: newRole } : acc
        )
      );
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteAccountId) return;

    try {
      await deleteDoc(doc(db, 'accounts', deleteAccountId)); // Menghapus data akun dari Firestore
      setAccounts((prevAccounts) =>
        prevAccounts.filter((acc) => acc.id !== deleteAccountId)
      );
      setDialogOpen(false); // Menutup dialog setelah berhasil menghapus akun
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteAccountId(id);
    setDialogOpen(true); // Membuka dialog konfirmasi
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false); // Menutup dialog tanpa melakukan aksi
    setDeleteAccountId(null);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Kontrol Akun
      </Typography>
      {loading ? (
        <CircularProgress /> // Menampilkan loading indicator jika data masih dimuat
      ) : (
        accounts.map((account) => (
          <div
            key={account.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <Typography variant="body1">{account.email}</Typography>
            <Select
              value={account.role}
              onChange={(e) => handleRoleChange(account.id, e.target.value)}
              style={{ width: '150px' }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
            <Button
              variant="outlined"
              onClick={(event) => handlePopoverOpen(event, account.email)}
            >
              Change Password
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => openDeleteDialog(account.id)} // Mengaktifkan dialog konfirmasi untuk hapus akun
            >
              Delete
            </Button>
          </div>
        ))
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={{ padding: '16px', width: '300px' }}>
          <Typography variant="h6">Change Password</Typography>
          <TextField
            fullWidth
            label="Enter user's email"
            variant="outlined"
            margin="normal"
            value={email}
            disabled
          />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Password reset email sent!</Alert>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendResetEmail}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Send Reset Link
          </Button>
        </div>
      </Popover>
      <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountControl;
