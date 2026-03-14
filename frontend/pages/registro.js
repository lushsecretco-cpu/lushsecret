import { API_URL } from '../config/api';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import LuxuryBackground from '../components/LuxuryBackground';

export default function Registro() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    city: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (parseInt(formData.age) < 18) {
      setError('Debes tener al menos 18 años para registrarte.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          age: parseInt(formData.age),
          city: formData.city,
          address: formData.address
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Registro exitoso. Redirigiendo al login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Error al registrar');
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
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400 mb-4 tracking-wide">
              Crear Cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300 font-light">
              Únete a LushSecret
            </p>
          </div>
        <form className="mt-8 space-y-6 bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-rose-600/20 shadow-lg shadow-rose-500/10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">Nombre</label>
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-10 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-10 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="phone" className="sr-only">Teléfono</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Teléfono (ej: 3001234567)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="age" className="sr-only">Edad</label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Edad (mínimo 18 años)"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="city" className="sr-only">Ciudad</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Ciudad"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="address" className="sr-only">Dirección</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-10 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirmar Contraseña</label>
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-10 py-3 border border-rose-500/30 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm font-light"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-rose-600/80 to-rose-400/80 hover:from-rose-500 hover:to-rose-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 shadow-lg shadow-rose-500/30 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-rose-400 hover:text-rose-300 font-light transition-colors">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </main>
    </LuxuryBackground>
  );
}


