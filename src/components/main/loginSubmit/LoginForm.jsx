import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../db/firebase'; // Pastikan Anda mengimpor db untuk akses Firestore
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Google } from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State untuk Remember Me
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah pengguna sudah login
    const user = localStorage.getItem('user');
    if (user) {
      onLogin(); // Panggil fungsi onLogin jika pengguna sudah login
      navigate('/Dashboard'); // Arahkan ke Dashboard
    }
    document.getElementById('email').focus();
  }, [navigate, onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Email dan Password harus diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;

      // Memastikan kita mendapatkan status terbaru tentang verifikasi email
      await user.reload();  // Reload user untuk mendapatkan status terbaru

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      // Ambil data pengguna dan role dari Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Simpan data pengguna dan role ke localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email,
          role: userData.role, // Menyimpan role dari Firestore
        }));

        // Panggil onLogin dan arahkan ke Dashboard
        onLogin();
        navigate('/Dashboard');
      } else {
        setError('User data not found in Firestore');
      }
    } catch (error) {
      setError('Login gagal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 h-full dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
             <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input 
                  type="email" 
                  onChange={(e) => setEmail(e.target.value)} 
                  name="email" 
                  id="email" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  onChange={(e) => setPassword(e.target.value)} 
                  id="password" 
                  placeholder="••••••••" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  required 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <Link to="/ForgotPw" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
              </div>
              {loading ? 
                <CircularProgress /> : 
                <button 
                  type="submit" 
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Sign In
                </button>
              }
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to="/SignUp" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
              </p>
              {error && <Alert severity="error" variant="filled">{error}</Alert>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
