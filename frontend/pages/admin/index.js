import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../../components/LuxuryBackground';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay token de autenticación
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si hay token, redirigir al dashboard
      router.push('/admin/dashboard');
    } else {
      // Si no hay token, redirigir al login
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <LuxuryBackground>
      <div className="min-h-screen text-white flex items-center justify-center relative z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-rose-400/30 shadow-lg shadow-rose-400/30">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-300 mx-auto mb-4"></div>
          <p className="text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 text-center">Redirigiendo...</p>
        </div>
      </div>
    </LuxuryBackground>
  );
}

