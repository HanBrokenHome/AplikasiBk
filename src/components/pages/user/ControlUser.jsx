import React, { useEffect, useState } from 'react';
import { Button, Popover, TextField, Typography, Alert, MenuItem, Select } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../db/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AccountControl = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data akun dari Firestore
  const fetchAccounts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'accounts')); // Koleksi Firestore
      const accountsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccounts(accountsData);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
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
      const updatedAccounts = accounts.map((acc) =>
        acc.id === id ? { ...acc, role: newRole } : acc
      );
      setAccounts(updatedAccounts);
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'accounts', id));
      const updatedAccounts = accounts.filter((acc) => acc.id !== id);
      setAccounts(updatedAccounts);
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Kontrol Akun
      </Typography>
      {accounts.map((account) => (
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
            onClick={() => handleDelete(account.id)}
          >
            Delete
          </Button>
        </div>
      ))}
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
    </div>
  );
};

export default AccountControl;
