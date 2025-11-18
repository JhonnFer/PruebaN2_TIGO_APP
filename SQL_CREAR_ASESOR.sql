-- ============================================
-- SQL: CREAR NUEVO ASESOR (VERSIÓN CORREGIDA)
-- Sin perfilid (es para la tabla perfiles, no usuarios)
-- ============================================

INSERT INTO usuarios (nombre, email, password, telefono, roleid)
VALUES (
  'Carlos Asesor',
  'carlos.asesor@tigo.com.ec',
  'password123',
  '0987654321',
  'asesor_comercial'
);

-- ============================================
-- VERIFICAR QUE EL ASESOR FUE CREADO
-- ============================================

SELECT usuarioid, nombre, email, roleid FROM usuarios WHERE email = 'carlos.asesor@tigo.com.ec';

-- ============================================
-- CREAR PLANES DE PRUEBA PARA EL ASESOR
-- ============================================

INSERT INTO planes_moviles (usuarioid, nombre, precio, datos, minutos, velocidad, sms, descripcion, activo)
VALUES (
  (SELECT usuarioid FROM usuarios WHERE email = 'carlos.asesor@tigo.com.ec' LIMIT 1),
  'Plan Básico Pro',
  19.99,
  10,
  150,
  '4G LTE',
  100,
  'Plan básico con 10GB de datos y 150 minutos',
  true
);

INSERT INTO planes_moviles (usuarioid, nombre, precio, datos, minutos, velocidad, sms, descripcion, activo)
VALUES (
  (SELECT usuarioid FROM usuarios WHERE email = 'carlos.asesor@tigo.com.ec' LIMIT 1),
  'Plan Premium Plus',
  39.99,
  50,
  500,
  '4G LTE',
  500,
  'Plan premium con 50GB de datos y 500 minutos ilimitados',
  true
);

-- ============================================
-- FIN
-- ============================================
