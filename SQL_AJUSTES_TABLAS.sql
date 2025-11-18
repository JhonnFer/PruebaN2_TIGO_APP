-- ============================================
-- AJUSTES A TABLAS PARA ARQUITECTURA ACTUAL
-- ============================================

-- Si la tabla contrataciones no tiene asesor_asignado_id:
-- ALTER TABLE contrataciones ADD COLUMN asesor_asignado_id UUID REFERENCES usuarios(id);

-- Si la tabla planes_moviles no tiene algunos campos:
-- ALTER TABLE planes_moviles ADD COLUMN imagen_url TEXT;
-- ALTER TABLE planes_moviles ADD COLUMN creado_por_asesor_id UUID REFERENCES usuarios(id);
-- ALTER TABLE planes_moviles ADD COLUMN activo BOOLEAN DEFAULT true;

-- Si la tabla mensajes usa conversacion_id en lugar de contratacion_id:
-- ALTER TABLE mensajes RENAME COLUMN conversacion_id TO contratacion_id;

-- Asegurar índices para rendimiento:
CREATE INDEX IF NOT EXISTS idx_contrataciones_usuario_id ON contrataciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_contrataciones_asesor_id ON contrataciones(asesor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_contratacion_id ON mensajes(contratacion_id);
CREATE INDEX IF NOT EXISTS idx_planes_activos ON planes_moviles(activo);
CREATE INDEX IF NOT EXISTS idx_perfiles_usuario_id ON perfiles(usuario_id);
