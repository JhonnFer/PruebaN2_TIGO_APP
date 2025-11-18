-- ============================================
-- SQL PARA ESTRUCTURA CON NOMBRES EN SNAKE_CASE
-- (Si tus columnas son: id, usuario_id, destinatario_id, contenido)
-- ============================================

-- 1. AGREGAR COLUMNAS FALTANTES A USUARIOS
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS roleid VARCHAR(50) DEFAULT 'usuario_registrado';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS perfilid VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. AGREGAR COLUMNAS FALTANTES A PLANES_MOVILES
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS imagen_url TEXT;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. AGREGAR COLUMNAS FALTANTES A MENSAJES
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS leido BOOLEAN DEFAULT false;

-- 4. CREAR TABLA SOLICITUDES SI NO EXISTE
CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES planes_moviles(id) ON DELETE CASCADE,
  asesor_asignado_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_aprobacion TIMESTAMP,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CREAR TABLA PERFILES SI NO EXISTE
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  rol VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CREAR TABLA PROGRESO SI NO EXISTE
CREATE TABLE IF NOT EXISTS progreso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id UUID NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
  porcentaje INT DEFAULT 0,
  estado VARCHAR(50),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREAR ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_planes_usuario_id ON planes_moviles(usuario_id);
CREATE INDEX IF NOT EXISTS idx_planes_activos ON planes_moviles(activo);
CREATE INDEX IF NOT EXISTS idx_mensajes_usuario_id ON mensajes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_destinatario_id ON mensajes(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_usuario_id ON solicitudes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_plan_id ON solicitudes(plan_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_asesor ON solicitudes(asesor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_perfiles_usuario_id ON perfiles(usuario_id);
CREATE INDEX IF NOT EXISTS idx_progreso_solicitud_id ON progreso(solicitud_id);

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
-- POLÍTICAS DE SEGURIDAD
-- ============================================

-- Usuarios ven su propio perfil
CREATE POLICY "Usuarios ven su propio perfil" 
ON usuarios FOR SELECT USING (auth.uid() = id);

-- Usuarios actualizan su propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil" 
ON usuarios FOR UPDATE USING (auth.uid() = id);

-- Planes activos son públicos
CREATE POLICY "Planes públicos" 
ON planes_moviles FOR SELECT USING (activo = true);

-- Asesor ve sus propios planes
CREATE POLICY "Asesor ve sus planes" 
ON planes_moviles FOR SELECT USING (usuario_id = auth.uid());

-- Asesor actualiza sus planes
CREATE POLICY "Asesor actualiza sus planes" 
ON planes_moviles FOR UPDATE USING (usuario_id = auth.uid());

-- Asesor crea planes
CREATE POLICY "Asesor crea planes" 
ON planes_moviles FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Usuarios ven sus mensajes
CREATE POLICY "Usuarios ven sus mensajes" 
ON mensajes FOR SELECT USING (
  usuario_id = auth.uid() OR destinatario_id = auth.uid()
);

-- Usuarios envían mensajes
CREATE POLICY "Usuarios envían mensajes" 
ON mensajes FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Usuarios ven sus solicitudes
CREATE POLICY "Usuarios ven sus solicitudes" 
ON solicitudes FOR SELECT USING (usuario_id = auth.uid());

-- Asesores ven solicitudes asignadas
CREATE POLICY "Asesor ve solicitudes asignadas" 
ON solicitudes FOR SELECT USING (asesor_asignado_id = auth.uid());

-- Usuarios crean solicitudes
CREATE POLICY "Usuarios crean solicitudes" 
ON solicitudes FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Usuarios ven perfiles propios
CREATE POLICY "Usuarios ven su perfil" 
ON perfiles FOR SELECT USING (usuario_id = auth.uid());

-- Usuarios ven progreso de solicitudes
CREATE POLICY "Usuarios ven progreso" 
ON progreso FOR SELECT USING (
  solicitud_id IN (
    SELECT id FROM solicitudes WHERE usuario_id = auth.uid()
  )
);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Si sigue dando error:
-- 1. Dime exactamente qué columnas tiene cada tabla
-- 2. O ejecuta SQL_DIAGNOSTICO.sql primero
-- ============================================
