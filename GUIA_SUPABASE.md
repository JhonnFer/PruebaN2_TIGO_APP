# 🚀 GUÍA PARA EJECUTAR EN SUPABASE

## PASO 1: VERIFICAR ESTRUCTURA DE TABLAS

Ejecuta esto en **SQL Editor** de Supabase para verificar:

```sql
-- Verificar tabla usuarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- Verificar tabla mensajes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'mensajes'
ORDER BY ordinal_position;

-- Verificar tabla planes_moviles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'planes_moviles'
ORDER BY ordinal_position;
```

**Esperado para usuarios:**

- usuarioid (uuid)
- nombre (varchar)
- email (varchar)
- password (varchar) - optecional, Supabase Auth maneja
- telefono (text)
- roleid (int4) - opcional
- perfilid (int4)

**Esperado para mensajes:**

- mensajeid (uuid) - primary key
- usuarioid (uuid)
- destinatarioid (uuid)
- mensaje (text)
- leido (boolean)
- created_at (timestamp)

**Esperado para planes_moviles:**

- planid (uuid)
- usuarioid (uuid) - FK a usuarios
- nombre (varchar)
- precio (numeric)
- datos (numeric) - puede ser INT
- minutos (numeric)
- velocidad (varchar)
- sms (numeric)
- descripcion (text)
- imagen_url (varchar)
- activo (boolean)

---

## PASO 2: EJECUTAR POLÍTICAS RLS

Copia y ejecuta **SQL_SETUP_RLS_ACTUAL.sql** completo en SQL Editor.

Si tienes errores sobre políticas existentes, ejecuta PRIMERO:

```sql
-- Limpiar políticas existentes
DROP POLICY IF EXISTS "public_read_usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "users_can_read_own_profile" ON public.perfiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.perfiles;
DROP POLICY IF EXISTS "anyone_can_read_active_plans" ON public.planes_moviles;
DROP POLICY IF EXISTS "asesors_can_insert_plans" ON public.planes_moviles;
DROP POLICY IF EXISTS "asesors_can_update_own_plans" ON public.planes_moviles;
DROP POLICY IF EXISTS "asesors_can_delete_own_plans" ON public.planes_moviles;
DROP POLICY IF EXISTS "users_can_read_own_contracts" ON public.contrataciones;
DROP POLICY IF EXISTS "asesors_can_read_all_contracts" ON public.contrataciones;
DROP POLICY IF EXISTS "users_can_insert_contracts" ON public.contrataciones;
DROP POLICY IF EXISTS "users_can_read_messages_as_sender" ON public.mensajes;
DROP POLICY IF EXISTS "users_can_read_messages_as_receiver" ON public.mensajes;
DROP POLICY IF EXISTS "users_can_insert_messages" ON public.mensajes;
DROP POLICY IF EXISTS "asesors_can_read_requests" ON public.solicitudes;
DROP POLICY IF EXISTS "users_can_insert_requests" ON public.solicitudes;

-- Ahora ejecuta SQL_SETUP_RLS_ACTUAL.sql
```

---

## PASO 3: CREAR BUCKET DE STORAGE

1. Ir a **Storage** en Supabase
2. Click **Create a new bucket**
3. Nombre: `planes-imagenes`
4. Public: **ON** (activado)
5. Click **Create bucket**

---

## PASO 4: CONFIGURAR POLÍTICAS DE STORAGE

En el bucket `planes-imagenes`, ir a **Policies** y ejecutar:

```sql
-- Lectura pública (todos pueden descargar)
CREATE POLICY "Lectura pública"
ON storage.objects FOR SELECT
USING (bucket_id = 'planes-imagenes');

-- Asesores pueden subir
CREATE POLICY "Asesores suben imágenes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'planes-imagenes' AND
  auth.uid() IN (
    SELECT usuario_id
    FROM perfiles
    WHERE rol = 'asesor_comercial'
  )
);

-- Asesores pueden actualizar/eliminar propias
CREATE POLICY "Asesores manejan propias"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'planes-imagenes' AND
  owner = auth.uid()
);

CREATE POLICY "Asesores eliminan propias"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'planes-imagenes' AND
  owner = auth.uid()
);
```

---

## PASO 5: HABILITAR REALTIME

En **Realtime** section, habilita tabla `mensajes`:

1. Go to Database → Realtime
2. Find `public.mensajes` table
3. Toggle **ON**

O ejecuta en SQL Editor:

```sql
ALTER TABLE public.mensajes REPLICA IDENTITY FULL;
```

---

## PASO 6: CREAR USUARIOS DE PRUEBA

### Usuario Registrado

```sql
-- Crear usuario en auth
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'usuario@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Obtener el ID del usuario creado
SELECT id FROM auth.users WHERE email = 'usuario@test.com';

-- Crear entrada en tabla usuarios (reemplaza {USER_ID})
INSERT INTO usuarios (usuarioid, nombre, email, telefono, perfilid)
VALUES (
  '{USER_ID}',
  'Juan Usuario',
  'usuario@test.com',
  '3001234567',
  NULL
) ON CONFLICT DO NOTHING;

-- Crear perfil
INSERT INTO perfiles (usuarioid, rol)
VALUES ('{USER_ID}', 'usuario_registrado')
ON CONFLICT DO NOTHING;
```

### Usuario Asesor

```sql
-- Crear usuario en auth
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'asesor@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Obtener ID
SELECT id FROM auth.users WHERE email = 'asesor@test.com';

-- Crear entrada usuarios (reemplaza {ASESOR_ID})
INSERT INTO usuarios (usuarioid, nombre, email, telefono, perfilid)
VALUES (
  '{ASESOR_ID}',
  'Carlos Asesor',
  'asesor@test.com',
  '3001234568',
  NULL
) ON CONFLICT DO NOTHING;

-- Crear perfil
INSERT INTO perfiles (usuarioid, rol)
VALUES ('{ASESOR_ID}', 'asesor_comercial')
ON CONFLICT DO NOTHING;
```

---

## PASO 7: VERIFICAR REALTIME

Ejecuta en SQL Editor:

```sql
-- Ver si Realtime está habilitado
SELECT * FROM pg_replication_slot;

-- Verificar tabla mensajes
SELECT * FROM pg_stat_user_tables WHERE relname = 'mensajes';
```

---

## PASO 8: VERIFICAR DATOS

```sql
-- Ver usuarios
SELECT * FROM usuarios;

-- Ver perfiles
SELECT * FROM perfiles;

-- Ver planes
SELECT * FROM planes_moviles WHERE usuarioid IS NOT NULL;

-- Ver mensajes
SELECT * FROM mensajes LIMIT 10;
```

---

## 🧪 CHECKLIST FINAL

- [ ] Estructura de tablas verificada
- [ ] RLS policies ejecutadas sin errores
- [ ] Bucket `planes-imagenes` creado
- [ ] Políticas de Storage configuradas
- [ ] Realtime habilitado en `mensajes`
- [ ] Usuarios de prueba creados
- [ ] Perfiles de usuarios creados
- [ ] SQL_AJUSTES_TABLAS.sql ejecutado (para índices)

---

## ✅ LISTO PARA TESTING

Una vez completado todo:

1. Abre la app en desarrollo:

   ```bash
   npm run start
   # o
   expo start
   ```

2. Prueba login con:

   - **usuario@test.com** / **password123** (Usuario Registrado)
   - **asesor@test.com** / **password123** (Asesor)

3. Prueba funcionalidades:
   - Crear plan (Asesor)
   - Contratar plan (Usuario)
   - Chat realtime (Entre usuarios)
   - Subida de imagen

---

## ⚠️ TROUBLESHOOTING

**Error: "RLS policy not found"**

- Verifica que RLS esté habilitado en la tabla
- Ejecuta: `ALTER TABLE public.{tabla} ENABLE ROW LEVEL SECURITY;`

**Error: "relation does not exist"**

- Verifica que la tabla existe
- Usa `\dt` en SQL Editor para listar tablas

**Chat no funciona**

- Verifica Realtime está habilitado
- Verifica estructura de tabla `mensajes`
- Revisa Network tab en DevTools

**Imagen no sube**

- Verifica bucket existe
- Verifica políticas de Storage
- Verifica archivo < 5MB

**Usuario no puede contratar**

- Verifica perfil del usuario existe
- Verifica rol en perfil es `usuario_registrado`
- Verifica RLS en tabla contratos

---

**Soporte**: Ver GUIA_RAPIDA.md para referencia de funciones
