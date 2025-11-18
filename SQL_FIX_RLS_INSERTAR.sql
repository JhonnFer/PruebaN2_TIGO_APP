-- ============================================
-- FIX: AGREGAR POLÍTICA DE INSERT PARA USUARIOS
-- El registro fallaba porque faltaba esta política
-- ============================================

-- Permitir que usuarios no autenticados creen una cuenta (registro público)
DROP POLICY IF EXISTS "Crear usuario durante registro" ON usuarios;
CREATE POLICY "Crear usuario durante registro" 
ON usuarios FOR INSERT WITH CHECK (true);

-- Alternativa: Si quieres más seguridad, usa esto:
-- CREATE POLICY "Crear usuario durante registro" 
-- ON usuarios FOR INSERT WITH CHECK (auth.uid()::text = usuarioid::text);

-- ============================================
-- TAMBIÉN AGREGAR POLÍTICAS DE INSERT A OTRAS TABLAS
-- ============================================

-- Permitir crear perfiles
DROP POLICY IF EXISTS "Usuarios crean su perfil" ON perfiles;
CREATE POLICY "Usuarios crean su perfil" 
ON perfiles FOR INSERT WITH CHECK (usuarioid = auth.uid());

-- Permitir crear progreso (para solicitudes)
DROP POLICY IF EXISTS "Crear progreso de solicitud" ON progreso;
CREATE POLICY "Crear progreso de solicitud" 
ON progreso FOR INSERT WITH CHECK (
  solicitudid IN (
    SELECT solicitudid FROM solicitudes WHERE usuarioid = auth.uid()
  )
);

-- ============================================
-- VERIFICAR POLÍTICAS ACTUALES (OPCIONAL)
-- Ejecuta esto para ver qué políticas existen
-- ============================================

/*
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
