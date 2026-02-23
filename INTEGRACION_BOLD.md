# Integración con Bold - Sistema de Pagos

## Estado Actual de la Sincronización

✅ **SISTEMA DE ANALYTICS COMPLETAMENTE SINCRONIZADO**

El sistema ya está preparado para recibir y procesar automáticamente las ventas exitosas de Bold. Cuando Bold confirme un pago, el webhook actualizará:

1. **Base de Datos de Órdenes**
   - Orden marcada como "paid"
   - Información de transacción guardada
   - Items de la orden registrados

2. **Sistema de Analytics**
   - Evento `purchase_completed` registrado por cada producto vendido
   - Métricas de conversión actualizadas automáticamente
   - Ingresos y ganancias calculados en tiempo real
   - Dashboard de analytics reflejará las ventas inmediatamente

## Flujo Completo Implementado

```
Cliente → Checkout → Método de Pago → [Crear Orden en DB] → Bold → 
→ Webhook Bold → [Orden = Paid] → [Analytics Actualizado] → Dashboard
```

## Endpoints Creados

### 1. POST `/api/orders`
Crea una nueva orden cuando el usuario confirma el checkout.

**Request:**
```json
{
  "customer_info": {
    "nombre": "Juan",
    "apellidos": "Pérez",
    "cedula": "123456789",
    "telefono": "3001234567",
    "correo": "juan@email.com",
    "direccion": "Calle 123 #45-67",
    "ciudad": "Bogotá",
    "nombreRecibe": "Juan Pérez",
    "observaciones": "Entregar en horario de oficina"
  },
  "items": [
    {
      "product_id": 1,
      "product_name": "Producto Example",
      "quantity": 2,
      "price": 50000
    }
  ],
  "total": 100000,
  "payment_method": "bold",
  "session_id": "session_123456"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "total": 100000,
    "status": "pending",
    "customer_info": {...},
    "payment_method": "bold",
    "created_at": "2026-02-22T10:30:00Z"
  },
  "message": "Orden creada exitosamente"
}
```

### 2. POST `/api/orders/webhook/bold`
**Endpoint para recibir notificaciones de Bold sobre pagos exitosos.**

Este es el webhook que debes configurar en tu panel de Bold.

**URL del Webhook:**
```
https://tu-dominio.com/api/orders/webhook/bold
```

**Qué hace el webhook:**
1. Recibe notificación de Bold cuando un pago es exitoso
2. Actualiza el estado de la orden a "paid"
3. Registra automáticamente la venta en analytics con evento `purchase_completed`
4. Calcula métricas de conversión, ingresos y ganancias
5. Actualiza el dashboard en tiempo real

**Formato esperado de Bold:**
```json
{
  "transaction": "TRX123456",
  "status": "approved",
  "order_id": 1,
  "amount": 100000,
  "reference": "ORD-001",
  "customer": {
    "name": "Juan Pérez",
    "email": "juan@email.com"
  }
}
```

**Response del webhook:**
```json
{
  "success": true,
  "message": "Pago procesado exitosamente"
}
```

## Configuración de Bold

### Paso 1: Obtener Credenciales de Bold
1. Crea una cuenta en [Bold.co](https://bold.co)
2. Obtén tus credenciales:
   - API Key
   - Public Key
   - API Secret

### Paso 2: Configurar Variables de Entorno

Agregar en `backend/.env`:
```env
BOLD_API_KEY=tu_api_key_aqui
BOLD_PUBLIC_KEY=tu_public_key_aqui
BOLD_API_SECRET=tu_api_secret_aqui
BOLD_WEBHOOK_SECRET=tu_webhook_secret_aqui
```

### Paso 3: Configurar Webhook en Bold

En tu panel de Bold:
1. Ve a Configuración → Webhooks
2. Agrega nueva URL de webhook:
   - **URL:** `https://tu-dominio.com/api/orders/webhook/bold`
   - **Eventos:** Marcar "Pago Exitoso" o "Transaction Approved"
3. Guarda la configuración

### Paso 4: Implementar SDK de Bold en Frontend

Instalar dependencia:
```bash
npm install @bold/checkout-sdk
```

Actualizar `frontend/pages/metodo-pago.js`:

```javascript
import BoldCheckout from '@bold/checkout-sdk';

const handlePayment = async () => {
  try {
    // Crear orden en tu backend
    const response = await fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_info: orderData,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotal(),
        payment_method: 'bold',
        session_id: localStorage.getItem('sessionId')
      })
    });

    const { order } = await response.json();

    // Inicializar Bold Checkout
    const checkout = new BoldCheckout({
      publicKey: process.env.NEXT_PUBLIC_BOLD_PUBLIC_KEY,
      amount: order.total,
      currency: 'COP',
      orderId: order.id.toString(),
      redirectUrl: `${window.location.origin}/pago-exitoso`,
      customer: {
        name: `${orderData.nombre} ${orderData.apellidos}`,
        email: orderData.correo,
        phone: orderData.telefono,
        documentType: 'CC',
        documentNumber: orderData.cedula
      }
    });

    // Abrir ventana de pago de Bold
    checkout.open();

  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar el pago');
  }
};
```

## Eventos de Analytics Registrados

### Al crear la orden (checkout):
```javascript
event_type: 'checkout_initiated'
// Se registra para cada producto en el carrito
```

### Cuando Bold confirma el pago (webhook):
```javascript
event_type: 'purchase_completed'
metadata: {
  order_id: 1,
  quantity: 2,
  price: 50000,
  revenue: 100000,
  transaction_id: 'TRX123456'
}
// Se registra para cada producto vendido
```

## Dashboard de Analytics

El dashboard (`/admin/analytics`) mostrará automáticamente:

✅ **Total de Ventas** - Número de órdenes pagadas
✅ **Ingresos Totales** - Suma de todas las ventas
✅ **Ganancia Total Neta** - Revenue - Costos
✅ **Margen Promedio** - % de ganancia sobre ventas
✅ **Tasa de Conversión** - Ventas / Sesiones únicas
✅ **Ticket Promedio** - Promedio de valor por orden
✅ **Productos Más Vendidos** - Con unidades y revenue
✅ **Ventas por Día** - Gráfico de tendencia
✅ **Órdenes Recientes** - Listado de últimas ventas

## Verificación

### 1. Probar creación de orden:
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_info": {...},
    "items": [...],
    "total": 100000,
    "payment_method": "bold"
  }'
```

### 2. Simular webhook de Bold (prueba local):
```bash
curl -X POST http://localhost:4000/api/orders/webhook/bold \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": "TEST123",
    "status": "approved",
    "order_id": 1,
    "amount": 100000
  }'
```

### 3. Verificar en analytics:
- Ir a `http://localhost:3000/admin/analytics`
- Verificar que aparezca la venta
- Verificar que los ingresos se actualicen
- Verificar que la conversión se registre

## Seguridad del Webhook

Para producción, agregar validación de firma de Bold:

```javascript
router.post('/webhook/bold', async (req, res) => {
  // Validar firma de Bold
  const signature = req.headers['x-bold-signature'];
  const webhookSecret = process.env.BOLD_WEBHOOK_SECRET;
  
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Firma inválida' });
  }
  
  // Procesar webhook...
});
```

## Próximos Pasos

1. ✅ Sistema de órdenes implementado
2. ✅ Webhook configurado
3. ✅ Analytics sincronizado
4. ⏳ Obtener credenciales de Bold
5. ⏳ Configurar variables de entorno
6. ⏳ Implementar SDK de Bold en frontend
7. ⏳ Configurar webhook en panel de Bold
8. ⏳ Pruebas en ambiente de staging de Bold
9. ⏳ Deploy a producción

## Soporte

- Documentación Bold: https://docs.bold.co
- API Reference: https://api-docs.bold.co
- Soporte Bold: soporte@bold.co
