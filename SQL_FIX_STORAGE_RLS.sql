-- ============================================
-- FIX RLS POLICIES PARA STORAGE BUCKET
-- planes-imagenes
-- ============================================

-- 1. PERMITIR QUE USUARIOS AUTENTICADOS SUBAN IMÁGENES (INSERT)
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
SELECT 
  'planes-imagenes',
  'placeholder',
  auth.uid(),
  '{"size": 0}'::jsonb
WHERE false;  -- This is just to verify structure

-- 2. DROP EXISTING POLICIES IF ANY
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Público puede ver imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Asesores pueden actualizar sus imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Asesores pueden eliminar sus imágenes" ON storage.objects;

-- 3. CREAR NUEVAS POLÍTICAS RLS PARA STORAGE

-- Política: Usuarios autenticados pueden SUBIR imágenes (INSERT)
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'planes-imagenes');

-- Política: Público puede VER imágenes (SELECT)
CREATE POLICY "Público puede ver imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'planes-imagenes');

-- Política: Asesores pueden actualizar sus propias imágenes (UPDATE)
CREATE POLICY "Asesores pueden actualizar sus imágenes"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'planes-imagenes' AND owner = auth.uid())
WITH CHECK (bucket_id = 'planes-imagenes' AND owner = auth.uid());

-- Política: Asesores pueden eliminar sus propias imágenes (DELETE)
CREATE POLICY "Asesores pueden eliminar sus imágenes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'planes-imagenes' AND owner = auth.uid());

-- ============================================
-- ALTERNATIVA: Si las políticas anteriores no funcionan,
-- Ejecuta esta versión simplificada:
-- ============================================

-- Versión simplificada: Permitir todo a usuarios autenticados
/*
CREATE POLICY "allow_authenticated_uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'planes-imagenes');

CREATE POLICY "allow_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'planes-imagenes');

CREATE POLICY "allow_authenticated_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'planes-imagenes');
*/

-- ============================================
-- VERIFICAR ESTADO DEL BUCKET
-- ============================================

-- Ver configuración actual del bucket
SELECT id, name, public, avif_autodetection, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name = 'planes-imagenes';

-- Ver todas las políticas del bucket
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- ============================================
-- NOTA IMPORTANTE:
-- El bucket 'planes-imagenes' debe estar configurado como PUBLIC
-- en Supabase Console > Storage > planes-imagenes > Settings
-- ============================================
