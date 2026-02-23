import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaUser, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import LuxuryBackground from '../components/LuxuryBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirigir según rol
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/cuenta');
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-rose-500/20 shadow-lg shadow-rose-500/20">
          <div>
            <h2 className="mt-6 text-center text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400 tracking-wide">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300 font-light">
              Accede a tu cuenta LushSecret
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
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-900/80 backdrop-blur-sm rounded-t-md focus:outline-none focus:ring-rose-400 focus:border-rose-400 focus:z-10 sm:text-sm font-light"
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
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-900/80 backdrop-blur-sm rounded-b-md focus:outline-none focus:ring-rose-400 focus:border-rose-400 focus:z-10 sm:text-sm font-light"
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
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-light rounded-lg text-white bg-gradient-to-r from-rose-600/80 to-rose-400/80 hover:from-rose-500 hover:to-rose-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/registro" className="text-rose-400 hover:text-rose-300 font-light transition-colors">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>
        </div>
      </main>
    </LuxuryBackground>
  );
}
