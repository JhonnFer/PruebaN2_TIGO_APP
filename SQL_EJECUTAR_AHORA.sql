-- ============================================
-- SQL COMPLETO Y FUNCIONAL PARA TIGO APP
-- Ejecutar en: Supabase SQL Editor
-- ============================================

-- 1. CREAR TABLA USUARIOS (si no existe)
CREATE TABLE IF NOT EXISTS usuarios (
  usuarioid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  roleid VARCHAR(50) DEFAULT 'usuario_registrado',
  perfilid VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREAR TABLA PLANES_MOVILES
CREATE TABLE IF NOT EXISTS planes_moviles (
  planid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuarioid UUID NOT NULL REFERENCES usuarios(usuarioid) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  datos INT,
  minutos INT,
  velocidad VARCHAR(50),
  sms INT,
  descripcion TEXT,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CREAR TABLA MENSAJES
CREATE TABLE IF NOT EXISTS mensajes (
  mensajeid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuarioid UUID NOT NULL REFERENCES usuarios(usuarioid) ON DELETE CASCADE,
  destinatarioid UUID NOT NULL REFERENCES usuarios(usuarioid) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CREAR TABLA SOLICITUDES (CONTRATACIONES)
CREATE TABLE IF NOT EXISTS solicitudes (
  solicitudid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuarioid UUID NOT NULL REFERENCES usuarios(usuarioid) ON DELETE CASCADE,
  planid UUID NOT NULL REFERENCES planes_moviles(planid) ON DELETE CASCADE,
  asesor_asignado_id UUID REFERENCES usuarios(usuarioid) ON DELETE SET NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_aprobacion TIMESTAMP,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CREAR TABLA PERFILES
CREATE TABLE IF NOT EXISTS perfiles (
  perfilid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuarioid UUID NOT NULL UNIQUE REFERENCES usuarios(usuarioid) ON DELETE CASCADE,
  rol VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CREAR TABLA PROGRESO (Para rastrear progreso de contratos)
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
-- POLÍTICAS DE SEGURIDAD BÁSICAS
-- ============================================

-- Usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios ven su propio perfil" 
ON usuarios FOR SELECT USING (auth.uid()::text = usuarioid::text);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil" 
ON usuarios FOR UPDATE USING (auth.uid()::text = usuarioid::text);

-- Planes públicos (cualquiera puede verlos)
CREATE POLICY "Planes públicos" 
ON planes_moviles FOR SELECT USING (activo = true);

-- Asesor puede ver/actualizar sus planes
CREATE POLICY "Asesor ve sus planes" 
ON planes_moviles FOR SELECT USING (usuarioid = auth.uid());

CREATE POLICY "Asesor actualiza sus planes" 
ON planes_moviles FOR UPDATE USING (usuarioid = auth.uid());

-- Mensajes: usuarios pueden ver sus conversaciones
CREATE POLICY "Usuarios ven sus mensajes" 
ON mensajes FOR SELECT USING (
  usuarioid = auth.uid() OR destinatarioid = auth.uid()
);

-- Usuarios pueden enviar mensajes
CREATE POLICY "Usuarios envían mensajes" 
ON mensajes FOR INSERT WITH CHECK (usuarioid = auth.uid());

-- Solicitudes: usuarios ven sus solicitudes
CREATE POLICY "Usuarios ven sus solicitudes" 
ON solicitudes FOR SELECT USING (usuarioid = auth.uid());

-- Asesores ven solicitudes asignadas
CREATE POLICY "Asesor ve solicitudes asignadas" 
ON solicitudes FOR SELECT USING (asesor_asignado_id = auth.uid());

-- Usuarios pueden crear solicitudes
CREATE POLICY "Usuarios crean solicitudes" 
ON solicitudes FOR INSERT WITH CHECK (usuarioid = auth.uid());

-- Perfiles: usuarios ven su perfil
CREATE POLICY "Usuarios ven su perfil" 
ON perfiles FOR SELECT USING (usuarioid = auth.uid());

-- Progreso: usuarios ver progreso de sus solicitudes
CREATE POLICY "Usuarios ven progreso" 
ON progreso FOR SELECT USING (
  solicitudid IN (
    SELECT solicitudid FROM solicitudes WHERE usuarioid = auth.uid()
  )
);

-- ============================================
-- INSERTAR DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Descomentar si desea datos de prueba
/*
-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre, email, password, roleid, perfilid) VALUES
('Juan Asesor', 'juan@tigo.com', 'pass123', 'asesor_comercial', 'asesor'),
('María Registrada', 'maria@gmail.com', 'pass123', 'usuario_registrado', 'cliente'),
('Pedro Registrado', 'pedro@gmail.com', 'pass123', 'usuario_registrado', 'cliente')
ON CONFLICT DO NOTHING;

-- Insertar planes de prueba
INSERT INTO planes_moviles (usuarioid, nombre, precio, datos, minutos, velocidad, sms, descripcion, activo) 
SELECT usuarioid, 'Plan Básico', 15.99, 5, 100, '4G', 50, 'Plan básico con 5GB de datos', true
FROM usuarios WHERE email = 'juan@tigo.com'
ON CONFLICT DO NOTHING;

INSERT INTO planes_moviles (usuarioid, nombre, precio, datos, minutos, velocidad, sms, descripcion, activo) 
SELECT usuarioid, 'Plan Premium', 29.99, 20, 300, '4G', 200, 'Plan premium con 20GB de datos', true
FROM usuarios WHERE email = 'juan@tigo.com'
ON CONFLICT DO NOTHING;

-- Insertar perfiles
INSERT INTO perfiles (usuarioid, rol) 
SELECT usuarioid, roleid FROM usuarios
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Notas:
-- 1. Este SQL está diseñado para tu estructura real
-- 2. Copia TODO el contenido y pégalo en Supabase SQL Editor
-- 3. Si hay errores, probablemente las tablas ya existen
-- 4. En ese caso, ejecuta solo las líneas de índices y políticas
-- ============================================
