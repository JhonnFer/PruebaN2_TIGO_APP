# FIX: Error de RLS en Storage - Image Upload

## Problema

```
ERROR: Error subiendo imagen: new row violates row-level security policy
```

## Causa Raíz

El bucket `planes-imagenes` en Supabase Storage tiene RLS habilitado pero no tiene políticas que permitan a usuarios autenticados subir archivos.

## Solución (3 Pasos)

### Paso 1: Verificar Configuración del Bucket en Supabase Console

1. Ve a **Supabase Console** > **Storage** > **planes-imagenes**
2. Haz clic en **Settings** (esquina superior derecha)
3. Asegúrate que:
   - ✅ **Public** está activado (toggle ON)
   - ✅ **File size limit**: 52 MB (o más)
   - ✅ **Allowed MIME types**: image/jpeg, image/png

### Paso 2: Agregar Políticas RLS en Storage (En SQL Editor)

Ejecuta en Supabase SQL Editor:

```sql
-- Permitir INSERT: usuarios autenticados pueden subir
CREATE POLICY "allow_authenticated_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'planes-imagenes');

-- Permitir SELECT: público puede ver (para URLs públicas)
CREATE POLICY "allow_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'planes-imagenes');

-- Permitir DELETE: usuario propietario puede eliminar
CREATE POLICY "allow_owner_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'planes-imagenes' AND owner = auth.uid());
```

### Paso 3: Actualizar Función de Upload (Opcional pero Recomendado)

El código actual en `usePlanMovil.ts` ya está correcto. Solo asegurate que:

```typescript
const { error } = await supabase.storage
  .from("planes-imagenes")
  .upload(ruta, archivo, {
    cacheControl: "3600",
    upsert: false,
  });

if (error) throw new Error(error.message);
```

La autenticación se maneja automáticamente via `auth.uid()`.

## Verificación Rápida

Después de hacer los cambios:

1. Intenta crear un plan con imagen nuevamente
2. Verifica en **Supabase Console** > **Storage** > **planes-imagenes** que aparezca el archivo
3. Comprueba que la `imagen_url` en la DB tenga la URL correcta

## Alternativa: Deshabilitar RLS en Storage

Si los pasos anteriores no funcionan, puedes deshabilitar RLS en el bucket:

1. Ve a **Storage** > **planes-imagenes** > **Settings**
2. Desactiva el toggle **Enable RLS**
3. El bucket pasará a ser completamente público

⚠️ Nota: No recomendado en producción por razones de seguridad.

## Archivos Relacionados

- `src/presentation/hooks/usePlanMovil.ts` - función `subirImagenPlan` (líneas 324-350)
- `app/(tabs)/Asesor/crear-plan.tsx` - formulario que llama a la función

## Status

- ✅ Validación de archivo (extensión): CORRECTA
- ❌ Permisos de Storage: NECESITA FIX
- ✅ Código de upload: CORRECTO
