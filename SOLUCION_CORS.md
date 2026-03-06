# 🔧 Solución de Error CORS - LushSecret

## ❌ Problema Identificado

Tu dominio personalizado `https://lushsecret.co` no estaba en la lista de orígenes permitidos (CORS) del backend en Render.

## ✅ Solución Aplicada

Se agregaron los siguientes dominios a la configuración CORS en `backend/server.js`:

- `https://lushsecret.co`
- `https://www.lushsecret.co`
- `http://lushsecret.co`
- `http://www.lushsecret.co`

## 📋 Pasos para Aplicar los Cambios en Render

### 1. Subir Cambios a GitHub

```bash
cd backend
git add server.js
git commit -m "Fix: Agregar dominio lushsecret.co a CORS allowedOrigins"
git push origin main
```

### 2. Redesplegar en Render

**Opción A: Redespliegue Automático** (si está configurado)
- Render detectará el push automáticamente y redesplegará

**Opción B: Redespliegue Manual**
1. Ve a https://dashboard.render.com
2. Selecciona tu servicio "lushsecret-api2"
3. Haz clic en "Manual Deploy" → "Deploy latest commit"
4. Espera a que termine el despliegue (2-5 minutos)

### 3. Verificar Variables de Entorno en Render

Asegúrate de que estas variables estén configuradas en Render:

```
DATABASE_URL=tu_cadena_de_conexion_postgresql
JWT_SECRET=tu_clave_secreta_jwt
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
FRONTEND_URL=https://lushsecret.co
NODE_ENV=production
PORT=4000
```

**Para agregar/editar variables:**
1. Dashboard de Render → Tu servicio
2. Environment → Add Environment Variable
3. Guarda y permite que Render redesplegue

### 4. Verificar Logs de Render

Si después del despliegue sigues viendo errores:

1. Ve a tu servicio en Render
2. Haz clic en "Logs"
3. Busca errores como:
   - ❌ Error conectando a base de datos
   - ❌ Missing environment variable
   - ❌ Module not found

**Errores comunes:**

#### Error 500 - Base de Datos
```
❌ Error conectando a base de datos
```
**Solución:** Verifica que `DATABASE_URL` sea correcta y que la base de datos esté activa

#### Error 500 - Dependencias
```
❌ Cannot find module 'xxxx'
```
**Solución:** Asegúrate de que todas las dependencias estén en `package.json`

### 5. Probar el API Directamente

Abre en tu navegador:
```
https://lushsecret-api2.onrender.com/
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "API Lush Secret funcionando",
  "environment": "production",
  "timestamp": "2026-03-06T..."
}
```

También prueba:
```
https://lushsecret-api2.onrender.com/health
```

Debería responder:
```json
{
  "status": "healthy",
  "uptime": 12345
}
```

### 6. Verificar Configuración DNS en Hostgator

Tu dominio debe estar apuntando a Vercel, no a Hostgator:

**Registros DNS en Hostgator:**
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

**Para verificar:**
1. Panel de Hostgator → Dominios → Administrar DNS
2. Confirma que los registros A y CNAME apunten a Vercel
3. Los cambios DNS pueden tardar 24-48 horas en propagarse

**Verificar propagación DNS:**
- https://www.whatsmydns.net/#A/lushsecret.co
- https://www.whatsmydns.net/#CNAME/www.lushsecret.co

### 7. Verificar Dominio en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto "lushsecret"
3. Settings → Domains
4. Verifica que `lushsecret.co` esté listado y con estado **"Valid Configuration"**

Si aparece como "Invalid Configuration":
- Haz clic en él para ver instrucciones
- Sigue las instrucciones para configurar los DNS correctamente

### 8. Limpiar Caché del Navegador

Después de todos los cambios:

**Chrome/Edge:**
- Ctrl + Shift + Delete
- Selecciona "Imágenes y archivos en caché"
- Limpia

**Firefox:**
- Ctrl + Shift + Delete
- Selecciona "Caché"
- Limpia

O abre en **modo incógnito/privado** para probar.

---

## 🧪 Pruebas Post-Despliegue

### 1. Verifica que el sitio cargue
✅ https://lushsecret.co

### 2. Verifica que carguen los productos
- Deberías ver productos en la página principal
- No debería haber errores de CORS en la consola

### 3. Verifica otras funciones
- Navegación por categorías
- Vista de productos individuales
- Carrito de compras
- Login/Registro

---

## 🆘 Si Aún Hay Errores

### Error: CORS sigue apareciendo

**Posibles causas:**
1. Los cambios no se han desplegado en Render
2. Render está usando caché antiguo
3. Tu navegador tiene caché

**Solución:**
```bash
# Force un redespliegue limpio en Render
# Dashboard → Manual Deploy → Clear build cache & deploy
```

### Error 500 persiste

**Ver logs detallados en Render:**
1. Dashboard → Tu servicio → Logs
2. Filtra por "ERROR" o "500"
3. Copia el error completo

**Errores típicos y soluciones:**

```
Error: connect ECONNREFUSED
```
→ Base de datos no conectada. Verifica DATABASE_URL

```
Error: JWT secret not set
```
→ Falta JWT_SECRET en variables de entorno

```
Error: Cannot find module
```
→ Ejecuta `npm install` localmente y verifica package.json

---

## 📞 Comandos Útiles

### Verificar API desde terminal

```bash
# Health check
curl https://lushsecret-api2.onrender.com/health

# Obtener productos
curl https://lushsecret-api2.onrender.com/api/products

# Con cabecera CORS
curl -H "Origin: https://lushsecret.co" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://lushsecret-api2.onrender.com/api/products
```

---

## ✅ Checklist Final

- [ ] Código actualizado y pusheado a GitHub
- [ ] Backend redesplegado en Render
- [ ] Variables de entorno configuradas en Render
- [ ] API responde en https://lushsecret-api2.onrender.com/
- [ ] DNS apunta a Vercel (verificado en whatsmydns.net)
- [ ] Dominio válido en Vercel dashboard
- [ ] Caché del navegador limpiado
- [ ] Productos cargan en https://lushsecret.co
- [ ] No hay errores CORS en consola

---

**Última actualización:** 6 de marzo de 2026
