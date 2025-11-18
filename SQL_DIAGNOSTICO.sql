-- ============================================
-- DIAGNÓSTICO: VER ESTRUCTURA ACTUAL
-- Ejecuta esto PRIMERO para saber qué tienes
-- ============================================

-- Ver todas las tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Ver columnas de usuarios
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'usuarios';

-- Ver columnas de planes_moviles
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planes_moviles';

-- Ver columnas de mensajes
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'mensajes';

-- Ver columnas de solicitudes (si existe)
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'solicitudes';
