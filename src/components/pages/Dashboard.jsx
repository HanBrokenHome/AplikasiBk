import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Breadcrumbs } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import New from '../pages/ManageSiswa/New';
import SettingsPage from '../pages/ManageSiswa/Setting';
import SettingUser from './user/SettingNewuser';
import DeleteUser from '../pages/ManageSiswa/DeleteUser';
import Home from '../pages/ManageSiswa/Laporan';
import AccountControl from '../pages/user/ControlUser';
import NewAccount from '../pages/user/NewUser';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Home');

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setRole(user.role);
    } else {
      navigate('/Login');
    }
  }, [navigate]);

  const showConfirmation = () => {
    const timeLoad = 1500;
    Swal.fire({
      title: "Yakin ingin Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(false);
        setTimeout(() => {
          localStorage.removeItem('user');
          onLogout();
          navigate('/Login');
          setLoading(true);
        }, timeLoad);
        Swal.fire({
          title: "Berhasil Logout",
          text: "Waiting....",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonText: false,
          showConfirmButton: false,
          timer: timeLoad
        });
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <div className="flex w-screen h-screen">
      {user ? (
        <div className="flex w-screen h-full">
          <div className="w-56 print:hidden h-screen fixed bg-gray-800 text-white p-5 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5">My Dashboard</h2>
            <ul>
              {/* Navigation buttons */}
              <li>
                <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('Laporan')}>
                  Laporan
                </button>
              </li>
              <li>
                <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('Tambah Siswa')}>
                  Siswa Baru
                </button>
              </li>
              <li>
                <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('Settings')}>
                  Settings
                </button>
              </li>
              <li>
                <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('Update Siswa')}>
                  Update Users
                </button>
              </li>
              <li>
                <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('Delete Siswa')}>
                  Delete User
                </button>
              </li>
              {role === "SuperAdmin" && (
                <>
                  <li>
                    <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('Tambah Akun')}>
                      Tambah Akun
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left p-3 hover:bg-gray-700 rounded" onClick={() => handlePageChange('ControlAccount')}>
                      Kontrol Akun
                    </button>
                  </li>
                </>
              )}
            </ul>
            <Button variant="text" color="error" endIcon={<LogoutIcon />} onClick={showConfirmation}>Logout</Button>
          </div>

          <div className="ml-56 print:ml-0 flex-1 p-8 print:p-0 overflow-y-auto print:w-full max-w-screen mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" onClick={(event) => { event.preventDefault(); handlePageChange('Home'); }}>
                Home
              </Link>
              <Typography color="textPrimary">{selectedPage}</Typography>
            </Breadcrumbs>

            <h1 className="text-4xl font-bold mb-5 print:hidden">{selectedPage} Page</h1>
            <div className="bg-white w-full p-2 shadow-lg rounded">
              {selectedPage === 'Laporan' && <Home />}
              {selectedPage === 'Tambah Siswa' && <New />}
              {selectedPage === 'Settings' && <SettingsPage />}
              {selectedPage === 'Update Siswa' && <SettingUser />}
              {selectedPage === 'Delete Siswa' && <DeleteUser />}
              {selectedPage === 'ControlAccount' && <AccountControl />}
              {selectedPage === 'Tambah Akun' && <NewAccount />}
            </div>
          </div>
        </div>
      ) : (
        <Typography variant="h6">Loading...</Typography>
      )}
    </div>
  );
};

export default Dashboard;
