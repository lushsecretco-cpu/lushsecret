# 🚀 Guía de Despliegue - LushSecret

## 📋 Paso 1: Subir a GitHub

### 1.1 Crear Repositorio en GitHub
1. Ve a [GitHub](https://github.com)
2. Haz clic en el botón **"New"** o **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Completa:
   - **Repository name**: `lushsecret` (o el nombre que prefieras)
   - **Description**: "E-commerce de lencería y juguetes - Luxury Gold Rose"
   - Selecciona **Private** (recomendado) o **Public**
   - **NO** marques "Initialize with README" (ya tenemos README.md)
5. Haz clic en **"Create repository"**

### 1.2 Conectar Repositorio Local con GitHub

En la terminal, ejecuta estos comandos (reemplaza `TU_USUARIO` con tu usuario de GitHub):

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/lushsecret.git

# Cambiar a la rama main (si es necesario)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

Si te pide autenticación, usa un **Personal Access Token** en lugar de tu contraseña:
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos de `repo`
3. Copia el token y úsalo como contraseña

---

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Conectar con Vercel

1. Ve a [Vercel](https://vercel.com)
2. Haz clic en **"Sign Up"** si no tienes cuenta, o **"Login"**
3. Conecta con tu cuenta de **GitHub**
4. Haz clic en **"New Project"** o **"Add New..."** → **"Project"**
5. Selecciona el repositorio **lushsecret**
6. Haz clic en **"Import"**

### 2.2 Configurar el Proyecto

**Framework Preset**: Next.js  
**Root Directory**: `frontend`  
**Build Command**: `npm run build`  
**Output Directory**: `.next`

### 2.3 Variables de Entorno

En la sección **Environment Variables**, agrega:

#### Variables para el Frontend
```
NEXT_PUBLIC_API_URL=https://tu-backend-url.vercel.app
```

#### Variables para el Backend (si despliegas por separado)
```
DATABASE_URL=tu_cadena_conexion_postgresql
JWT_SECRET=tu_clave_secreta_jwt
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_email
FRONTEND_URL=https://tu-frontend-url.vercel.app
PORT=4000
```

### 2.4 Base de Datos PostgreSQL

**Opciones recomendadas** (servicios con plan gratuito):

1. **Neon** (recomendado)
   - https://neon.tech
   - Plan gratuito generoso
   - Configuración rápida
   - Copia la cadena de conexión y úsala en `DATABASE_URL`

2. **Supabase**
   - https://supabase.com
   - Plan gratuito incluye PostgreSQL
   - Interfaz amigable

3. **Railway**
   - https://railway.app
   - Fácil integración con Vercel

### 2.5 Desplegar Backend por Separado (Opcional)

Si quieres desplegar el backend en Vercel:

1. Crea un **nuevo proyecto** en Vercel
2. Selecciona el mismo repositorio
3. **Root Directory**: `backend`
4. **Build Command**: (dejar vacío)
5. **Output Directory**: (dejar vacío)
6. Agrega las variables de entorno del backend
7. Despliega

O considera usar **Railway.app** para el backend (más adecuado para Node.js con Express).

---

## 📝 Paso 3: Configurar CORS y URLs

### 3.1 Actualizar CORS en el Backend

Una vez tengas las URLs de Vercel, actualiza `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://tu-dominio.vercel.app',
    'https://lushsecret.vercel.app'
  ]
}));
```

### 3.2 Actualizar URLs del Frontend

Si es necesario, actualiza las llamadas API en el frontend para usar la variable de entorno:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
```

---

## 🔄 Paso 4: Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push origin main
```

Vercel detectará los cambios automáticamente y redesplegará la aplicación.

---

## ✅ Verificación

Después del despliegue, verifica:

- ✅ Frontend cargando correctamente
- ✅ Backend respondiendo a las APIs
- ✅ Conexión con la base de datos funcionando
- ✅ Sistema de autenticación operativo
- ✅ Imágenes y videos cargando
- ✅ Funcionalidades principales operativas

---

## 🆘 Solución de Problemas Comunes

### Error: API no responde
- Verifica que `NEXT_PUBLIC_API_URL` esté configurada correctamente
- Asegúrate de que el backend esté desplegado y funcionando

### Error: Base de datos no conecta
- Verifica que `DATABASE_URL` sea correcta
- Asegura que la base de datos permita conexiones externas
- Revisa que las tablas estén creadas (ejecuta `db.js` una vez)

### Error: CORS
- Agrega el dominio de Vercel a la lista de orígenes permitidos en `server.js`

### Error: Variables de entorno no se cargan
- Asegúrate de haberlas agregado en Vercel Dashboard
- Re-despliega después de agregar las variables

---

## 📞 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Guía de PostgreSQL en Neon](https://neon.tech/docs)

---

¡Listo! Tu proyecto LushSecret estará en línea y accesible desde cualquier parte del mundo. 🎉
