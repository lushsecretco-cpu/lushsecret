# 🤖 Sistema de Tracking Automático - Lush Secret

## 📋 Descripción General

El sistema de tracking automático consulta automáticamente las transportadoras cada **4 horas** para verificar cambios en el estado de los envíos. Cuando detecta un cambio, actualiza la base de datos y envía un email automático al cliente.

## ✨ Características

- ✅ **Actualización automática cada 4 horas**
- ✅ **Detección inteligente de cambios de estado**
- ✅ **Emails automáticos a clientes**
- ✅ **Sin intervención manual requerida**
- ✅ **Historial completo de actualizaciones**
- ✅ **Registro de última revisión**

## 🔧 Archivos Creados/Modificados

### Backend

1. **`backend/services/trackingAutoUpdater.js`** (NUEVO)
   - Servicio principal de actualización automática
   - Consulta transportadoras cada 4 horas
   - Detecta cambios y actualiza base de datos
   - Envía emails automáticos

2. **`backend/server.js`** (MODIFICADO)
   - Importa e inicia el servicio automático
   - Se activa al arrancar el servidor

3. **`backend/routes/trackingRoutes.js`** (MODIFICADO)
   - Acepta campo `tracking_url` en el endpoint de actualización
   - Almacena URL de rastreo de transportadora

4. **`backend/db.js`** (MODIFICADO)
   - Columna `tracking_url TEXT` agregada
   - Columna `last_tracking_check TIMESTAMP` agregada

5. **`backend/package.json`** (MODIFICADO)
   - Dependencia `node-cron: ^3.0.3` agregada

### Frontend

1. **`frontend/pages/admin/shipping.js`** (MODIFICADO)
   - Campo nuevo: "URL de Rastreo de la Transportadora"
   - Indicador visual de actualización automática (🤖)
   - Validación de URL

## 📊 Base de Datos

### Nuevas Columnas en `orders`

```sql
tracking_url TEXT          -- URL de rastreo de la transportadora
last_tracking_check TIMESTAMP  -- Última vez que se consultó automáticamente
```

### Tabla Existente: `tracking_history`

Registra cada cambio de estado con:
- `order_id` - ID del pedido
- `status` - Nuevo estado
- `location` - Ubicación actual
- `description` - Descripción del cambio
- `created_at` - Timestamp del cambio

## 🚀 Cómo Usar

### Para Administradores

1. **Ir a** `/admin/shipping`

2. **Seleccionar un pedido** de la lista

3. **Llenar el formulario:**
   - Estado del Envío (requerido)
   - Número de Guía
   - **URL de Rastreo** ← IMPORTANTE para automatización
   - Transportadora
   - Fecha Estimada de Entrega
   - Ubicación actual
   - Descripción

4. **Pegar la URL de rastreo:**
   ```
   Servientrega: https://www.servientrega.com/rastreo/...
   Coordinadora: https://www.coordinadora.com/portafolio-de-servicios/...
   InterRapidisimo: https://www.interrapidisimo.com/...
   ```

5. **Enviar** - El sistema ahora:
   - Guarda la información
   - Envía email al cliente
   - **Programa revisiones automáticas cada 4 horas**

### Para Clientes

- Reciben emails automáticos cuando el estado cambia
- Pueden ver seguimiento en tiempo real en `/tracking/[id]`
- No necesitan consultar manualmente

## ⏰ Programación del Cron Job

El sistema usa `node-cron` con la expresión:

```javascript
cron.schedule('0 */4 * * *', async () => {
  await actualizarEstadosAutomaticamente();
});
```

**Significado:** Cada 4 horas, en el minuto 0 (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)

### Cambiar Frecuencia

Edita en `backend/services/trackingAutoUpdater.js`:

```javascript
// Cada 1 hora:
cron.schedule('0 * * * *', ...)

// Cada 6 horas:
cron.schedule('0 */6 * * *', ...)

// Cada día a las 9am:
cron.schedule('0 9 * * *', ...)

// Cada 30 minutos:
cron.schedule('*/30 * * * *', ...)
```

## 🔍 Flujo de Actualización Automática

```
┌─────────────────────────────────────────────────────┐
│  1. Cron Job se activa cada 4 horas                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  2. Consultar pedidos con guía y no entregados     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  3. Para cada pedido:                              │
│     - Consultar tracking_url                        │
│     - Obtener estado actual de transportadora      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  4. ¿Estado cambió?                                │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
       NO                    SÍ
        │                     │
        ▼                     ▼
┌──────────────┐    ┌─────────────────────────┐
│ Actualizar   │    │ 5. Actualizar DB        │
│ timestamp    │    │ 6. Crear historial      │
└──────────────┘    │ 7. Enviar email cliente │
                    └─────────────────────────┘
```

## 📧 Emails Automáticos

Los emails incluyen:
- 🤖 Badge de "ACTUALIZACIÓN AUTOMÁTICA"
- Nuevo estado con color luxury gold
- Información del pedido
- Número de guía
- Transportadora
- Ubicación actual (si disponible)
- Fecha estimada de entrega
- Botón para ver tracking completo

## 🎯 Estados de Envío

```javascript
pending           → Pedido Recibido
processing        → En Preparación
packed            → Empacado
shipped           → En Camino
out_for_delivery  → En Reparto
delivered         → Entregado ✅
failed            → Intento Fallido
returned          → Devuelto
```

## 🔧 Integración con APIs de Transportadoras

### Modo Actual (Simulación)

Por defecto, el sistema simula consultas a transportadoras para testing.

### Integración Real (Producción)

Para usar APIs reales, edita `backend/services/trackingAutoUpdater.js`:

```javascript
async function consultarEstadoTransportadora(trackingNumber, carrier, trackingUrl) {
  
  // SERVIENTREGA
  if (carrier === 'Servientrega') {
    const response = await fetch(`https://api.servientrega.com/tracking/${trackingNumber}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SERVIENTREGA_API_KEY}`
      }
    });
    const data = await response.json();
    return {
      status: mapearEstado(data.estado),
      location: data.ubicacion,
      description: data.descripcion,
      estimatedDelivery: data.fechaEstimada
    };
  }
  
  // COORDINADORA
  if (carrier === 'Coordinadora') {
    // Implementar lógica similar...
  }
  
  // INTER RAPIDISIMO
  if (carrier === 'InterRapidisimo') {
    // Implementar lógica similar...
  }
  
}
```

### Variables de Entorno Necesarias

Agregar a `.env`:

```env
SERVIENTREGA_API_KEY=tu_api_key_aqui
COORDINADORA_API_KEY=tu_api_key_aqui
INTERRAPIDISIMO_API_KEY=tu_api_key_aqui
```

## 🧪 Testing

### Verificar que el servicio está activo

1. Iniciar backend:
   ```bash
   cd backend
   npm start
   ```

2. Deberías ver en consola:
   ```
   Servidor backend escuchando en puerto 4000
   
   🚀 Iniciando servicio de tracking automático...
   🤖 Servicio de actualización automática de tracking iniciado
   ⏰ Se ejecutará cada 4 horas
   ✅ Servicio configurado correctamente
   ```

### Ejecutar actualización manual

Para probar sin esperar 4 horas, descomenta en `trackingAutoUpdater.js`:

```javascript
// Ejecutar después de 30 segundos al iniciar
setTimeout(actualizarEstadosAutomaticamente, 30000);
```

O desde consola del servidor:
```javascript
const { actualizarEstadosAutomaticamente } = require('./services/trackingAutoUpdater');
actualizarEstadosAutomaticamente();
```

## 📈 Registro y Monitoreo

Cada ejecución muestra en consola:

```
🤖 === ACTUALIZADOR AUTOMÁTICO DE TRACKING ===
⏰ Ejecutando a las 15/01/2026 14:00:00
📦 Encontrados 5 pedidos activos para revisar

🔍 Revisando pedido #123 - Guía: 1234567890
  ✅ CAMBIO DETECTADO: shipped → out_for_delivery
  📧 Email enviado al cliente

🔍 Revisando pedido #124 - Guía: 9876543210
  ℹ️  Sin cambios

📊 === RESUMEN DE ACTUALIZACIÓN ===
✅ Actualizados: 1
ℹ️  Sin cambios: 4
❌ Errores: 0
⏱️  Próxima revisión en 4 horas
```

## ⚠️ Consideraciones Importantes

1. **Rate Limiting**: Las APIs de transportadoras pueden tener límites de requests. Ajusta la frecuencia si es necesario.

2. **Manejo de Errores**: El sistema continúa aunque falle una consulta individual. Los errores se registran en consola.

3. **Pedidos Finalizados**: Solo consulta pedidos con estado NO `delivered` y NO `returned` para ahorrar requests.

4. **Timestamp**: Cada pedido guarda `last_tracking_check` para auditoría.

5. **Failsafe**: Si una transportadora no responde, el sistema sigue con los demás pedidos.

## 🆘 Solución de Problemas

### El servicio no arranca
- Verificar que `node-cron` está instalado: `npm list node-cron`
- Revisar console del servidor al iniciar

### No se envían emails
- Verificar configuración de Nodemailer en `.env`
- Revisar que EMAIL_USER y EMAIL_PASSWORD estén correctos

### Estados no se actualizan
- Verificar que tracking_url esté guardada en la base de datos
- Revisar logs de consola durante ejecución
- Confirmar que pedido NO está en estado `delivered` o `returned`

### Cambiar frecuencia de revisión
- Editar expresión cron en `trackingAutoUpdater.js`
- Reiniciar el servidor backend

## 📝 Checklist de Implementación

- [x] Base de datos actualizada con nuevas columnas
- [x] Servicio automático creado
- [x] Integración con server.js
- [x] Admin panel actualizado con campo URL
- [x] node-cron instalado
- [ ] Configurar APIs reales de transportadoras (en producción)
- [ ] Configurar variables de entorno para APIs
- [ ] Testing con pedidos reales
- [ ] Monitorear logs por 24 horas

## 🎉 Conclusión

El sistema ahora funciona completamente automático:

1. **Admin** crea guía y guarda tracking_url → **Una sola vez**
2. **Sistema** revisa cada 4 horas → **Automático**
3. **Cliente** recibe emails de cambios → **Automático**
4. **Base de datos** se actualiza sola → **Automático**

**¡Cero intervención manual requerida!** 🚀
