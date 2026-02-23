import { API_URL } from '../../config/api';
import React, { useState } from 'react';
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';
import LuxuryBackground from '../../components/LuxuryBackground';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('${API_URL}/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.user.role === 'admin') {
        // Guardar token y tipo de usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userName', data.user.name || data.user.email);
        // Redirigir a panel de admin
        window.location.href = '/admin/dashboard';
      } else {
        setError('Credenciales inválidas o no eres administrador');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-rose-400/30 shadow-lg shadow-rose-400/30">
          <div>
            <div className="flex justify-center">
              <FaShieldAlt className="text-rose-300 text-5xl drop-shadow-lg animate-pulse" />
            </div>
            <h2 className="mt-6 text-center text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 tracking-wide">
              Panel de Administración
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300 font-light">
              Acceso exclusivo para administradores
            </p>
          </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-rose-400/30 placeholder-gray-400 text-white bg-gray-900/80 backdrop-blur-sm rounded-t-md focus:outline-none focus:ring-rose-300 focus:border-rose-300 focus:z-10 sm:text-sm font-light"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-rose-400/30 placeholder-gray-400 text-white bg-gray-900/80 backdrop-blur-sm rounded-b-md focus:outline-none focus:ring-rose-300 focus:border-rose-300 focus:z-10 sm:text-sm font-light"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-light rounded-lg text-black bg-gradient-to-r from-rose-400/80 to-pink-300/80 hover:from-rose-300 hover:to-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Sesión como Admin
            </button>
          </div>

          <div className="text-center">
            <a href="/" className="text-rose-300 hover:text-rose-200 font-light transition-colors">
              Volver al sitio principal
            </a>
          </div>
        </form>
        </div>
      </main>
    </LuxuryBackground>
  );
}

