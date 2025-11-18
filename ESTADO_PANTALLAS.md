# 📱 ESTADO DE PANTALLAS - PROYECTO TIGO_APP

## ✅ PANTALLAS COMPLETADAS (100%)

### 👤 Usuario Invitado

- ✅ **Splash Screen / Onboarding** → `app/index.tsx`
  - Pantalla inicial con 3 opciones: Explorar, Login, Registro
  - Styling completo
- ✅ **Catálogo de Planes (solo lectura)** → `app/(tabs)/Invitado/index.tsx`
  - Muestra lista de planes activos
  - Sin botón de contratar (solo lectura)
  - Realtime subscription a cambios

### 🔐 Autenticación

- ✅ **Login** → `app/auth/login.tsx`
  - Email/Password
  - Validación de campos
  - Recuperar contraseña link
- ✅ **Registro** → `app/auth/registro.tsx`
  - Nombre, Email, Teléfono, Contraseña
  - Validación completa
  - Creación de usuario en Supabase Auth
- ✅ **Recuperar Contraseña** → `app/auth/recuperar.tsx`
  - Reset por email
  - Link a login

### 📱 Usuario Registrado - Home

- ✅ **Catálogo con opción de contratar** → `app/(tabs)/Registrado/index.tsx`
  - Lista de planes activos
  - Botón "Contratar" funcional
  - Crea entrada en tabla `mensajes` cuando contrata
  - RLS permite solo ver planes activos

### 💬 Chat

- ✅ **Chat con Asesor** → `app/(tabs)/Registrado/chat.tsx` + `app/(tabs)/Asesor/chat.tsx`
  - Lista de conversaciones (destinatarios únicos)
  - Vista individual de chat
  - Mensajes en tiempo real (Realtime subscription)
  - Marcar como leído
  - Auto-scroll al final
  - **ESTADO**: Funciona pero pendiente test completo en Supabase

### 👥 Asesor - Chat

- ✅ **Chat con Clientes** → `app/(tabs)/Asesor/chat.tsx`
  - Misma estructura que Registrado
  - Ve todas sus conversaciones activas
  - Realtime para nuevos mensajes

---

## ⚠️ PANTALLAS PARCIALMENTE IMPLEMENTADAS (50-80%)

### 📋 Usuario Registrado

- ⚠️ **Mis Contrataciones/Planes** → `app/(tabs)/Registrado/MisPlanes.tsx`

  - Existe archivo
  - Hook `useSolicitudes` existe
  - **FALTA**: UI completa, mostrar planes contratados con estado

- ⚠️ **Perfil de Usuario** → `app/(tabs)/Registrado/perfil.tsx`
  - UI básica existe
  - **FALTA**: Lógica para editar datos, cargar info de BD

### 🏪 Asesor - Dashboard

- ⚠️ **Dashboard de Planes** → `app/(tabs)/Asesor/index.tsx`

  - Existe archivo
  - Hook `usePlanMovil` completo
  - **FALTA**: UI para mostrar planes propios, botón crear, opciones editar/eliminar

- ⚠️ **Solicitudes/Contrataciones Pendientes** → `app/(tabs)/Asesor/Solicitudes.tsx`

  - Existe archivo
  - Hook `useSolicitudes` existe
  - **FALTA**: UI completa para ver estado de solicitudes

- ⚠️ **Perfil de Asesor** → `app/(tabs)/Asesor/perfil.tsx`
  - UI básica existe
  - **FALTA**: Lógica para editar datos, cargar info de BD

---

## ❌ PANTALLAS NO IMPLEMENTADAS (0%)

### 🏪 Usuario Registrado

- ❌ **Detalle de Plan** (con botón "Contratar")
  - **PRIORIDAD**: ALTA
  - **REQUISITO**: Mostrar plan completo, imagen, descripción, botón contratar
  - Archivo sugerido: `app/(tabs)/Registrado/detalle-plan/[id].tsx`

### 🏪 Asesor Comercial

- ❌ **Crear/Editar Plan** (con carga de imagen)
  - **PRIORIDAD**: CRÍTICA
  - **REQUISITO**: Formulario con nombre, descripción, precio, imagen, velocidad
  - El asesor no puede crear planes sin esta pantalla
  - Archivos sugeridos:
    - `app/(tabs)/Asesor/crear-plan.tsx`
    - `app/(tabs)/Asesor/editar-plan/[id].tsx`

---

## 🎯 RESUMEN POR ESTADO

| Categoría         | Total | ✅ Completo | ⚠️ Parcial | ❌ Falta | % Avance |
| ----------------- | ----- | ----------- | ---------- | -------- | -------- |
| **Invitado**      | 2     | 2           | 0          | 0        | 100%     |
| **Autenticación** | 3     | 3           | 0          | 0        | 100%     |
| **Registrado**    | 5     | 3           | 2          | 1        | 60%      |
| **Asesor**        | 5     | 1           | 3          | 1        | 40%      |
| **TOTAL**         | 15    | 9           | 5          | 1        | 73%      |

---

## 🚀 PRÓXIMOS PASOS (ORDEN DE PRIORIDAD)

### 1️⃣ CRÍTICO - Implementar PRIMERO

**Pantalla de Crear/Editar Plan (Asesor)**

- Sin esto, el asesor no puede hacer nada
- Archivo: `app/(tabs)/Asesor/crear-plan.tsx`
- Depende de: `usePlanMovil.crearPlan()`, `usePlanMovil.subirImagenPlan()`
- Tiempo estimado: 45 min

### 2️⃣ CRÍTICO - Implementar SEGUNDO

**Pantalla de Detalle de Plan (Registrado)**

- Usuario necesita ver plan completo antes de contratar
- Archivo: `app/(tabs)/Registrado/detalle-plan/[id].tsx`
- Mostraría: nombre, descripción, precio, imagen, velocidad, botón "Contratar"
- Tiempo estimado: 30 min

### 3️⃣ IMPORTANTE - Implementar TERCERO

**Pantalla de Dashboard (Asesor)**

- Asesor necesita ver sus planes
- Actualizar: `app/(tabs)/Asesor/index.tsx`
- Mostrar: lista de planes propios, botones crear/editar/eliminar
- Tiempo estimado: 40 min

### 4️⃣ IMPORTANTE - Implementar CUARTO

**Pantalla de Mis Planes (Registrado)**

- Usuario necesita ver qué contrató
- Actualizar: `app/(tabs)/Registrado/MisPlanes.tsx`
- Mostrar: planes contratados, fecha, estado, opción de ver detalles
- Tiempo estimado: 35 min

### 5️⃣ IMPORTANTE - Implementar QUINTO

**Pantalla de Solicitudes (Asesor)**

- Asesor necesita ver nuevos clientes que contratan
- Actualizar: `app/(tabs)/Asesor/Solicitudes.tsx`
- Mostrar: lista de nuevas contrataciones, estado, opción de aceptar/rechazar
- Tiempo estimado: 35 min

---

## 📝 ARCHIVOS CON LÓGICA LISTA (No requiere cambios)

✅ Hooks completamente funcionales:

- `useAuth.ts` - Autenticación
- `useChat.ts` - Chat con Realtime (ACTUALIZADO)
- `usePlanMovil.ts` - CRUD de planes + Storage
- `useSolicitudes.ts` - CRUD de contrataciones
- `usePermisos.ts` - Control de roles

✅ Repositorios listos:

- `ChatRepositoryImpl.ts` - Chat queries (ACTUALIZADO)
- `UsuarioRepositoryImpl.ts` - Usuario queries
- `SolicitudRepositoryImpl.ts` - Solicitud queries
- `PlanMovilRepositoryImpl.ts` - Plan queries

---

## ✅ VERIFICACIÓN ANTES DE SUPABASE

Antes de ejecutar SQL en Supabase, verifica:

- [ ] Tabla `usuarios` tiene columnas: `usuarioid`, `nombre`, `email`, `password`, `telefono`, `roleid`, `perfilid`
- [ ] Tabla `mensajes` tiene columnas: `mensajeid`, `usuarioid`, `destinatarioid`, `mensaje`, `leido`, `created_at`
- [ ] Tabla `planes_moviles` existe con estructura correcta
- [ ] Tabla `solicitudes` o `contrataciones` existe
- [ ] Realtime está habilitado en Supabase para tabla `mensajes`
- [ ] Storage bucket `planes-imagenes` será creado manualmente

---

## 🔄 ESTADO ACTUAL - LISTOS PARA SUPABASE

✅ **SÍ**: Chat funciona, autenticación lista, hooks completados
❌ **NO**: Faltan 2 pantallas críticas (crear plan, detalle plan)

**RECOMENDACIÓN**:

1. ✅ Primero: Implementa las 2 pantallas críticas (30 min)
2. ✅ Segundo: Prueba chat en Supabase
3. ✅ Tercero: Completa las pantallas parciales

---

**Última actualización**: Nov 18, 2025
**Responsable**: Equipo Desarrollo
