# 📊 Panel de Monitoreo LushSecret

## ✨ Sistema de Análisis Completo Implementado

### 🎯 Características del Panel

El nuevo panel de monitoreo te permite visualizar TODO lo que ocurre en tu web:

#### 📈 Estadísticas Principales
- **Total de Visitas**: Cuenta todas las vistas de páginas
- **Productos Vistos**: Cuántas veces se han visualizado productos
- **Sesiones Únicas**: Número de visitantes diferentes
- **Items al Carrito**: Productos agregados al carrito

#### 🏆 Rankings y Análisis
- **Top 10 Productos Más Visitados**: Con medallas oro/plata/bronce
- **Categorías Más Populares**: Con barras de progreso y porcentajes
- **Productos Agregados al Carrito**: Los más añadidos al carrito
- **Páginas Más Visitadas**: URLs con más tráfico

#### 📅 Análisis Temporal
- **Visitas por Día**: Gráfico de barras con actividad diaria
- **Filtro de Fechas**: Últimas 24h, 7 días, 30 días, 90 días, 1 año

#### ⚡ Actividad en Tiempo Real
- **Stream de Eventos Recientes**: Últimas 50 actividades
- **Información Detallada**: IP, sesión, duración, productos, categorías
- **Tipos de Eventos Rastreados**:
  - 👁️ Vista de página
  - 🛍️ Vista de producto
  - 🛒 Agregado al carrito
  - 💰 Compra realizada
  - 🔍 Búsqueda
  - 👋 Salida de página

---

## 🚀 Cómo Acceder al Panel

### 1. Iniciar los Servidores

**Backend:**
```bash
cd backend
npm start
```
Puerto: http://localhost:4000

**Frontend:**
```bash
cd frontend
npm run dev
```
Puerto: http://localhost:3000

### 2. Acceder como Administrador

1. Ve a http://localhost:3000
2. Inicia sesión con tu cuenta de administrador
3. Navega a: **http://localhost:3000/admin/analytics**

### 3. Explorar el Panel

- **Selector de Periodo**: Arriba a la derecha, elige el rango de fechas
- **Botón Actualizar**: Refresca los datos en tiempo real
- **Scroll**: Desplázate para ver todas las secciones

---

## 🔧 Archivos Creados/Modificados

### Backend
1. **`backend/routes/analyticsRoutes.js`** (NUEVO)
   - Tabla de analytics en base de datos
   - Endpoint POST `/api/analytics/track` - Registrar eventos
   - Endpoint GET `/api/analytics/dashboard` - Obtener estadísticas
   - Endpoint GET `/api/analytics/events/:type` - Filtrar eventos

2. **`backend/server.js`** (MODIFICADO)
   - Agregada ruta `/api/analytics`

### Frontend
1. **`frontend/hooks/useAnalytics.js`** (NUEVO)
   - `usePageTracking()` - Rastrea visitas a páginas
   - `useProductTracking()` - Rastrea vistas de productos
   - `trackAddToCart()` - Rastrea agregados al carrito
   - `trackPurchase()` - Rastrea compras
   - `trackSearch()` - Rastrea búsquedas

2. **`frontend/pages/admin/analytics.js`** (NUEVO)
   - Panel completo de monitoreo
   - Diseño luxury con gradientes gold/yellow
   - Gráficos, tablas y feeds en tiempo real

3. **Páginas Modificadas con Tracking:**
   - `frontend/pages/index.js` - Página de inicio
   - `frontend/pages/producto/[id].js` - Detalle de producto
   - `frontend/pages/carrito.js` - Carrito de compras
   - `frontend/pages/productos.js` - Listado de productos
   - `frontend/pages/contacto.js` - Página de contacto

---

## 📊 Datos Recopilados del Cliente

Para cada evento, se registra:

| Campo | Descripción |
|-------|-------------|
| **event_type** | Tipo de evento (page_view, product_view, etc.) |
| **product_id** | ID del producto (si aplica) |
| **product_name** | Nombre del producto |
| **category** | Categoría del producto |
| **user_ip** | Dirección IP del visitante |
| **user_agent** | Navegador y dispositivo usado |
| **session_id** | ID único de la sesión |
| **page_url** | URL visitada |
| **referrer** | Página de origen |
| **duration** | Tiempo en la página (segundos) |
| **metadata** | Datos adicionales (precio, cantidad, etc.) |
| **created_at** | Fecha y hora exacta |

---

## 🎨 Diseño Luxury

El panel mantiene el estilo premium de LushSecret:

- 🌑 **Fondo**: Gradiente negro con gris oscuro
- ✨ **Acentos**: Dorado/amarillo (#facc15)
- 🔮 **Efectos**: Backdrop blur, sombras, animaciones
- 📱 **Responsive**: Se adapta a móviles y tablets
- ⚡ **Animaciones**: FadeIn en actividad reciente

---

## 🔐 Seguridad

- ✅ Solo usuarios con `userType: 'admin'` pueden acceder
- ✅ Verificación de token JWT
- ✅ Redirige a home si no es administrador

---

## 📝 Uso de los Hooks de Analytics

### En cualquier página:
```javascript
import { usePageTracking } from '../hooks/useAnalytics';

export default function MiPagina() {
  usePageTracking('Nombre de la Página');
  // ... resto del componente
}
```

### En páginas de productos:
```javascript
import { useProductTracking, trackAddToCart } from '../hooks/useAnalytics';

export default function Producto() {
  const [producto, setProducto] = useState(null);
  
  // Rastrea vista del producto
  useProductTracking(producto);
  
  // En el botón de agregar al carrito
  const handleAddToCart = () => {
    trackAddToCart({
      id: producto.id,
      name: producto.name,
      category: producto.category,
      price: producto.price,
      quantity: 1
    });
    // ... resto de la lógica
  };
}
```

---

## 🔄 Actualización Automática

El panel NO se actualiza automáticamente. Para ver datos en tiempo real:

1. Haz clic en el botón **"🔄 Actualizar"**
2. O recarga la página (F5)

**Opcional**: Puedes agregar auto-refresh editando `analytics.js`:
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchDashboardData();
  }, 30000); // Actualiza cada 30 segundos
  
  return () => clearInterval(interval);
}, []);
```

---

## 💡 Consejos de Uso

1. **Analiza Tendencias**: Usa el filtro de 30-90 días para ver patrones
2. **Optimiza lo Popular**: Los productos más visitados son candidatos para destacar
3. **Categorías**: Enfoca marketing en las categorías más vistas
4. **Horarios**: Analiza visitas por hora para saber cuándo hay más tráfico
5. **Conversión**: Compara "agregados al carrito" vs "vistas de producto"

---

## 🐛 Troubleshooting

### No aparecen datos en el panel
- Verifica que el backend esté corriendo (localhost:4000)
- Navega por el sitio como usuario para generar eventos
- Verifica la consola del navegador para errores

### Error "Cannot find module"
```bash
cd frontend
npm install
```

### Tabla analytics no existe
- El backend crea la tabla automáticamente al iniciar
- Reinicia el servidor backend

---

## 🎯 Próximas Mejoras Posibles

- 📊 Gráficos de línea con Chart.js o Recharts
- 🔔 Notificaciones en tiempo real con WebSockets
- 📧 Reportes por email (diarios/semanales)
- 🗺️ Mapa de calor de clics
- 📱 App móvil para monitoreo
- 🤖 IA para predicciones de ventas
- 💬 Chat de soporte integrado
- 🎯 Segmentación de usuarios

---

## ✅ Sistema Completado

¡El panel de monitoreo está 100% funcional! Ya puedes:

✔️ Ver todas las visitas y actividad del sitio  
✔️ Conocer los productos más populares  
✔️ Analizar comportamiento de usuarios  
✔️ Rastrear ventas y conversiones  
✔️ Ver datos en tiempo real  
✔️ Filtrar por fechas  

**¡Disfruta de tu nuevo panel de analytics empresarial con estilo luxury!** 🎉
