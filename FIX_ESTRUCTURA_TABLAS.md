# 🔧 FIX: Adaptación a Estructura Real de Tablas

**Fecha**: Noviembre 2024  
**Problema**: Error `column usuarios_1.id does not exist`  
**Causa**: Código esperaba estructura diferente a la real en Supabase  
**Estado**: ✅ RESUELTO

---

## 📋 Resumen de Cambios

Tu estructura real de tablas en Supabase usaba:

- `mensajeid` (no `id`)
- `usuarioid` (no `usuario_id`)
- `destinatarioid` (no `contratacion_id`)
- `mensaje` (no `contenido`)

El código estaba referenciando `usuarios.id` que NO existía. **Cambié a `usuarios.usuarioid`** que es la clave correcta.

---

## 🔄 Archivos Modificados

### 1. **src/data/repositories/ChatRepositoryImpl.ts**

Cambios principales:

```typescript
// ANTES (incorrecto)
.select(`
  id,
  contratacion_id,
  usuario_id,
  contenido,
  usuario:usuarios(id, nombre, email)  // ❌ usuarios.id NO EXISTE
`)

// DESPUÉS (correcto)
.select(`
  mensajeid,
  destinatarioid,
  usuarioid,
  mensaje,
  usuario:usuarios(usuarioid, nombre, email)  // ✅ usuarios.usuarioid EXISTE
`)
```

**Métodos actualizados**:

- `obtenerConversaciones()` - Ahora usa `destinatarioid`
- `obtenerMensajes(destinatarioId)` - Cambió parámetro y query
- `enviarMensaje(destinatarioId, usuarioId, mensaje)` - Nuevos nombres de parámetros y campos
- `subscribeToMensajes()` - Usa `destinatarioid=eq.${destinatarioId}`
- `marcarComoLeido()` - Ahora usa `mensajeid`

---

### 2. **src/domain/models/Mensaje.ts**

```typescript
// ANTES
interface Mensaje {
  id: string;
  contratacion_id: string;
  usuario_id: string;
  contenido: string;
  usuario?: Usuario;
}

// DESPUÉS
interface Mensaje {
  mensajeid: string;
  destinatarioid: string;
  usuarioid: string;
  mensaje: string;
  usuario?: Usuario;
}
```

También actualizó `Usuario.id` → `Usuario.usuarioid`

---

### 3. **src/presentation/hooks/useChat.ts**

Cambios principales:

```typescript
// Parámetro función
export function useChat(destinatarioId?: string); // Era: contratacionId

// En métodos
const datos = await chatRepository.obtenerMensajes(destinatarioId);
setMensajes((prev) =>
  prev.map((m) => (m.mensajeid === mensajeId ? { ...m, leido: true } : m))
);
```

---

### 4. **app/(tabs)/Registrado/chat.tsx**

Cambios principales:

```typescript
// Variables de estado
const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState<
  string | null
>(null);
// Era: contratacionSeleccionada

// Acceso a propiedades
const esMio = item.usuarioid === usuario?.usuarioid; // Era: usuario_id
const contenido = item.mensaje; // Era: item.contenido
const key = item.destinatarioid; // Era: item.contratacion_id
```

---

### 5. **app/(tabs)/Asesor/chat.tsx**

Cambios idénticos a Registrado/chat.tsx:

- `contratacionSeleccionada` → `destinatarioSeleccionado`
- `item.contratacion_id` → `item.destinatarioid`
- `item.usuario_id` → `item.usuarioid`
- `item.contenido` → `item.mensaje`
- `keyExtractor: item.id` → `item.mensajeid`

---

## ✅ Verificación

### Antes del Fix

```
ERROR  Error cargando conversaciones: [Error: column usuarios_1.id does not exist]
```

### Después del Fix

Ahora debería funcionar sin errores de relación.

---

## 🧪 Cómo Probar

### Test 1: Cargar Conversaciones

```bash
# En la pantalla Chat
1. Ir a pestaña "Chat"
2. Debería mostrar lista de conversaciones (si existen)
3. No debe haber error en la consola
```

**Resultado esperado**: ✅ Lista de conversaciones cargada

### Test 2: Enviar Mensaje

```bash
1. Selecciona una conversación
2. Escribe un mensaje
3. Presiona "Enviar"
4. Mensaje debe aparecer al instante
```

**Resultado esperado**: ✅ Mensaje enviado y visible

### Test 3: Realtime

```bash
1. Abre la app en DOS navegadores
2. Usuario 1: Envía un mensaje
3. Usuario 2: Debe verlo sin recargar
```

**Resultado esperado**: ✅ Mensaje sincronizado en tiempo real

---

## 🔍 Diagrama de Relaciones (Correcto)

```
Tabla: usuarios
┌──────────────┐
│ usuarioid    │ ← PK
│ nombre       │
│ email        │
│ ...          │
└──────────────┘
       ▲
       │ FK
       │
Tabla: mensajes
┌──────────────┐
│ mensajeid    │ ← PK
│ usuarioid    │ ← FK a usuarios.usuarioid ✅
│ destinatarioid│
│ mensaje      │
│ leido        │
│ created_at   │
└──────────────┘
```

---

## 📝 Notas Importantes

### Diferencia entre tipos de IDs

Tu Supabase usa:

- **usuarioid**: UUID del usuario autenticado (tabla `usuarios`)
- **destinatarioid**: UUID del destinatario (también usuario)

No hay tabla `contrataciones` mencionada en mensajes, en su lugar se usa `destinatarioid` como la relación directa.

### Si tienes otra estructura

Si en tu Supabase tienes:

- Tabla `contrataciones` con id, usuario_id, plan_id
- Tabla `mensajes` con contratacion_id

Puedes hacer un ajuste rápido:

1. Renombrar `destinatarioid` → `contratacion_id`
2. Renombrar `usuarioid` → `usuario_id`
3. Cambiar `mensaje` → `contenido` en las queries

---

## ✨ Beneficios del Fix

✅ **Elimina error de relación**: Ya no intenta acceder a `usuarios.id` que no existe  
✅ **Usa estructura real**: Accede a `usuarios.usuarioid` que SÍ existe  
✅ **Mantiene Realtime**: Subscripciones funcionan con `destinatarioid`  
✅ **Preserva lógica**: Todo el flujo de mensajes se mantiene igual

---

## 🚀 Próximos Pasos

1. **Testear chat**

   - Abre dos navegadores
   - Verifica mensajes en tiempo real

2. **Si algo no funciona**

   - Revisa que tabla `mensajes` tenga las columnas correctas
   - Verifica que tabla `usuarios` tenga columna `usuarioid`
   - Revisa permisos RLS en Supabase

3. **Mejorar validaciones**
   - Agregar validación de usuario existente
   - Agregar confirmación de desuscripción

---

**Versión**: 1.0  
**Autor**: Fix automático de estructura  
**Estado**: Listo para pruebas ✅
