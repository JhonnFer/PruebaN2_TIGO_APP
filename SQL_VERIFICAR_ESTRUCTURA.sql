-- ✅ VERIFICAR ESTRUCTURA DE TABLAS
-- Ejecuta en Supabase SQL Editor

-- 1. Ver estructura de tabla usuarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- 2. Ver estructura de tabla mensajes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'mensajes'
ORDER BY ordinal_position;

-- 3. Ver relaciones Foreign Key
SELECT
    constraint_name,
    table_name,
    column_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'public'
    AND (table_name = 'mensajes' OR table_name = 'usuarios')
    AND referenced_table_name IS NOT NULL;

-- 4. Ver ejemplos de datos
SELECT mensajeid, usuarioid, destinatarioid, mensaje, created_at
FROM mensajes
LIMIT 5;

-- 5. Ver usuarios disponibles
SELECT usuarioid, nombre, email
FROM usuarios
LIMIT 5;
