import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';

const SettingUser = () => {
  const [siswaData, setSiswaData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedSiswaData, setUpdatedSiswaData] = useState({
    NamaSiswa: "",
    NamaAyah: "",
    NamaIbu: "",
    MenempatDiKelas: "",
    Alamat: "",
    TempatLahir: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSiswaId, setSelectedSiswaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk mencari siswa dengan minimal 3 karakter
  useEffect(() => {
    if (searchTerm.length >= 3) {
      fetchData(searchTerm);
    } else {
      setSiswaData([]); // Kosongkan data jika searchTerm kurang dari 3
    }
  }, [searchTerm]);

  // Fungsi untuk mengambil data siswa berdasarkan pencarian
  const fetchData = async (term) => {
    setIsLoading(true);
    const auth = getAuth();
      const user = auth.currentUser;
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
        siswa.NamaSiswa &&  siswa.NamaSiswa.toLowerCase().includes(term.toLowerCase())
        );
      setSiswaData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani perubahan input pencarian
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk memilih siswa yang akan diperbarui
  const handleSelectSiswa = (id) => {
    const siswa = siswaData.find(siswa => siswa.id === id);
    setSelectedSiswaId(id);
    setUpdatedSiswaData(siswa);
    setIsUpdating(true);
  };

  // Fungsi untuk menangani perubahan data siswa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSiswaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi untuk mengirimkan pembaruan ke Firebase
  const handleUpdateSiswa = async () => {
    const auth = getAuth();
      const user = auth.currentUser;
      if (!updatedSiswaData.NamaSiswa) {
        alert("Nama Siswa harus diisi!");
        return;
      }
      
      try {
      const token = await user.getIdToken();
      await axios.put(
        `https://database-1b6ea-default-rtdb.firebaseio.com/${selectedSiswaId}.json?auth=${token}`, 
        updatedSiswaData
      );
      alert("Data Siswa berhasil diperbarui!");
      setIsUpdating(false);
      fetchData(searchTerm);  // Refresh data berdasarkan pencarian
    } catch (error) {
      alert("Gagal memperbarui data siswa!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Siswa</h1>

      {/* Search input */}
      <TextField
        label="Cari Siswa"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        style={{ marginBottom: "20px" }}
      />

      {/* Tampilkan loading jika data sedang dimuat */}
      {isLoading && <CircularProgress />}

      {/* Menampilkan data siswa yang sudah difilter */}
      <div>
        {siswaData.length === 0 && !isLoading && searchTerm.length >= 3 && (
          <p>Tidak ada siswa yang ditemukan.</p>
        )}
        {siswaData.map(siswa => (
          <div key={siswa.id}>
            <p>{siswa.NamaSiswa} ({siswa.MenempatDiKelas})</p>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSelectSiswa(siswa.id)}
            >
              Update
            </Button>
          </div>
        ))}
      </div>

      {/* Formulir Update Siswa */}
      {isUpdating && (
        <div>
          <h2>Update Data Siswa</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateSiswa(); }}>
            <TextField
              label="Nama Siswa"
              name="NamaSiswa"
              value={updatedSiswaData.NamaSiswa}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Kelas"
              name="MenempatDiKelas"
              value={updatedSiswaData.MenempatDiKelas}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Nama Ibu"
              name="NamaIbu"
              value={updatedSiswaData.NamaIbu}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Nama Ayah"
              name="NamaAyah"
              value={updatedSiswaData.NamaAyah}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Alamat"
              name="Alamat"
              value={updatedSiswaData.Alamat}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Tempat Lahir"
              name="TempatLahir"
              value={updatedSiswaData.TempatLahir}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <Button type="submit" variant="contained" color="primary">
              Simpan Pembaruan
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingUser;
