import React, { useState } from "react";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAuth } from "firebase/auth";

// Fungsi untuk menambahkan akun baru
export const NewAccount = async (data) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = await user.getIdToken();
  try {
    // Ambil data yang sudah ada
    const response = await axios.get(`https://database-1b6ea-default-rtdb.firebaseio.com/.json?auth=${token}`);
    const existingData = response.data;

    // Hitung ID baru
    let newId = 0;
    if (existingData) {
      const ids = Object.keys(existingData)
        .map((key) => parseInt(key)) // Ubah key menjadi angka
        .filter((id) => !isNaN(id)); // Pastikan hanya angka valid
      newId = ids.length > 0 ? Math.max(...ids) + 1 : 0; // Gunakan ID tertinggi + 1, atau mulai dari 0
    }

    // Simpan data dengan ID baru
    const result = await axios.put(`https://database-1b6ea-default-rtdb.firebaseio.com/${newId}.json?auth=${token}`, data);
    return { id: newId, data: result.data }; // Kembalikan ID baru dan data yang disimpan
  } catch (error) {
    console.error("Error saat menambahkan data:", error);
    throw new Error(error.response?.data || "Terjadi kesalahan!");
  }
};

const New = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    NamaSiswa: "",
    NamaAyah: "",
    NamaIbu: "",
    Alamat: "",
    MenempatDiKelas: "",
    TempatLahir: "",
    Pelanggaran: {
      Pelanggarans: "",
      Sanksi: "",
      Tanggal: "",
      TindakLanjut: "",
    },
    Kecamatan: "",
    Kelurahan: "",
    RT: "",
    RW: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Jika name berada dalam objek Pelanggaran
    if (name in formData.Pelanggaran) {
      setFormData((prev) => ({
        ...prev,
        Pelanggaran: { ...prev.Pelanggaran, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newAccount = await NewAccount(formData);
      alert(`Akun baru berhasil dibuat dengan ID: ${newAccount.id}`);
      setFormData({
        NamaSiswa: "",
        NamaAyah: "",
        NamaIbu: "",
        Alamat: "",
        MenempatDiKelas: "",
        TempatLahir: "",
        Pelanggaran: {
          Pelanggarans: "",
          Sanksi: "",
          Tanggal: "",
          TindakLanjut: "",
        },
        Kecamatan: "",
        Kelurahan: "",
        RT: "",
        RW: "",
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Tambah Data Siswa</h2>

      {/* Input Data Siswa */}
      <div className="flex flex-wrap space-x-4">
        <input
          type="text"
          name="NamaSiswa"
          placeholder="Nama Siswa"
          value={formData.NamaSiswa}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
        <input
          type="text"
          name="NamaAyah"
          placeholder="Nama Ayah"
          value={formData.NamaAyah}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
      </div>

      <div className="flex flex-wrap space-x-4">
        <input
          type="text"
          name="NamaIbu"
          placeholder="Nama Ibu"
          value={formData.NamaIbu}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
        <input
          type="text"
          name="Alamat"
          placeholder="Alamat"
          value={formData.Alamat}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
      </div>

      <div className="flex flex-wrap space-x-4">
        <input
          type="text"
          name="MenempatDiKelas"
          placeholder="Kelas Saat Ini"
          value={formData.MenempatDiKelas}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
        <input
          type="text"
          name="TempatLahir"
          placeholder="Tempat Lahir"
          value={formData.TempatLahir}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
      </div>

      {/* Input Kecamatan, Kelurahan, RT, RW */}
      <div className="flex flex-wrap space-x-4">
        <input
          type="text"
          name="Kecamatan"
          placeholder="Kecamatan"
          value={formData.Kecamatan}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
        <input
          type="text"
          name="Kelurahan"
          placeholder="Kelurahan"
          value={formData.Kelurahan}
          onChange={handleChange}
          className="border p-2 w-full md:w-1/2"
        />
      </div>

      <div className="flex flex-wrap space-x-4">
        <input
          type="text"
          name="RT"
          placeholder="RT"
          value={formData.RT}
          onChange={handleChange}
          className="border p-2 w-1/3"
        />
        <input
          type="text"
          name="RW"
          placeholder="RW"
          value={formData.RW}
          onChange={handleChange}
          className="border p-2 w-1/3"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded flex items-center space-x-2">
        <span>Tambah Siswa</span>
        <AccountCircleIcon />
      </button>
    </form>
  );
};

export default New;
