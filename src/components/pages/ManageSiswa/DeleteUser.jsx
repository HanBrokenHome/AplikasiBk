import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';

const DeleteUser = () => {
  const [siswaData, setSiswaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSiswaId, setSelectedSiswaId] = useState(null);
  const [deleteSiswaName, setDeleteSiswaName] = useState(""); // Input nama siswa yang akan dihapus

  // State untuk form update siswa
  const [updatedSiswaData, setUpdatedSiswaData] = useState({
    NamaSiswa: "",
    NamaAyah: "",
    NamaIbu: "",
    MenempatDiKelas: "",
    Alamat: "",
    TempatLahir: ""
  });

  // Fungsi untuk mencari siswa berdasarkan searchTerm (minimal 3 karakter)
  useEffect(() => {
    if (searchTerm.length >= 3) {
      fetchData(searchTerm);
    } else {
      setSiswaData([]); // Kosongkan data jika searchTerm kurang dari 3 karakter
    }
  }, [searchTerm]);

  // Fetch data siswa berdasarkan pencarian
  const fetchData = async (term) => {
    const auth = getAuth();
      const user = auth.currentUser;
      setIsLoading(true);
      try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `https://database-1b6ea-default-rtdb.firebaseio.com/.json?auth=${token}`
      );
      const data = response.data;
      const filteredData = Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key]
        }))
        .filter(siswa =>
          siswa.NamaSiswa && siswa.NamaSiswa.toLowerCase().includes(term.toLowerCase())
        );
      setSiswaData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle perubahan input pencarian siswa
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  // Menghapus siswa berdasarkan nama yang dimasukkan
  const handleDeleteSiswa = async () => {
    setIsLoading(false)
    const auth = getAuth();
      const user = auth.currentUser;
      if (!deleteSiswaName) {
        alert("Masukkan nama siswa yang ingin dihapus.");
        return;
      }
      
      const siswaToDelete = siswaData.find(siswa =>
        siswa.NamaSiswa.toLowerCase() === deleteSiswaName.toLowerCase()
      );
      
      if (siswaToDelete) {
        try {
          setTimeout(async() => {     
            const token = await user.getIdToken();
            await axios.delete(
              `https://database-1b6ea-default-rtdb.firebaseio.com/${siswaToDelete.id}.json?auth=${token}`
            );
            alert(`${deleteSiswaName} berhasil dihapus!`);
            setDeleteSiswaName(""); // Reset input nama siswa
            fetchData(searchTerm);  // Refresh data setelah penghapusan
            setIsLoading(false)
          }, 1500);
      }
       catch (error) {
        alert("Gagal menghapus siswa!");
      }
      finally{
        setIsLoading(true)
      }
    } else {
      alert("Siswa tidak ditemukan!");
    }
  };

  return (
    <div style={{ padding: "20px" }} className='w-full'>
        <h1>Data Siswa</h1>
        <TextField 
        sx={{width : "100%"}}
        label="Cari Nama"
        value={searchTerm}
        onChange={handleSearch}
        />
           {/* Loading state */}
      {isLoading && <CircularProgress />}

{/* Menampilkan data siswa yang difilter */}
<div className='py-2'>
    <h1 className='font-semibold'>Nama Siswa : </h1>
  {siswaData.length === 0 && !isLoading && searchTerm.length >= 3 && (
    <p>Tidak ada siswa yang ditemukan.</p>
  )}
  {siswaData.map(siswa => (
    <ul key={siswa.id} className='gap-2 px-5'>
      <li className='list-disc'>{siswa.NamaSiswa} ({siswa.MenempatDiKelas})</li>
    </ul>
  ))}
</div>
      <div>
        <h2>Hapus Siswa</h2>
        <TextField
          label="Nama Siswa yang akan Dihapus"
          value={deleteSiswaName}
          onChange={(e) => setDeleteSiswaName(e.target.value)}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteSiswa}
          disabled={isLoading}
        >
          Hapus Siswa
        </Button>
      </div>
    </div>
  );
};

export default DeleteUser;
