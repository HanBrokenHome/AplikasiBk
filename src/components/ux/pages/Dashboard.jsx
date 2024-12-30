import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@mui/icons-material';
import { Button, Container, Typography, Breadcrumbs } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import New from '../pages/ManageSiswa/New';
import SettingsPage from '../pages/ManageSiswa/Setting';
import SettingUser from './user/SettingNewuser';
import DeleteUser from '../pages/ManageSiswa/DeleteUser';
import Laporan from '../pages/ManageSiswa/Laporan';
import AccountControl from '../pages/user/ControlUser';
import NewAccount from '../pages/user/NewUser';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <div className="flex transition-all w-screen h-full">
        {/* Hamburger Button (hanya tampil di tablet dan mobile) */}
        <div className={`absolute top-5 z-[9999999] left-auto right-5 md:right-auto md:hidden`}>
          <button
            className={`text-white p-3 bg-gray-800 rounded ${
              isSidebarOpen ? `bg-red-500` : `bg-blue-500`
            }`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronRightIcon /> : <Menu />}
          </button>
        </div>
  
        {/* Sidebar */}
        <div
        className={`w-56 bg-gray-800 text-white p-5 overflow-y-auto h-screen fixed top-0 transition-transform duration-300 ${
          isSidebarOpen
            ? 'md:left-0 md:right-auto left-auto right-0'
            : 'md:left-0 md:right-auto -left-56 md:-right-auto right-0'
        } md:relative z-10`}
      >
          <h2 className="text-2xl font-bold mb-5 transition-all">My Dashboard</h2>
          <ul>
          <li>
            <button
              className={`w-full text-left p-3 rounded ${
                selectedPage === 'Laporan' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => handlePageChange('Laporan')}
            >
              Laporan
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-3 rounded ${
                selectedPage === 'Tambah Siswa' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => handlePageChange('Tambah Siswa')}
            >
              Siswa Baru
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-3 rounded ${
                selectedPage === 'Settings' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => handlePageChange('Settings')}
            >
              Settings
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-3 rounded ${
                selectedPage === 'Update Siswa' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => handlePageChange('Update Siswa')}
            >
              Update Users
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-3 rounded ${
                selectedPage === 'Delete Siswa' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => handlePageChange('Delete Siswa')}
            >
              Delete User
            </button>
          </li>
          {role === 'SuperAdmin' && (
            <>
              <li>
                <button
                  className={`w-full text-left p-3 rounded ${
                    selectedPage === 'Tambah Akun' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handlePageChange('Tambah Akun')}
                >
                  Tambah Akun
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded ${
                    selectedPage === 'ControlAccount' ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handlePageChange('ControlAccount')}
                >
                  Kontrol Akun
                </button>
              </li>
            </>
          )}
        </ul>
          <Button
            variant="text"
            color="error"
            endIcon={<LogoutIcon />}
            onClick={showConfirmation}
          >
            Logout
          </Button>
        </div>
  
        {/* Content Area */}
        <div
          className={`flex-1 p-8 overflow-y-auto transition-all ${
            isSidebarOpen ? 'ml-0 md:ml-56' : 'ml-0'
          } ${isSidebarOpen ? 'mr-56' : 'mr-0'}`}
        >
          {/* Breadcrumb Navigation */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              href="/"
              onClick={(event) => {
                event.preventDefault();
                handlePageChange('Home');
              }}
            >
              Home
            </Link>
            <Typography color="textPrimary">{selectedPage}</Typography>
          </Breadcrumbs>
          <h1 className="text-4xl font-bold mb-5">{selectedPage} Page</h1>
          <div className="bg-white w-full p-2 shadow-lg rounded">
            {selectedPage === 'Laporan' && <Laporan />}
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
