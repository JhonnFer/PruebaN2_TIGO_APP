# 🚀 GUÍA RÁPIDA - IMPLEMENTACIÓN REALTIME Y STORAGE

## ✅ LO QUE SE COMPLETÓ

### 1. **Chat con Realtime**

- `subscribeToMensajes()` automáticamente detecta nuevos mensajes
- Limpieza automática de suscripciones al desmontar
- Indicador de "escribiendo..." (estado `escribiendo: true/false`)

### 2. **Planes con Realtime**

- Asesores: detectan cambios en planes automáticamente
- Upload de imágenes con validación (5MB, JPG/PNG)
- Gestión automática de imágenes antiguas

### 3. **Estructura Base de Datos**

Usa `contratacion_id` en lugar de `conversacion_id`:

```
mensajes.contratacion_id → contrataciones.id
```

---

## 📋 CHECKLIST PRE-LANZAMIENTO

### Base de Datos (Ejecutar en Supabase)

```sql
-- 1. Ejecutar SQL_SETUP_RLS_ACTUAL.sql
-- 2. Ejecutar SQL_AJUSTES_TABLAS.sql
-- 3. Crear bucket "planes-imagenes" en Storage
```

### Configuración de Variables

```typescript
// En supabaseClient.ts:
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
```

### Verificar que las tablas tengan campos:

- ✅ `mensajes.contratacion_id`
- ✅ `planes_moviles.imagen_url`
- ✅ `planes_moviles.activo`
- ✅ `contrataciones.usuario_id`

---

## 💬 FLUJO CHAT

### Usuario Registrado

```
1. Abre Chat
2. Ve lista de contratos
3. Selecciona uno
4. Se suscribe a mensajes en Realtime
5. Escribe mensaje
6. Se inserta en Supabase
7. Asesor recibe automáticamente
```

### Asesor

```
1. Abre Chat
2. Ve lista de clientes
3. Selecciona cliente
4. Se suscribe a mensajes
5. Responde a cliente
6. Cliente recibe automáticamente
```

---

## 🖼️ FLUJO PLANES

### Ver Planes

```
1. Usuario registrado/invitado
2. Ve solo planes activos (activo = true)
3. Cambios automáticos en Realtime (para asesores)
4. Imagen se carga desde Storage
```

### Crear Plan (Asesor)

```
1. Formulario "Crear Plan"
2. Selecciona imagen
3. Valida: tamaño < 5MB, formato JPG/PNG
4. Sube a bucket "planes-imagenes"
5. Obtiene URL pública
6. Crea registro en DB con imagen_url
7. Otros asesores ven cambio automáticamente
```

### Editar Plan (Asesor)

```
1. Abre plan existente
2. Cambia datos y/o imagen
3. Si hay imagen nueva:
   - Elimina imagen antigua
   - Sube imagen nueva
4. Actualiza registro
5. Otros ven cambio en Realtime
```

---

## 🔐 PERMISOS (RLS)

```typescript
// Autenticado y rol = usuario_registrado
- Ver planes activos ✅
- Ver sus contrataciones ✅
- Chatear con asesores ✅
- Crear contrataciones ✅

// Autenticado y rol = asesor_comercial
- Ver/crear/editar todos los planes ✅
- Ver todas las contrataciones ✅
- Chatear con todos los clientes ✅
- Ver solicitudes ✅

// No autenticado (Invitado)
- Ver planes activos ✅
- SIN chat ❌
- SIN contrataciones ❌
```

---

## 📞 FUNCIONES CLAVE DEL HOOK

### useChat

```typescript
// Para componente
const {
  mensajes, // Array de mensajes
  conversaciones, // Array de conversaciones (solo último de c/u)
  cargando, // boolean
  escribiendo, // boolean
  enviarMensaje, // (contenido: string) => Promise<Mensaje>
  marcarComoLeido, // (mensajeId: string) => Promise<void>
} = useChat(contratacionId);

// Uso:
const [contratacionId, setContratacionId] = useState(null);
const { mensajes, enviarMensaje } = useChat(contratacionId);

// Enviar
await enviarMensaje("Hola!");

// Marcar leído
await marcarComoLeido(mensaje.id);
```

### usePlanMovil

```typescript
const {
  planes, // Array de planes
  planesContratados, // Array de mis contrataciones
  cargando,
  error,
  subidoImagenes, // contador de uploads
  crearPlan, // (data) => Promise<Plan>
  actualizarPlan, // (id, data) => Promise<Plan>
  eliminarPlan, // (id) => Promise<void>
  subirImagenPlan, // (archivo) => Promise<url>
  contratarPlan, // (planId) => Promise<Contratacion>
} = usePlanMovil();

// Crear con imagen
await crearPlan({
  nombre: "Plan XL",
  descripcion: "...",
  gigas: 100,
  minutos: 500,
  precio: 50,
  imagen: archivo, // File object
});

// Actualizar
await actualizarPlan(planId, {
  precio: 45,
  imagen: nuevoArchivo,
});
```

---

## ⚠️ ERRORES COMUNES

### "contratacion_id is undefined"

- Verificar que tabla `mensajes` tiene columna `contratacion_id`
- NO debe llamarse `conversacion_id`

### Imágenes no cargan

- Verificar que bucket `planes-imagenes` existe
- Verificar policies en Storage
- Usar URL retornada por `getPublicUrl()`

### Chat no actualiza en Realtime

- Verificar `contratacionId` es válida (no null)
- Verificar Realtime está habilitado en Supabase
- Revisar Network tab en DevTools

### Permisos negados en RLS

- Ejecutar SQL_SETUP_RLS_ACTUAL.sql
- Verificar usuario tiene perfil con rol correcto
- Revisar policies en tabla en Supabase console

---

## 🧪 TESTING

### Probar Chat

1. Abre dos navegadores (usuario + asesor)
2. Usuario contrata plan
3. Usuario entra a chat
4. Asesor entra a chat del mismo cliente
5. Enviar mensajes mutuamente
6. Verificar aparecen en tiempo real (sin recargar)

### Probar Planes

1. Asesor crea plan con imagen
2. Otro asesor ve plan en lista automáticamente
3. Usuario registrado ve solo planes activos
4. Usuario invitado ve solo planes activos

---

## 📚 ARCHIVOS CLAVE

| Archivo                    | Propósito                               |
| -------------------------- | --------------------------------------- |
| `useChat.ts`               | Hook para chat con Realtime             |
| `usePlanMovil.ts`          | Hook para planes con Storage + Realtime |
| `ChatRepositoryImpl.ts`    | Llamadas a DB con subscriptions         |
| `chat.tsx (Registrado)`    | UI chat usuario registrado              |
| `chat.tsx (Asesor)`        | UI chat asesor                          |
| `SQL_SETUP_RLS_ACTUAL.sql` | Políticas de seguridad                  |

---

## 🚨 NOTAS FINALES

1. **Contratacion vs Conversacion**: Todo usa `contratacion_id` ahora
2. **Realtime**: Se suscribe automáticamente, limpia al desmontar
3. **Storage**: Solo asesores suben, todos leen
4. **Roles**: `usuario_registrado` y `asesor_comercial` (minúsculas)
5. **Testing**: Siempre probar con roles diferentes

---

## ¿NECESITAS?

- [ ] Crear pantalla Detalle Plan
- [ ] Crear pantalla Crear/Editar Plan (Asesor)
- [ ] Crear pantalla Splash/Onboarding
- [ ] Mejorar validaciones de formularios
- [ ] Agregar notificaciones push
