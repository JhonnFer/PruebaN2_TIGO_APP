# 📋 CAMBIOS REALIZADOS - NOVIEMBRE 2025

## 1. **ChatRepositoryImpl** ✅

**Archivo**: `src/data/repositories/ChatRepositoryImpl.ts`

### Cambios:

- ✅ Actualizado para usar `contratacion_id` en lugar de `conversacion_id`
- ✅ Agregado método `subscribeToMensajes()` para Realtime con Supabase
- ✅ Agregado método `marcarComoLeido()` para marcar mensajes como leídos
- ✅ Mejorado `obtenerConversaciones()` para filtrar conversaciones únicas

### Código clave:

```typescript
subscribeToMensajes(contratacionId: string, callback: (mensaje: Mensaje) => void) {
  const channel = supabase.channel(`mensajes:${contratacionId}`)
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "mensajes",
      filter: `contratacion_id=eq.${contratacionId}`,
    }, (payload) => {
      callback(payload.new as Mensaje);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
```

---

## 2. **Modelo Mensaje** ✅

**Archivo**: `src/domain/models/Mensaje.ts`

### Cambios:

- ✅ Reemplazado `conversacion_id` → `contratacion_id`
- ✅ Mantenida estructura para relaciones con usuarios

---

## 3. **ChatRepository Interface** ✅

**Archivo**: `src/domain/repositories/ChatRepository.ts`

### Cambios:

- ✅ Actualizado parámetro de función (ahora `contratacionId`)
- ✅ Agregadas funciones: `subscribeToMensajes()` y `marcarComoLeido()`

---

## 4. **useChat Hook** ✅

**Archivo**: `src/presentation/hooks/useChat.ts`

### Cambios:

- ✅ Refactorizado para manejar conversaciones y mensajes individuales
- ✅ Implementada suscripción Realtime con `useRef` para cleanup
- ✅ Agregados estados: `conversaciones`, `escribiendo`
- ✅ Implementado método `marcarComoLeido()`
- ✅ Estructura: cargar conversaciones O mensajes según `contratacionId`

### Flujo:

1. Sin `contratacionId`: muestra lista de conversaciones
2. Con `contratacionId`: muestra chat individual con Realtime

---

## 5. **usePlanMovil Hook** ✅

**Archivo**: `src/presentation/hooks/usePlanMovil.ts`

### Cambios Mayores:

#### A. Realtime para Planes

- ✅ Suscripción a cambios `INSERT/UPDATE/DELETE` en planes_moviles
- ✅ Solo asesores se suscriben (optimización)
- ✅ Actualización automática del estado local

#### B. Funciones de Imagen

- ✅ `subirImagenPlan()` - Valida tamaño (5MB) y formato (JPG/PNG)
- ✅ `eliminarImagenPlan()` - Limpia imagenes antiguas
- ✅ Integración con Supabase Storage bucket `planes-imagenes`

#### C. CRUD de Planes

- ✅ `crearPlan()` - Nuevo, con subida de imagen
- ✅ `actualizarPlan()` - Mejorado con reemplazo de imagen
- ✅ `eliminarPlan()` - Eliminación de imagen + plan
- ✅ `contratarPlan()` - Actualizado con campos correctos

#### D. Nuevos Campos de Retorno

```typescript
return {
  planes,
  planesContratados,
  cargando,
  error,
  subidoImagenes,
  cargarPlanes,
  buscarPlan,
  obtenerPlanPorId,
  contratarPlan,
  crearPlan, // NUEVO
  actualizarPlan, // MEJORADO
  eliminarPlan,
  subirImagenPlan, // NUEVO
  eliminarImagenPlan, // NUEVO
  cargarPlanesContratados,
};
```

---

## 6. **useAuth Hook** ✅

**Archivo**: `src/presentation/hooks/useAuth.ts`

### Cambios:

- ✅ Limpieza de lógica de navegación (eso va en vistas)
- ✅ Mejorada documentación con comentarios JSDoc
- ✅ Mejor manejo de errores
- ✅ Métodos de recuperación de contraseña mejorados

---

## 7. **Chat Registrado** ✅

**Archivo**: `app/(tabs)/Registrado/chat.tsx`

### Cambios:

- ✅ Interfaz: lista de conversaciones → seleccionar → chat individual
- ✅ Datos binarios: muestra conversaciones o chat según selección
- ✅ Indicador de "escribiendo..."
- ✅ Estilos actualizados y mejorados
- ✅ Integración con nuevo hook `useChat`

---

## 8. **Archivos SQL** ✅

### Archivo: `SQL_SETUP_RLS_ACTUAL.sql`

- ✅ Políticas RLS completas basadas en estructura actual
- ✅ Roles soportados: `asesor_comercial`, `usuario_registrado`
- ✅ Control de acceso por tabla:
  - `usuarios`: RLS Disabled
  - `perfiles`: Lectura pública, actualización propia
  - `planes_moviles`: Asesores full access, otros read-only
  - `contrataciones`: Control por usuario/asesor
  - `mensajes`: Control por participantes
  - `solicitudes`: Control por rol

### Archivo: `SQL_AJUSTES_TABLAS.sql`

- ✅ Comandos para añadir campos faltantes
- ✅ Índices para optimización

---

## 📊 RESUMEN DE CAMPOS DE BASE DE DATOS REQUERIDOS

### Tabla `usuarios`

```sql
- id (UUID, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- nombre (VARCHAR)
- telefono (VARCHAR)
- created_at (TIMESTAMP)
```

### Tabla `perfiles`

```sql
- id (UUID, PRIMARY KEY)
- usuario_id (UUID, FK → usuarios.id)
- rol (VARCHAR) -- 'asesor_comercial' o 'usuario_registrado'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `planes_moviles`

```sql
- id (UUID, PRIMARY KEY)
- nombre (VARCHAR)
- descripcion (TEXT)
- gigas (INT)
- minutos (INT)
- precio (DECIMAL)
- promocion (VARCHAR, NULLABLE)
- imagen_url (VARCHAR, NULLABLE)
- creado_por_asesor_id (UUID, FK → usuarios.id, NULLABLE)
- activo (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `contrataciones`

```sql
- id (UUID, PRIMARY KEY)
- plan_id (UUID, FK → planes_moviles.id)
- usuario_id (UUID, FK → usuarios.id)
- asesor_asignado_id (UUID, FK → usuarios.id, NULLABLE)
- estado (VARCHAR) -- 'PENDIENTE', 'ACTIVA', 'CANCELADA'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `mensajes`

```sql
- id (UUID, PRIMARY KEY)
- contratacion_id (UUID, FK → contrataciones.id)
- usuario_id (UUID, FK → usuarios.id)
- contenido (TEXT)
- leido (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP)
```

---

## 🔄 FLUJO DE REALTIME

### Chat

1. Usuario abre chat de contratación
2. `useChat` se suscribe con `subscribeToMensajes(contratacionId)`
3. Nuevo mensaje insertado en Supabase
4. Listener dispara callback automáticamente
5. Mensaje se agrega al estado local sin recargar

### Planes

1. Asesor crea/edita/elimina un plan
2. `usePlanMovil` en otros clientes detecta cambio
3. Estado de planes se actualiza automáticamente
4. UI re-renderiza sin necesidad de recargar página

---

## 🚀 PRÓXIMOS PASOS

### CRITICO (Antes de usar)

- [ ] Ejecutar `SQL_SETUP_RLS_ACTUAL.sql` en Supabase
- [ ] Ejecutar `SQL_AJUSTES_TABLAS.sql` para índices
- [ ] Crear bucket `planes-imagenes` en Storage

### IMPORTANTE (Para completar)

- [ ] Crear pantalla **Detalle de Plan**
- [ ] Crear pantalla **Crear/Editar Plan** (Asesor)
- [ ] Crear pantalla **Solicitudes** con lista de contrataciones pendientes
- [ ] Splash screen / Onboarding

### OPCIONAL (Mejoras)

- [ ] Indicador "escribiendo..." en chat (escribiendo = true)
- [ ] Notificaciones push para nuevos mensajes
- [ ] Typing indicator animado
- [ ] Pruebas unitarias

---

## 🔐 VALIDACIONES IMPLEMENTADAS

### Storage

- ✅ Tamaño máximo: 5MB
- ✅ Formatos: JPG, PNG
- ✅ Path: `planes-imagenes/planes/{timestamp}_{nombre}`

### Auth

- ✅ Email: debe contener `@`
- ✅ Contraseña: mínimo 6 caracteres
- ✅ Teléfono: mínimo 7 dígitos
- ✅ Nombre: no puede estar vacío

### RLS

- ✅ Usuarios no autenticados: solo lectura de planes activos
- ✅ Usuarios registrados: acceso a sus contrataciones y mensajes
- ✅ Asesores: acceso completo a todo lo relacionado con planes

---

## 📝 NOTAS IMPORTANTES

1. **contratacion_id vs conversacion_id**: Ahora se usa `contratacion_id` ya que cada conversación está vinculada a una contratación específica

2. **Realtime subscriptions**: Se limpian automáticamente cuando el componente se desmonta

3. **Storage images**: Las URLs son públicas (lectura), pero solo asesores pueden subir

4. **Roles**: Cambiar `'Asesor'` → `'asesor_comercial'` y `'Registrado'` → `'usuario_registrado'` en la BD si se requiere consistency

5. **Testing**: Probar con diferentes roles para validar RLS funciona correctamente
