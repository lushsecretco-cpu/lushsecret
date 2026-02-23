import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../components/CartContext';
import LuxuryBackground from '../components/LuxuryBackground';

const ciudadesColombia = [
  // Amazonas
  'Leticia', 'Puerto Nariño',
  // Antioquia
  'Medellín', 'Apartadó', 'Bello', 'Caldas', 'Envigado', 'Itagüí', 'Rionegro', 'Sabaneta', 'Turbo', 'Yarumal', 'Caucasia', 'El Carmen de Viboral', 'La Ceja', 'Marinilla', 'Puerto Berrío', 'Santa Fe de Antioquia', 'Andes', 'Chigorodó', 'Urrao',
  // Arauca
  'Arauca', 'Arauquita', 'Saravena', 'Tame', 'Fortul',
  // Atlántico
  'Barranquilla', 'Malambo', 'Puerto Colombia', 'Sabanalarga', 'Soledad', 'Baranoa', 'Galapa', 'Juan de Acosta', 'Polonuevo', 'Tubará',
  // Bolívar
  'Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar', 'Mompós', 'San Juan Nepomuceno', 'Turbana', 'Santa Rosa', 'Simití',
  // Boyacá
  'Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva', 'Puerto Boyacá', 'Garagoa', 'Moniquirá', 'Nobsa', 'Samacá', 'Tibasosa', 'Toca',
  // Caldas
  'Manizales', 'Chinchiná', 'La Dorada', 'Villamaría', 'Anserma', 'Riosucio', 'Aguadas', 'Salamina', 'Supía', 'Pácora',
  // Caquetá
  'Florencia', 'San Vicente del Caguán', 'Puerto Rico', 'El Doncello', 'Belén de los Andaquíes', 'Cartagena del Chairá',
  // Casanare
  'Yopal', 'Aguazul', 'Villanueva', 'Tauramena', 'Monterrey', 'Paz de Ariporo', 'Maní',
  // Cauca
  'Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía', 'Piendamó', 'Miranda', 'Guachené', 'Corinto', 'Cajibío', 'Villa Rica',
  // Cesar
  'Valledupar', 'Aguachica', 'Bosconia', 'Agustín Codazzi', 'Chimichagua', 'Curumaní', 'La Paz', 'Pailitas', 'San Diego',
  // Chocó
  'Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Acandí', 'Bahía Solano', 'Nuquí', 'Riosucio', 'Lloró',
  // Córdoba
  'Montería', 'Cereté', 'Lorica', 'Sahagún', 'Planeta Rica', 'Montelíbano', 'Tierralta', 'Ayapel', 'Chinú', 'Ciénaga de Oro',
  // Cundinamarca
  'Bogotá', 'Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Fusagasugá', 'Madrid', 'Mosquera', 'Cajicá', 'Funza', 'Girardot', 'Cota', 'La Calera', 'Sopó', 'Tabio', 'Tenjo', 'Tocancipá', 'Ubaté', 'Villeta', 'Anapoima', 'El Colegio', 'Gachancipá', 'Guaduas', 'La Mesa', 'Ricaurte', 'Silvania', 'Subachoque', 'Arbeláez', 'Pacho', 'Chocontá', 'Agua de Dios',
  // Guainía
  'Inírida',
  // Guaviare
  'San José del Guaviare', 'Calamar',
  // Huila
  'Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'Gigante', 'Palermo', 'Rivera', 'Aipe', 'San Agustín', 'Timaná', 'Yaguará',
  // La Guajira
  'Riohacha', 'Maicao', 'Uribia', 'Manaure', 'San Juan del Cesar', 'Fonseca', 'Albania', 'Dibulla', 'Villanueva',
  // Magdalena
  'Santa Marta', 'Ciénaga', 'Fundación', 'Plato', 'El Banco', 'Zona Bananera', 'Aracataca', 'Santa Ana', 'Pivijay',
  // Meta
  'Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín', 'Cumaral', 'Restrepo', 'Guamal', 'Puerto Gaitán', 'La Macarena',
  // Nariño
  'Pasto', 'Tumaco', 'Ipiales', 'Túquerres', 'Samaniego', 'La Unión', 'Barbacoas', 'Sandona', 'Cumbal', 'Guachucal', 'Ricaurte',
  // Norte de Santander
  'Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 'Chinácota', 'El Zulia', 'Tibú', 'Cáchira', 'Sardinata', 'Toledo',
  // Putumayo
  'Mocoa', 'Puerto Asís', 'Sibundoy', 'Orito', 'Valle del Guamuez', 'San Miguel', 'Puerto Guzmán',
  // Quindío
  'Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Circasia', 'Quimbaya', 'Filandia', 'Salento', 'Génova', 'Pijao',
  // Risaralda
  'Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Marsella', 'Belén de Umbría', 'Apía', 'Quinchía', 'Guática',
  // San Andrés y Providencia
  'San Andrés', 'Providencia',
  // Santander
  'Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Málaga', 'Socorro', 'Barbosa', 'Zapatoca', 'Vélez', 'Guadalupe', 'El Carmen de Chucurí', 'Puerto Wilches', 'Sabana de Torres',
  // Sucre
  'Sincelejo', 'Corozal', 'San Marcos', 'Sampués', 'Tolú', 'Coveñas', 'Majagual', 'Morroa', 'Ovejas', 'Sincé',
  // Tolima
  'Ibagué', 'Espinal', 'Melgar', 'Líbano', 'Honda', 'Chaparral', 'Purificación', 'Mariquita', 'Armero', 'Flandes', 'Guamo', 'Fresno', 'Cajamarca',
  // Valle del Cauca
  'Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga', 'Jamundí', 'Yumbo', 'Candelaria', 'Florida', 'Pradera', 'Sevilla', 'Roldanillo', 'Zarzal', 'La Unión', 'Dagua', 'Ginebra', 'Guadalajara de Buga', 'El Cerrito', 'Vijes',
  // Vaupés
  'Mitú',
  // Vichada
  'Puerto Carreño', 'La Primavera', 'Cumaribo'
];

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    nombreRecibe: '',
    observaciones: ''
  });

  // Función helper para formatear rutas de imagen
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/200x200?text=Producto';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/images/${imageUrl}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar datos del pedido en localStorage para la página de método de pago
    localStorage.setItem('orderData', JSON.stringify(formData));
    // Redirigir a la página de método de pago
    router.push('/metodo-pago');
  };

  if (cart.length === 0) {
    return (
      <LuxuryBackground>
        <main className="min-h-screen text-white py-24 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-8 tracking-wide">Checkout</h2>
            <p className="text-gray-300 font-light">Tu carrito está vacío. Agrega productos antes de proceder al pago.</p>
          </div>
        </main>
      </LuxuryBackground>
    );
  }

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-12 tracking-wide">Finalizar Compra</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen del Carrito */}
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
            <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">Resumen del Pedido</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex items-center mb-6 pb-6 border-b border-yellow-500/10 last:border-0">
                <img src={formatImageUrl(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4 border border-yellow-500/20" />
                <div className="flex-1">
                  <p className="font-light text-white tracking-wide">{item.name}</p>
                  <p className="text-sm text-gray-400 font-light mt-1">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-light text-yellow-400 text-lg">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
              </div>
            ))}
            <div className="border-t border-yellow-500/30 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <p className="text-xl font-light text-gray-300 tracking-wide">Total:</p>
                <p className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">${getTotal().toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>

          {/* Formulario de Checkout */}
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
            <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">Información de Entrega</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Teléfono Móvil</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Ciudad/Municipio</label>
                <select
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                >
                  <option value="" className="bg-gray-900">Selecciona una ciudad</option>
                  {ciudadesColombia.map((ciudad) => (
                    <option key={ciudad} value={ciudad} className="bg-gray-900">{ciudad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Nombre de quien recibe</label>
                <input
                  type="text"
                  name="nombreRecibe"
                  value={formData.nombreRecibe}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">Observaciones de entrega discreta</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-black/30 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white font-light transition-all duration-300 resize-none"
                  placeholder="Ej: Entregar en horario de oficina, sin timbre, etc."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30 tracking-wide text-lg mt-2"
              >
                Confirmar Pedido - Total: ${getTotal().toLocaleString('es-CO')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
    </LuxuryBackground>
  );
}