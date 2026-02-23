# Sistema de Tracking de Envíos

## ✅ Sistema Completo Implementado

El sistema de tracking automático está completamente funcional y listo para usar.

## Características

### 🎯 Para Clientes
- **Página de Seguimiento**: Los clientes pueden ver el estado actualizado de su pedido en tiempo real
- **Notificaciones por Email**: Reciben un correo electrónico automático cada vez que cambia el estado de su envío
- **Historial Completo**: Pueden ver todo el historial de movimientos de su pedido
- **Información Detallada**: Número de guía, transportadora, fecha estimada de entrega

### 👤 Para Administradores
- **Panel de Gestión**: Interface intuitiva para actualizar estados de envío
- **Vista de Pedidos Activos**: Lista de todos los pedidos pendientes de envío
- **Actualización Rápida**: Formulario simple para actualizar el estado y notificar al cliente
- **Emails Automáticos**: El cliente recibe un correo cada vez que actualizas el estado

## Estados de Envío Disponibles

| Estado | Descripción | Icono |
|--------|-------------|-------|
| `pending` | Pedido Recibido | 📦 |
| `processing` | En Preparación | ⚙️ |
| `packed` | Empacado | 📦 |
| `shipped` | En Camino | 🚚 |
| `out_for_delivery` | En Reparto | 🏃 |
| `delivered` | Entregado | ✅ |
| `failed` | Intento Fallido | ⚠️ |
| `returned` | Devuelto | ↩️ |

## Estructura de la Base de Datos

### Tabla `orders` (actualizada)
```sql
- tracking_number VARCHAR(100)      -- Número de guía
- shipping_status VARCHAR(50)       -- Estado del envío
- shipping_carrier VARCHAR(100)     -- Transportadora
- estimated_delivery TIMESTAMP      -- Fecha estimada de entrega
```

### Tabla `tracking_history` (nueva)
```sql
- id SERIAL PRIMARY KEY
- order_id INTEGER                  -- Referencia a la orden
- status VARCHAR(50)                -- Estado del envío
- location VARCHAR(255)             -- Ubicación actual
- description TEXT                  -- Descripción/nota
- created_at TIMESTAMP              -- Fecha del evento
```

## Endpoints del Backend

### 1. GET `/api/tracking/:orderId`
Obtiene información completa de tracking de un pedido.

**Response:**
```json
{
  "order": {
    "id": 1,
    "total": 100000,
    "shipping_status": "shipped",
    "tracking_number": "1234567890",
    "shipping_carrier": "Servientrega",
    "estimated_delivery": "2026-03-01T00:00:00Z",
    "customer_info": {...}
  },
  "tracking_history": [
    {
      "id": 1,
      "status": "shipped",
      "location": "Bogotá - Centro de Distribución",
      "description": "En camino a tu ciudad",
      "created_at": "2026-02-22T10:00:00Z"
    }
  ],
  "items": [...]
}
```

### 2. POST `/api/tracking/update`
Actualiza el estado de un envío y envía email al cliente.

**Request:**
```json
{
  "order_id": 1,
  "shipping_status": "shipped",
  "tracking_number": "1234567890",
  "shipping_carrier": "Servientrega",
  "estimated_delivery": "2026-03-01",
  "location": "Bogotá - Centro de Distribución",
  "description": "Tu pedido está en camino"
}
```

**Response:**
```json
{
  "success": true,
  "order": {...},
  "message": "Estado de envío actualizado y email enviado"
}
```

### 3. GET `/api/tracking/admin/pending`
Obtiene todos los pedidos activos (para panel de admin).

**Response:**
```json
[
  {
    "id": 1,
    "total": 100000,
    "shipping_status": "processing",
    "customer_info": {...},
    "items_count": 3
  }
]
```

## Páginas del Frontend

### 1. `/tracking/[id]` - Página de Tracking para Clientes
Muestra el estado actual y el historial completo del pedido.

**URL de ejemplo:**
```
http://localhost:3000/tracking/1
```

**Características:**
- Estado actual destacado con icono
- Línea de tiempo del historial
- Información de envío y productos
- Botón de actualizar estado
- Diseño luxury con estilo dorado

### 2. `/admin/shipping` - Panel de Gestión para Admins
Interface para actualizar estados de envío.

**URL:**
```
http://localhost:3000/admin/shipping
```

**Características:**
- Lista de pedidos activos
- Formulario de actualización
- Actualización en tiempo real
- Notificación automática por email

## Sistema de Emails

### Configuración

1. **Gmail (recomendado para desarrollo)**

   Crear una contraseña de aplicación:
   - Ve a tu cuenta de Google → Seguridad
   - Habilita "Verificación en 2 pasos"
   - Ve a "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   
   Agrega en `.env`:
   ```env
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASSWORD=tu-contraseña-de-aplicacion
   ```

2. **Otros proveedores**
   
   Edita `backend/routes/trackingRoutes.js`:
   ```javascript
   const transporter = nodemailer.createTransport({
     host: 'smtp.tuprovedor.com',
     port: 587,
     secure: false,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD
     }
   });
   ```

### Plantilla de Email

Los emails enviados incluyen:
- ✅ Diseño luxury con colores dorados
- ✅ Estado actual del pedido
- ✅ Número de guía y transportadora
- ✅ Ubicación actual
- ✅ Fecha estimada de entrega
- ✅ Link directo a la página de tracking
- ✅ Responsive (se ve bien en móvil)

## Flujo Completo de Uso

### 1. Cliente Realiza un Pedido
```
Checkout → Método de Pago → Bold → Orden Creada
Status: pending
```

### 2. Admin Actualiza el Estado
```
Admin Panel (/admin/shipping)
→ Selecciona pedido
→ Actualiza estado a "processing"
→ Agrega número de guía y transportadora
→ Click en "Actualizar y Notificar"
```

### 3. Cliente Recibe Email Automático
```
📧 Email con actualización
→ "Tu pedido está En Preparación"
→ Link a página de tracking
```

### 4. Cliente Revisa el Tracking
```
Click en link del email
→ /tracking/1
→ Ve estado actual e historial completo
```

### 5. Actualizaciones Posteriores
```
Admin actualiza a "shipped"
→ Cliente recibe email automático
→ Cliente ve actualización en página de tracking
```

## Ejemplo de Actualización por Admin

1. Ir a `/admin/shipping`
2. Seleccionar pedido de la lista
3. Llenar formulario:
   ```
   Estado: En Camino
   Número de Guía: 9876543210
   Transportadora: Servientrega
   Entrega Estimada: 2026-02-25
   Ubicación: Medellín - En tránsito
   Descripción: Tu pedido llegará mañana
   ```
4. Click en "Actualizar y Notificar"
5. ✅ Estado actualizado
6. ✅ Email enviado al cliente automáticamente

## Integración con el Sistema Existente

El sistema de tracking se integra perfectamente con:

✅ **Sistema de Órdenes**: Usa la tabla `orders` existente
✅ **Sistema de Pagos Bold**: Se activa cuando el pago es exitoso
✅ **Sistema de Analytics**: Registra eventos de entrega
✅ **Panel de Admin**: Nueva sección para gestión de envíos

## URL de Tracking para Compartir

Los clientes pueden acceder a su tracking con:
```
http://tu-dominio.com/tracking/[ID_DEL_PEDIDO]
```

Puedes compartir este link por:
- Email automático (ya incluido)
- WhatsApp
- SMS
- Panel de usuario

## Pruebas

### 1. Probar Backend
```bash
# Obtener tracking de un pedido
curl http://localhost:4000/api/tracking/1

# Actualizar estado
curl -X POST http://localhost:4000/api/tracking/update \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "shipping_status": "shipped",
    "tracking_number": "TEST123",
    "description": "Prueba de notificación"
  }'
```

### 2. Probar Frontend
1. Ir a `http://localhost:3000/admin/shipping`
2. Seleccionar un pedido
3. Actualizar estado
4. Verificar que llegue el email
5. Ir a `http://localhost:3000/tracking/1`
6. Verificar que se vea el estado actualizado

## Personalización

### Cambiar Colores del Email
Edita `backend/routes/trackingRoutes.js` en la función `sendTrackingEmail()`:
```javascript
background: linear-gradient(135deg, #TU_COLOR_1, #TU_COLOR_2);
```

### Agregar Más Estados
1. Actualiza `SHIPPING_STATUSES` en `trackingRoutes.js`
2. Actualiza `SHIPPING_STATUSES` en `tracking/[id].js`
3. Actualiza `SHIPPING_STATUSES` en `admin/shipping.js`

### Cambiar Proveedor de Email
Edita la configuración del transporter en `trackingRoutes.js`

## Seguridad

✅ **Emails Seguros**: Usa variables de entorno
✅ **Validación**: Verifica que la orden existe antes de actualizar
✅ **Transacciones**: Usa transacciones de base de datos
✅ **Historial**: Guarda cada cambio en tracking_history

## Próximos Pasos Sugeridos

1. ⏳ Configurar credenciales de email en producción
2. ⏳ Integrar con API de transportadoras (opcional)
3. ⏳ Agregar notificaciones SMS (opcional)
4. ⏳ Agregar webhook de transportadoras para auto-actualización (opcional)
5. ⏳ Agregar búsqueda de tracking por número de guía

## Soporte

El sistema está completo y funcional. Solo necesitas:
1. Configurar el email en `.env`
2. Reiniciar el servidor backend
3. ¡Empezar a gestionar envíos!
