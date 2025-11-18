# 🎯 IMPLEMENTACIÓN FINAL - GUÍA PASO A PASO

## ANTES DE EMPEZAR

⏰ **Tiempo estimado**: 30-45 minutos  
🔧 **Requisitos**: Acceso a Supabase, proyecto en desarrollo

---

## PASO 1: ACTUALIZAR BASE DE DATOS (10 min)

### 1.1 Abrir Supabase Console

1. Ir a https://app.supabase.com
2. Seleccionar tu proyecto TIGO_APP
3. Ir a **SQL Editor**

### 1.2 Ejecutar primeros scripts

1. Copiar contenido de `SQL_SETUP_RLS_ACTUAL.sql`
2. Pegar en SQL Editor
3. Click **Run**
4. ✅ Debería completar sin errores

```
Si hay errores sobre políticas existentes:
- DROP POLICY IF EXISTS "nombre_policy" ON tabla;
- Luego ejecutar de nuevo
```

### 1.3 Ejecutar script de ajustes

1. Copiar contenido de `SQL_AJUSTES_TABLAS.sql`
2. Pegar en SQL Editor
3. Click **Run**
4. ✅ Debería crear índices exitosamente

---

## PASO 2: CREAR BUCKET DE STORAGE (5 min)

### 2.1 Ir a Storage

1. En Supabase, click en **Storage**
2. Click **Create a new bucket**

### 2.2 Crear bucket planes-imagenes

```
Nombre: planes-imagenes
Public: ON (activado)
```

### 2.3 Configurar permisos

1. Click en el bucket `planes-imagenes`
2. Click **Policies**
3. Crear política:

```sql
-- Lectura pública (todos pueden leer)
CREATE POLICY "Lectura pública"
ON storage.objects FOR SELECT
USING (bucket_id = 'planes-imagenes');

-- Solo asesores pueden subir
CREATE POLICY "Solo asesores suben"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'planes-imagenes'
  AND auth.jwt()->>'email' LIKE '%@%'  -- Ajusta según tu DB
);
```

---

## PASO 3: CONFIGURAR APLICACIÓN (10 min)

### 3.1 Verificar Supabase Config

Archivo: `src/data/services/supabaseClient.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export { supabase };
```

### 3.2 Verificar variables de entorno

Archivo: `.env.local` (o similar)

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3.3 Verificar perfiles de usuario

En Supabase, asegúrate que tabla `perfiles` tiene:

- `id` (UUID)
- `usuario_id` (UUID, FK)
- `rol` ('usuario_registrado' o 'asesor_comercial')

---

## PASO 4: PROBAR EN DESARROLLO (15 min)

### 4.1 Iniciar aplicación

```bash
npm run start
# o
expo start
```

### 4.2 Test 1: Crear cuenta

1. Click "Registro"
2. Completa formulario:
   - Nombre: "Juan Test"
   - Email: "juan@test.com"
   - Contraseña: "password123"
   - Teléfono: "1234567890"
3. ✅ Debería redirigir a login

### 4.3 Test 2: Login

1. Click "Login"
2. Usa credenciales anteriores
3. ✅ Debería entrar como Usuario Registrado

### 4.4 Test 3: Ver planes

1. Deberías estar en "Home" con catálogo
2. ✅ Debería ver solo planes con `activo = true`

### 4.5 Test 4: Contratar plan

1. Click en un plan
2. Busca botón "Contratar"
3. Click
4. ✅ Debería crear contratación en DB

### 4.6 Test 5: Chat

1. Desde Home, ve a pestaña "Chat"
2. Deberías ver conversaciones (después de contratar)
3. Selecciona una
4. Escribe mensaje y presiona "Enviar"
5. ✅ Mensaje debería aparecer al instante

### 4.7 Test 6: Realtime

1. Abre la app en DOS navegadores simultáneamente
2. En navegador 1: Usuario registrado
3. En navegador 2: Asesor
4. Usuario envía mensaje
5. ✅ Asesor debe verlo sin recargar

---

## PASO 5: TROUBLESHOOTING

### Problema: Chat no muestra mensajes

**Solución**:

```typescript
// Verificar en logs que contratacionId no es null
console.log("contratacionId:", contratacionId);
console.log("usuario:", usuario?.usuarioid);

// Si uno es null, fix:
// - Usuario: ejecutar login correctamente
// - Contratación: asegurar que usuario contractó un plan
```

### Problema: Imagen no sube

**Solución**:

```
1. Verificar bucket "planes-imagenes" existe
2. Verificar permisos de storage
3. Verificar archivo < 5MB
4. Verificar formato JPG o PNG
```

### Problema: Permisos denegados en RLS

**Solución**:

```sql
-- Verificar usuario tiene perfil con rol
SELECT * FROM perfiles WHERE usuario_id = 'tu_id';

-- Si no existe, crear:
INSERT INTO perfiles (usuario_id, rol)
VALUES ('tu_id', 'usuario_registrado');
```

### Problema: Mensajes no sincronizados

**Solución**:

```
1. Verificar Realtime está habilitado en Supabase
2. Verificar contratacion_id está correcta
3. Revisar Network tab para errores
4. Reiniciar conexión: reload page
```

---

## PASO 6: CREAR USUARIOS DE PRUEBA (5 min)

### Opción 1: Manual (en app)

```
Usuario Registrado:
- Email: usuario@test.com
- Pass: password123
- Rol: usuario_registrado

Asesor:
- Email: asesor@test.com
- Pass: password123
- Rol: asesor_comercial
```

### Opción 2: SQL directo

```sql
-- Crear usuario en auth
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at
) VALUES (
  gen_random_uuid(),
  'usuario@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now()
);

-- Crear perfil
INSERT INTO perfiles (usuario_id, rol)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'usuario@test.com'),
  'usuario_registrado'
);
```

---

## LISTA DE VERIFICACIÓN FINAL

- [ ] Ejecuté SQL_SETUP_RLS_ACTUAL.sql
- [ ] Ejecuté SQL_AJUSTES_TABLAS.sql
- [ ] Creé bucket "planes-imagenes"
- [ ] Verifiqué variables de entorno
- [ ] Probé registro correctamente
- [ ] Probé login correctamente
- [ ] Probé ver planes
- [ ] Probé contratar plan
- [ ] Probé chat (mensaje único)
- [ ] Probé Realtime (dos navegadores)
- [ ] Creé usuario de prueba Asesor
- [ ] Probé upload de imagen

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Cuando todo esté funcionando:

1. **Hacer un build**

   ```bash
   expo build:android
   # o
   expo build:ios
   ```

2. **Deploy en Supabase** (si es necesario)

   ```bash
   supabase projects list
   supabase start
   ```

3. **Monitorear en Production**
   - Revisar logs de Supabase
   - Monitorear uso de Storage
   - Revisar RLS policies

---

## 📚 DOCUMENTACIÓN DISPONIBLE

| Archivo                    | Propósito           |
| -------------------------- | ------------------- |
| `CAMBIOS_REALIZADOS.md`    | Detalles técnicos   |
| `GUIA_RAPIDA.md`           | Referencia de hooks |
| `RESUMEN_EJECUTIVO.md`     | Visión general      |
| `SQL_SETUP_RLS_ACTUAL.sql` | Seguridad           |
| `SQL_AJUSTES_TABLAS.sql`   | Índices             |

---

## 💬 SOPORTE

Si algo no funciona:

1. Revisar logs en Supabase
2. Revisar Network tab en DevTools
3. Revisar console del navegador
4. Ejecutar SQL de verificación:

```sql
-- Ver estados de RLS
SELECT tablename, row_security_enabled FROM pg_tables
WHERE schemaname = 'public';

-- Ver políticas
SELECT * FROM pg_policies;

-- Ver usuarios
SELECT id, email FROM auth.users LIMIT 5;

-- Ver perfiles
SELECT * FROM perfiles;

-- Ver mensajes
SELECT * FROM mensajes ORDER BY created_at DESC LIMIT 10;
```

---

## ✅ HECHO

¡Ya tienes una app funcional con:

- ✅ Chat realtime
- ✅ Upload de imágenes
- ✅ CRUD de planes
- ✅ Control de acceso (RLS)
- ✅ Validaciones
- ✅ Limpieza automática de recursos

**Próximo paso**: Crear pantallas de detalle y mejorar validaciones.
