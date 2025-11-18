-- ============================================
-- ============================================
-- SQL COMPLETO - USANDO "id" EN LUGAR DE "usuarioid"
-- Ejecuta esto si tu tabla usuarios tiene columna "id"
-- ============================================

-- 1. AGREGAR COLUMNAS FALTANTES A USUARIOS
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS roleid VARCHAR(50) DEFAULT 'usuario_registrado';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS perfilid VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. AGREGAR COLUMNAS FALTANTES A PLANES_MOVILES
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS imagen_url TEXT;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS velocidad VARCHAR(50);
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS sms INT;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE planes_moviles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. AGREGAR COLUMNAS FALTANTES A MENSAJES
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS destinatario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS contenido TEXT;
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
-- CREAR ÍNDICES PARA OPTIMIZAR
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
-- Basado en estructura actual de Supabase
-- ============================================

-- PASO 1: TABLA USUARIOS
-- Esta tabla gestiona la autenticación
-- Deshabilitada RLS (Supabase Auth lo maneja)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 2: TABLA PERFILES
-- Almacena rol y datos del usuario
-- ============================================
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver perfiles (público)
CREATE POLICY "perfiles_select_public"
  ON perfiles FOR SELECT
  USING (true);

-- Usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "perfiles_update_self"
  ON perfiles FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- ============================================
-- PASO 3: TABLA PLANES_MOVILES
-- Acceso basado en rol del usuario
-- ============================================
ALTER TABLE planes_moviles ENABLE ROW LEVEL SECURITY;

-- Asesores: Acceso completo a sus planes
CREATE POLICY "planes_asesor_full"
  ON planes_moviles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  );

-- Usuarios registrados e invitados: Solo lectura de planes activos
CREATE POLICY "planes_usuario_read_active"
  ON planes_moviles FOR SELECT
  USING (
    activo = true
    OR EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  );

-- ============================================
-- PASO 4: TABLA CONTRATACIONES
-- Control de acceso por usuario
-- ============================================
ALTER TABLE contrataciones ENABLE ROW LEVEL SECURITY;

-- Asesores: Ven todas las contrataciones
CREATE POLICY "contrataciones_asesor_all"
  ON contrataciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  );

-- Usuarios registrados: Solo ven sus propias contrataciones
CREATE POLICY "contrataciones_usuario_select"
  ON contrataciones FOR SELECT
  USING (usuario_id = auth.uid());

-- Usuarios registrados: Solo pueden crear sus propias contrataciones
CREATE POLICY "contrataciones_usuario_insert"
  ON contrataciones FOR INSERT
  WITH CHECK (usuario_id = auth.uid());

-- Usuarios registrados: Solo pueden actualizar sus propias contrataciones
CREATE POLICY "contrataciones_usuario_update"
  ON contrataciones FOR UPDATE
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

-- Asesores: Pueden actualizar cualquier contratación
CREATE POLICY "contrataciones_asesor_update"
  ON contrataciones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  );

-- ============================================
-- PASO 5: TABLA MENSAJES
-- Chat en tiempo real entre usuario y asesor
-- ============================================
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver mensajes de sus contrataciones
CREATE POLICY "mensajes_select"
  ON mensajes FOR SELECT
  USING (
    -- El usuario es participante de la contratación
    EXISTS (
      SELECT 1 FROM contrataciones c
      WHERE c.id = contratacion_id
      AND (c.usuario_id = auth.uid() OR c.asesor_asignado_id = auth.uid())
    )
    -- O es un asesor viendo todos los mensajes
    OR EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  );

-- Todos pueden insertar mensajes en sus contrataciones
CREATE POLICY "mensajes_insert"
  ON mensajes FOR INSERT
  WITH CHECK (
    usuario_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM contrataciones c
      WHERE c.id = contratacion_id
      AND (c.usuario_id = auth.uid() OR c.asesor_asignado_id = auth.uid())
    )
  );

-- Solo el remitente puede actualizar sus mensajes
CREATE POLICY "mensajes_update"
  ON mensajes FOR UPDATE
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

-- ============================================
-- PASO 6: TABLA SOLICITUDES (si existe)
-- Para gestionar solicitudes de contratación
-- ============================================
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Asesores: Ver todas las solicitudes
CREATE POLICY "solicitudes_asesor_select"
  ON solicitudes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles p
      WHERE p.usuario_id = auth.uid()
      AND p.rol = 'asesor_comercial'
    )
  );

-- Usuarios: Solo ven sus propias solicitudes
CREATE POLICY "solicitudes_usuario_select"
  ON solicitudes FOR SELECT
  USING (usuario_id = auth.uid());

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Después de ejecutar este script:
-- 1. Reinicia tu aplicación
-- 2. Prueba login con usuario registrado
-- 3. Prueba login con asesor
-- 4. Verifica que los permisos funcionan

-- Para ver estado actual:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM pg_policies;
