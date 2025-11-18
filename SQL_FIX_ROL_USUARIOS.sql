-- ============================================
-- FIX DEFINITIVO: POLÍTICAS RLS PARA USUARIOS
-- Permite registro y auth correctamente
-- ============================================

-- PASO 1: Deshabilitar RLS
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar todas las políticas antiguas
DROP POLICY IF EXISTS "Usuarios visibles para todos" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden crear su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios actualizan su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden insertar" ON usuarios;
DROP POLICY IF EXISTS "usuarios_select_all" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update" ON usuarios;
DROP POLICY IF EXISTS "usuarios_delete" ON usuarios;
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Permitir registro público" ON usuarios;

-- PASO 3: Volver a habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear nuevas políticas

-- POLÍTICA 1: Cualquiera puede VER todos los usuarios
CREATE POLICY "usuarios_select_public"
  ON usuarios
  FOR SELECT
  USING (true);

-- POLÍTICA 2: Cualquiera puede INSERTAR (registro público)
CREATE POLICY "usuarios_insert_public"
  ON usuarios
  FOR INSERT
  WITH CHECK (true);

-- POLÍTICA 3: Solo actualizar propio perfil
CREATE POLICY "usuarios_update_own"
  ON usuarios
  FOR UPDATE
  USING (usuarioid = auth.uid())
  WITH CHECK (usuarioid = auth.uid());
  FOR DELETE
  USING (id = auth.uid());

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Reinicia la app
-- 3. Crea un nuevo usuario como CHEF
-- 4. Verifica que aparezca en la tabla usuarios con rol = "chef"
