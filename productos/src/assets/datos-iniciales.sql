-- Insertar países
INSERT INTO pais (id_pais, nombre, codigo) VALUES 
  (gen_random_uuid(), 'Colombia', 'CO'),
  (gen_random_uuid(), 'Estados Unidos', 'US'),
  (gen_random_uuid(), 'Corea del Sur', 'KR');

-- Insertar categorías
INSERT INTO categoria (id_categoria, nombre, descripcion) VALUES 
  (gen_random_uuid(), 'Computadores', 'Equipos de cómputo portátiles y de escritorio'),
  (gen_random_uuid(), 'Monitores', 'Pantallas y displays'),
  (gen_random_uuid(), 'Periféricos', 'Dispositivos de entrada y salida'),
  (gen_random_uuid(), 'Almacenamiento', 'Dispositivos de almacenamiento');

-- Insertar marcas
INSERT INTO marca (id_marca, nombre, descripcion) VALUES 
  (gen_random_uuid(), 'Dell', 'Dell Technologies Inc.'),
  (gen_random_uuid(), 'Samsung', 'Samsung Electronics Co., Ltd.'),
  (gen_random_uuid(), 'Logitech', 'Logitech International S.A.');

-- Insertar unidades de medida
INSERT INTO unidad_medida (id_unidad_medida, nombre, abreviatura) VALUES 
  (gen_random_uuid(), 'Unidad', 'UN'),
  (gen_random_uuid(), 'Kilogramo', 'KG'),
  (gen_random_uuid(), 'Metro', 'M');
