// AddUserAndChangeRole.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../db/firebase"; // Import Firebase yang sudah disetting
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AddUserAndChangeRole = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cek status login pengguna
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log("No user logged in");
      }
    });
  }, []);

  // Ambil data pengguna setelah login
  const fetchUsers = async () => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === "SuperAdmin") {
        // Hanya SuperAdmin yang bisa menambah user dan mengubah role
        // Ambil daftar semua pengguna
        const userCollection = await db.collection("users").get();
        setUserList(userCollection.docs.map((doc) => doc.data()));
      }
    }
  };

  // Fungsi untuk menambah pengguna baru
  const addUser = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== "SuperAdmin") return;

    setLoading(true);
    try {
      // Tambahkan pengguna baru ke Firestore
      await setDoc(doc(db, "users", email), {
        email,
        role,
      });
      alert("Pengguna baru berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding user: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengganti role pengguna
  const changeRole = async (userId, newRole) => {
    if (!currentUser || currentUser.role !== "SuperAdmin") return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { role: newRole }, { merge: true });
      alert("Role pengguna berhasil diubah!");
    } catch (error) {
      console.error("Error changing role: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Tambah Pengguna dan Ubah Role</h1>

      {currentUser && currentUser.role === "SuperAdmin" ? (
        <>
          {/* Form untuk menambah pengguna */}
          <form onSubmit={addUser}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Pengguna"
                required
              />
            </div>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Menambah..." : "Tambah Pengguna"}
            </button>
          </form>

          <h2>Daftar Pengguna</h2>
          <ul>
            {userList.map((user) => (
              <li key={user.email}>
                {user.email} - {user.role}
                <button
                  onClick={() => changeRole(user.email, user.role === "Admin" ? "SuperAdmin" : "Admin")}
                >
                  Ganti Role
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      )}
    </div>
  );
};

export default AddUserAndChangeRole;
