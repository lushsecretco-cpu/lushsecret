import { useRouter } from 'next/router';
import LineaIntima from '../../categorias/linea-intima';
import LubCare from '../../categorias/lub-care';
import PowerUp from '../../categorias/power-up';
import SmartPleasure from '../../categorias/smart-pleasure';
import ZonaFetish from '../../categorias/zona-fetish';
import LuxuryBackground from '../../components/LuxuryBackground';

const categoriaComponents = {
  'linea-intima': LineaIntima,
  'lub-care': LubCare,
  'power-up': PowerUp,
  'smart-pleasure': SmartPleasure,
  'zona-fetish': ZonaFetish,
};

const categoriaTitles = {
  'linea-intima': 'Línea Íntima',
  'lub-care': 'Lub & Care',
  'power-up': 'Power Up',
  'smart-pleasure': 'Smart Pleasure',
  'zona-fetish': 'Zona Fetish',
};

export default function CategoriaPage() {
  const router = useRouter();
  const { categoria } = router.query;

  const Component = categoriaComponents[categoria];
  const title = categoriaTitles[categoria];

  // Esperar a que el router esté listo
  if (!router.isReady) {
    return (
      <LuxuryBackground>
        <div className="min-h-screen text-white flex items-center justify-center">
          <p className="text-xl">Cargando...</p>
        </div>
      </LuxuryBackground>
    );
  }

  if (!Component) {
    return (
      <LuxuryBackground>
        <div className="min-h-screen text-white flex items-center justify-center">
          <p className="text-xl">Categoría no encontrada</p>
        </div>
      </LuxuryBackground>
    );
  }

  return (
    <LuxuryBackground>
      <div className="container mx-auto px-4 py-12">
        {/* Título minimalista y elegante */}
        <div className="relative mb-16">
          <div className="text-center">
            {/* Título principal sin negrita */}
            <h1 className="relative inline-block">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wide bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_30px_rgba(251,113,133,0.6)] hover:drop-shadow-[0_0_50px_rgba(251,113,133,0.8)] transition-all duration-700 hover:scale-105 cursor-default" style={{ letterSpacing: '0.05em' }}>
                {title}
              </span>
            </h1>
            
            {/* Línea decorativa sutil */}
            <div className="flex items-center justify-center mt-6 mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent drop-shadow-[0_0_10px_rgba(251,113,133,0.5)]"></div>
            </div>
            
            {/* Subtítulo minimalista */}
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-rose-300/70 to-gray-300 text-sm tracking-widest uppercase font-extralight">
              Explora nuestra colección exclusiva
            </p>
          </div>
        </div>
        
        <Component />
      </div>
    </LuxuryBackground>
  );
}