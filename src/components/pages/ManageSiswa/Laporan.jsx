
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Paper,
  CircularProgress,
} from "@mui/material";
import { FaPrint, FaSearch } from "react-icons/fa";
import "../../css/Print.css";
import axios from "axios";
import { Delete, PlusOne, Print, Save } from "@mui/icons-material";
import * as XLSX from 'xlsx';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import { getAuth } from "firebase/auth";


const Home = () => {
  const [Result, setResult] = useState(null);
  const [Input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data dari API
  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const fetchData = async () => {
    setIsLoading(true); // Set loading ke true saat fetch data dimulai
    const user = auth.currentUser;
  
    if (!user) {
      setIsLoading(false); // Set loading ke false jika user tidak ditemukan
      throw new Error("User not authenticated");
    }
  
    // Ambil token autentikasi
    const token = await user.getIdToken();
  
    // Buat URL dengan token autentikasi
    const url = `${databaseURL}/.json?auth=${token}`;
  
    // Fetch data
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setData(data); // Simpan data ke state
    } catch (error) {
      setError(error.message); // Set error jika terjadi masalah
    } finally {
      setIsLoading(false); // Set loading ke false setelah fetch selesai
    }
  };
  
  

  // Tambah baris baru di tabel
  const handleAddRow = () => {
    if (Result) {
      const newRow = {
        Tanggal: "",
        Pelanggarans: "",
        Sanksi: "",
        TindakLanjut: "",
      };

      const updatedResult = {
        ...Result,
        PelanggaranList: {
          ...(Result.PelanggaranList || {}),
          [`temp-${Date.now()}`]: newRow,
        },
      };

      setResult(updatedResult);
    }
  };

  // Update data di baris yang diubah
  const handleUpdateRow = (key, field, value) => {
    const updatedResult = {
      ...Result,
      PelanggaranList: {
        ...Result.PelanggaranList,
        [key]: {
          ...Result.PelanggaranList[key],
          [field]: value,
        },
      },
    };
    setResult(updatedResult);
  };

  // Simpan data ke backend
  const handleSaveRow = async (key) => {
    if (Result && Result.PelanggaranList[key]) {
      const rowData = Result.PelanggaranList[key];
      const user = auth.currentUser;
      try {
        try{
          if (!user) {
            alert("User not authenticated!");
            return;
          }
        }
        catch(error) {
          alert(`Gagal menyimpan data! Error: ${error.message}`);
        }
        const token = await user.getIdToken();
        const response = await axios.post(
          `https://database-1b6ea-default-rtdb.firebaseio.com/${Result.id}/PelanggaranList.json?auth=${token}`,
          rowData
        );
  
        const newId = response.data.name;
  
        const updatedResult = {
          ...Result,
          PelanggaranList: {
            ...Result.PelanggaranList,
            [key]: rowData, // Pastikan data diperbarui dengan tanggal baru
          },
        };
  
        setResult(updatedResult);
  
        alert("Data berhasil disimpan!");
      } catch {
        alert("Gagal menyimpan data!");
      }
    }
  };
  

  // Hapus baris dari tabel
  const handleDeleteRow = async (key) => {
    if (Result && Result.PelanggaranList[key]) {
      const user = auth.currentUser;
      try {
        try{
          if (!user) {
            alert("User not authenticated!");
            return;
          }
        }
        catch(error){
          alert
          ("User Tidak Mempunyai Akses")
        }
        const token = await user.getIdToken();
        await axios.delete(
          `https://database-1b6ea-default-rtdb.firebaseio.com/${Result.id}/PelanggaranList/${key}.json?auth=${token}`
        );

        const updatedResult = { ...Result };
        delete updatedResult.PelanggaranList[key];
        setResult(updatedResult);

        alert("Data berhasil dihapus!");
      } catch (error) {
        alert("Gagal menghapus data!");
      }
    }
  };

  const handleSearch = () => {
    if (isLoading) {
      alert("Data masih dimuat, harap tunggu sebentar.");
      return;
    }
  
    if (!data || Object.keys(data).length === 0) {
      alert("Data belum selesai dimuat!");
      return;
    }
  
    const found = Object.entries(data).find(([key, value]) => {
      return value?.NamaSiswa?.toLowerCase().includes(Input.toLowerCase().trim());
    });
  
    if (found) {
      setResult({ ...found[1], id: found[0] });
    } else {
      alert("Nama tidak ditemukan!");
      setResult(null);
    }
  };
  
  // Handle upload foto
  const handlePhotoUpload = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedResult = {
          ...Result,
          PelanggaranList: {
            ...Result.PelanggaranList,
            [key]: {
              ...Result.PelanggaranList[key],
              photo: e.target.result,
            },
          },
        };
        setResult(updatedResult);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Excel
  const handleDownloadExcel = () => {
    if (!Result || !Result.PelanggaranList) return;

    // Mengonversi data ke format array yang bisa diterima oleh Excel
    const tableData = Object.entries(Result.PelanggaranList).map(([key, row]) => ({
      Tanggal: row.Tanggal || '',
      Pelanggaran: row.Pelanggarans || '',
      Sanksi: row.Sanksi || '',
      TindakLanjut: row.TindakLanjut || '',
    }));

    // Membuat workbook Excel menggunakan xlsx.js
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pelanggaran");

    // Mengunduh file Excel
    XLSX.writeFile(wb, "Pelanggaran_Data.xlsx");
  };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handlePrint = () => {
      document.title = "";
    };

    window.addEventListener("beforeprint", handlePrint);

    return () => {
      window.removeEventListener("beforeprint", handlePrint);
    };
  }, []);

const auth = getAuth();
auth.currentUser.getIdToken().then((token) => {
});


  return (
    <div className="w-full h-auto">
      {/* Input Pencarian */}
      <div
        id="Search-Name"
        className="print:hidden w-full border h-56 flex justify-center items-center"
      >
        <TextField
          label="Masukkan Nama"
          className="w-96"
          value={Input}
          onChange={(e) => setInput(e.target.value)}
        />
        {isLoading ?
        <CircularProgress/>
        : 
        <Button
          disabled={isLoading}
          onClick={handleSearch}
          startIcon={<FaSearch />}
        ></Button>
        }
      </div>

      {/* Data Pelanggaran */}
      {Result ? (
        <>
          {/* Informasi Siswa */}
        <h1 className="text-center text-2xl print:bg-slate-400 font-bold pb-5">Catatan Pelanggaran Peserta Didik</h1>
          <div id="Info" className="p-2 w-full gap-1 flex sm:flex sm:flex-col print:bg-slate-300">
            <div>
            <h1 className="font-semibold">Informasi Siswa</h1>
            <li>Nama Siswa : {Result.NamaSiswa}</li>
            <li>Kelas : {Result.MenempatDiKelas}</li>
            </div>
            <div>
              <h1 className="font-semibold">Informasi Orang Tua</h1>
            <li>Nama Ibu Siswa : {Result.NamaIbu}</li>
            <li>Nama Bapak Siswa: {Result.NamaAyah}</li>
            </div>
            <div>
              <h1 className="font-semibold">Informasi Alamat</h1>
            <li>Alamat Siswa: {Result.Alamat}</li>
            <li>Kelurahan Siswa: {Result.Kelurahan}</li>
            <li>Rt: {Result.RT}</li>
            <li>Rw Siswa: {Result.RW}</li>
            </div>
          </div>
          {/* Tabel Pelanggaran */}
          <TableContainer component={Paper} className="print:w-full my-4">
            <Table>
              <TableHead>
                <TableRow className="grid grid-cols-6">
                  <TableCell style={{ padding: '16px', whiteSpace: 'nowrap' }}>Tanggal</TableCell>
                  <TableCell style={{ padding: '16px', whiteSpace: 'nowrap' }}>Pelanggaran</TableCell>
                  <TableCell style={{ padding: '16px', whiteSpace: 'nowrap' }}>Sanksi</TableCell>
                  <TableCell style={{ padding: '16px', whiteSpace: 'nowrap' }}>Tindak Lanjut</TableCell>
                  <TableCell style={{ padding: '16px', whiteSpace: 'nowrap' }}>Gambar</TableCell>
                  <TableCell
                    className="no-print"
                    sx={{
                      "@media print": {
                        display: "none",
                      },
                    }}
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="print:overflow-y-hidden">
                {Result.PelanggaranList ? (
                  Object.entries(Result.PelanggaranList).map(([key, row]) => (
                    <TableRow className="" key={key}>
                      <TableCell>
 <input
  type="date"
  value={row.Tanggal || ""} 
  onChange={(e) => handleUpdateRow(key, "Tanggal", e.target.value)}
  className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</TableCell>
  <TableCell>
  <TextField
  className="text-sm"
  value={row.Pelanggarans}
  multiline
  InputProps={{
    style: { fontSize: "12px", minWidth: "100px", maxWidth: "100px" },
  }}  
  onChange={(e) => handleUpdateRow(key, "Pelanggarans", e.target.value)}
/>

  </TableCell>
  <TableCell>
  <TextField
  value={row.Sanksi}
  multiline
  InputProps={{
    style: { fontSize: "12px", minWidth: "100px", maxWidth: "100px" },
  }}  
  onChange={(e) => handleUpdateRow(key, "Sanksi", e.target.value)}
/>

  </TableCell>
  <TableCell>
  <TextField
  value={row.TindakLanjut}
  multiline
  InputProps={{
    style: { fontSize: "12px", minWidth: "100px", maxWidth: "100px" },
  }}  
  onChange={(e) => handleUpdateRow(key, "TindakLanjut", e.target.value)}
/>

  </TableCell>
 <TableCell>
                        {row.photo ? (
                          <>
                          <div className="w-24">
                            <img
                              src={row.photo}
                              alt={`Uploaded-${key}`}
                              className="w-24 h-24 object-cover border"
                            />
                          </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(key, e)}
                              style={{ display: "none" }}
                              id={`file-input-${key}`}
                            />
                            <label htmlFor={`file-input-${key}`}>
                              <Button
                              sx={{"@media print" : {
                                display : "none"
                              }}}
                                variant="contained"
                                style={{ marginTop: "10px" }}
                                component="span"
                              >
                                Ubah Foto
                              </Button>
                            </label>
                          </>
                        ) : (
                          <input
                          className="print:hidden w-24"
                            type="file"
                            accept="image/*"
                            alt="Upload Gambar"
                            placeholder="Masukkan Gambar"
                            onChange={(e) => handlePhotoUpload(key, e)}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        className="no-print"
                        sx={{
                          "@media print": {
                            display: "none",
                          },
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="success"
                          className="w-10 p-2"
                          onClick={() => handleSaveRow(key)}
                          disabled={isLoading}
                          endIcon={<Save/>}
                        >
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          disabled={isLoading}
                          endIcon={<Delete/>}
                          onClick={() => handleDeleteRow(key)}
                          style={{ marginLeft: "8px" }}
                        >
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Belum Ada Pelanggaran
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex gap-4">
          <Button
            sx={{
              "@media print": {
                display: "none",
              },
            }}
            variant="contained"
            color="primary"
            onClick={handleAddRow}
            className="no-print"
          >
            <AddIcon/>
          </Button>
          <Button
            sx={{
              "@media print": {
                display: "none",
              },
            }}
            onClick={() => window.print()}
            className="no-print"
            color="secondary"
            variant="contained"
          >
            <Print/>
          </Button>
          <Button variant="contained" sx={{"@media print" : {
            display : "none"
          }}} color="success" startIcon={<DescriptionIcon/>} onClick={handleDownloadExcel}>
            Unduh Excel
          </Button>
          </div>
        </>
      ) : Input ? (
        null
      ) : (
        <h1>Masukkan Nama Minimal 2 Kata</h1>
      )}

    </div>
  );
};

export default Home;
