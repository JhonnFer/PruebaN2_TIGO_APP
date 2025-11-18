-- ============================================
-- SQL FINAL Y FUNCIONAL PARA TIGO APP
-- Estructura: usuarioid en usuarios
-- planes_moviles necesita usuarioid
-- ============================================

-- 1. VERIFICAR Y AGREGAR COLUMNA usuarioid A PLANES_MOVILES
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS usuarioid UUID REFERENCES usuarios(usuarioid) ON DELETE CASCADE;

-- 2. AGREGAR COLUMNAS FALTANTES A PLANES_MOVILES
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS imagen_url TEXT;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS velocidad VARCHAR(50);
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS sms INT;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. VERIFICAR TABLA MENSAJES Y AGREGAR COLUMNAS FALTANTES
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS leido BOOLEAN DEFAULT false;

-- 4. AGREGAR COLUMNAS FALTANTES A SOLICITUDES
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS asesor_asignado_id UUID REFERENCES usuarios(usuarioid) ON DELETE SET NULL;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS fecha_aprobacion TIMESTAMP;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS observaciones TEXT;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 5. CREAR TABLA PERFILES SI NO EXISTE
CREATE TABLE IF NOT EXISTS perfiles (
  perfilid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuarioid UUID NOT NULL UNIQUE REFERENCES usuarios(usuarioid) ON DELETE CASCADE,
  rol VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CREAR TABLA PROGRESO SI NO EXISTE
CREATE TABLE IF NOT EXISTS progreso (
  progresoid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitudid UUID NOT NULL REFERENCES solicitudes(solicitudid) ON DELETE CASCADE,
  porcentaje INT DEFAULT 0,
  estado VARCHAR(50),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREAR ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_planes_usuarioid ON planes_moviles(usuarioid);
CREATE INDEX IF NOT EXISTS idx_planes_activos ON planes_moviles(activo);
CREATE INDEX IF NOT EXISTS idx_mensajes_usuarioid ON mensajes(usuarioid);
CREATE INDEX IF NOT EXISTS idx_mensajes_destinatarioid ON mensajes(destinatarioid);
CREATE INDEX IF NOT EXISTS idx_solicitudes_usuarioid ON solicitudes(usuarioid);
CREATE INDEX IF NOT EXISTS idx_solicitudes_planid ON solicitudes(planid);
CREATE INDEX IF NOT EXISTS idx_solicitudes_asesor ON solicitudes(asesor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_perfiles_usuarioid ON perfiles(usuarioid);
CREATE INDEX IF NOT EXISTS idx_progreso_solicitudid ON progreso(solicitudid);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE planes_moviles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ELIMINAR POLÍTICAS ANTIGUAS (si existen)
-- ============================================

DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios actualizan su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Planes activos son públicos" ON planes_moviles;
DROP POLICY IF EXISTS "Asesor ve sus planes" ON planes_moviles;
DROP POLICY IF EXISTS "Asesor actualiza sus planes" ON planes_moviles;
DROP POLICY IF EXISTS "Asesor crea planes" ON planes_moviles;
DROP POLICY IF EXISTS "Usuarios ven sus mensajes" ON mensajes;
DROP POLICY IF EXISTS "Usuarios envían mensajes" ON mensajes;
DROP POLICY IF EXISTS "Usuarios ven sus solicitudes" ON solicitudes;
DROP POLICY IF EXISTS "Asesor ve solicitudes asignadas" ON solicitudes;
DROP POLICY IF EXISTS "Usuarios crean solicitudes" ON solicitudes;
DROP POLICY IF EXISTS "Usuarios actualizan sus solicitudes" ON solicitudes;
DROP POLICY IF EXISTS "Usuarios ven su perfil" ON perfiles;
DROP POLICY IF EXISTS "Usuarios ven progreso" ON progreso;

-- ============================================
-- CREAR NUEVAS POLÍTICAS DE SEGURIDAD
-- ============================================

-- USUARIOS: Ver propio perfil
CREATE POLICY "Usuarios ven su propio perfil" 
ON usuarios FOR SELECT USING (auth.uid()::text = usuarioid::text);

-- USUARIOS: Actualizar propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil" 
ON usuarios FOR UPDATE USING (auth.uid()::text = usuarioid::text);

-- PLANES: Ver planes activos (públicos)
CREATE POLICY "Planes activos son públicos" 
ON planes_moviles FOR SELECT USING (activo = true);

-- PLANES: Asesor ve sus propios planes
CREATE POLICY "Asesor ve sus planes" 
ON planes_moviles FOR SELECT USING (usuarioid = auth.uid());

-- PLANES: Asesor actualiza sus planes
CREATE POLICY "Asesor actualiza sus planes" 
ON planes_moviles FOR UPDATE USING (usuarioid = auth.uid());

-- PLANES: Asesor crea planes
CREATE POLICY "Asesor crea planes" 
ON planes_moviles FOR INSERT WITH CHECK (usuarioid = auth.uid());

-- MENSAJES: Ver conversaciones
CREATE POLICY "Usuarios ven sus mensajes" 
ON mensajes FOR SELECT USING (
  usuarioid = auth.uid() OR destinatarioid = auth.uid()
);

-- MENSAJES: Enviar mensaje
CREATE POLICY "Usuarios envían mensajes" 
ON mensajes FOR INSERT WITH CHECK (usuarioid = auth.uid());

-- SOLICITUDES: Ver propias solicitudes
CREATE POLICY "Usuarios ven sus solicitudes" 
ON solicitudes FOR SELECT USING (usuarioid = auth.uid());

-- SOLICITUDES: Asesor ve solicitudes asignadas
CREATE POLICY "Asesor ve solicitudes asignadas" 
ON solicitudes FOR SELECT USING (asesor_asignado_id = auth.uid());

-- SOLICITUDES: Crear solicitud
CREATE POLICY "Usuarios crean solicitudes" 
ON solicitudes FOR INSERT WITH CHECK (usuarioid = auth.uid());

-- SOLICITUDES: Actualizar (usuario o asesor)
CREATE POLICY "Usuarios actualizan sus solicitudes" 
ON solicitudes FOR UPDATE USING (usuarioid = auth.uid() OR asesor_asignado_id = auth.uid());

-- PERFILES: Ver propio perfil
CREATE POLICY "Usuarios ven su perfil" 
ON perfiles FOR SELECT USING (usuarioid = auth.uid());

-- PROGRESO: Ver progreso de solicitudes
CREATE POLICY "Usuarios ven progreso" 
ON progreso FOR SELECT USING (
  solicitudid IN (
    SELECT solicitudid FROM solicitudes WHERE usuarioid = auth.uid()
  )
);

-- ============================================
-- INSERTAR DATOS DE PRUEBA (OPCIONAL)
-- Descomenta para agregar datos de prueba
-- ============================================

/*
-- Insertar perfil para usuarios existentes
INSERT INTO perfiles (usuarioid, rol)
SELECT usuarioid, COALESCE(roleid, 'usuario_registrado') 
FROM usuarios
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Este SQL funciona con tu estructura:
-- ✅ usuarios.usuarioid (UUID)
-- ✅ planes_moviles.usuarioid (UUID)
-- ✅ mensajes.usuarioid, destinatarioid (UUID)
-- ✅ solicitudes.usuarioid, planid, solicitudid (UUID)
-- ✅ Todas las políticas RLS configuradas
-- ============================================
