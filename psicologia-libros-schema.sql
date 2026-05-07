-- ============================================================
-- PSICOLOGÍA LIBROS — Schema Setup
-- Ejecutar en: Supabase Studio → SQL Editor (api.neura.com.py)
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

-- Categorías
CREATE TABLE IF NOT EXISTS pl_categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  icon_name   TEXT,          -- nombre del ícono: 'brain','heart','waves', etc.
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Libros
CREATE TABLE IF NOT EXISTS pl_books (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  category_id   TEXT REFERENCES pl_categories(id),
  description   TEXT,
  price         TEXT DEFAULT 'Consultar precio',
  status        TEXT DEFAULT 'disponible'
                  CHECK (status IN ('disponible','consultar')),
  cover_palette TEXT DEFAULT 'coal'
                  CHECK (cover_palette IN ('coal','red','blue','ivory','green','plum')),
  cover_short   TEXT,
  featured      BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS pl_faqs (
  id         SERIAL PRIMARY KEY,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY — lectura pública, escritura solo admin
-- ============================================================

ALTER TABLE pl_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pl_books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pl_faqs       ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anon)
CREATE POLICY "pl_categories_read" ON pl_categories FOR SELECT USING (true);
CREATE POLICY "pl_books_read"      ON pl_books      FOR SELECT USING (true);
CREATE POLICY "pl_faqs_read"       ON pl_faqs       FOR SELECT USING (true);

-- Escritura solo service_role (admin)
CREATE POLICY "pl_categories_write" ON pl_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "pl_books_write"      ON pl_books      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "pl_faqs_write"       ON pl_faqs       FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- DATOS INICIALES — Categorías
-- ============================================================
INSERT INTO pl_categories (id, name, description, icon_name, sort_order) VALUES
  ('clinica',      'Psicología clínica',      'Bases teóricas y prácticas para la evaluación e intervención.',        'brain',       1),
  ('salud',        'Salud mental',             'Lecturas para comprender el bienestar y la atención profesional.',      'heart',       2),
  ('ansiedad',     'Trastornos de ansiedad',   'Marcos para abordar la ansiedad desde la evidencia.',                  'waves',       3),
  ('depresion',    'Depresión',                'Material académico y clínico sobre estados depresivos.',               'cloud',       4),
  ('neuro',        'Neuropsicología',          'Cerebro, cognición y conducta en obras de referencia.',               'neurons',     5),
  ('psicoterapia', 'Psicoterapia',             'Enfoques y modelos de intervención contemporáneos.',                  'chat',        6),
  ('desarrollo',   'Desarrollo personal',      'Lecturas formativas para el crecimiento humano.',                     'seed',        7),
  ('infantil',     'Psicología infantil',      'Desarrollo, vínculo y aprendizaje en la infancia.',                  'child',       8),
  ('psiquiatria',  'Psiquiatría',              'Manuales y obras de referencia clínica.',                             'stethoscope', 9),
  ('trauma',       'Trauma y duelo',           'Procesos de elaboración, pérdida y resiliencia.',                    'hourglass',   10),
  ('vinculos',     'Relaciones y vínculos',    'Apego, pareja y dinámicas familiares.',                              'link',        11),
  ('mindfulness',  'Mindfulness y bienestar',  'Atención plena, regulación emocional y prácticas.',                  'leaf',        12)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DATOS INICIALES — Libros (12 de ejemplo)
-- ============================================================
INSERT INTO pl_books (title, author, category_id, description, price, status, cover_palette, cover_short, featured) VALUES
  ('Introducción a la Psicología Clínica',   'M. Aldana Vera',          'clinica',      'Recorrido por los fundamentos teóricos, métodos de evaluación y principios de intervención en la práctica clínica contemporánea.', 'Gs. 215.000', 'disponible', 'coal',  'Psicología\nClínica',      true),
  ('Fundamentos de Salud Mental',            'C. Riveros · L. Acosta',  'salud',        'Una mirada integrada sobre la salud mental, sus determinantes y los modelos de atención centrados en la persona.',                'Gs. 198.000', 'disponible', 'ivory', 'Salud\nMental',            true),
  ('Ansiedad: Comprensión y Abordaje',       'D. Estigarribia',         'ansiedad',     'Explora los procesos cognitivos y emocionales asociados a los cuadros de ansiedad y su tratamiento basado en evidencia.',        'Gs. 175.000', 'disponible', 'blue',  'Ansiedad',                 false),
  ('Neuropsicología Aplicada',               'R. Benítez Galeano',      'neuro',        'Bases neuropsicológicas, evaluación funcional y rehabilitación cognitiva en distintas etapas del ciclo vital.',                 'Gs. 285.000', 'disponible', 'coal',  'Neuro-\npsicología',       true),
  ('Psicoterapia Contemporánea',             'S. Vázquez Núñez',        'psicoterapia', 'Una panorámica de los principales enfoques psicoterapéuticos actuales, con especial atención a la integración clínica.',        'Consultar precio', 'consultar', 'red', 'Psicoterapia',           true),
  ('Trauma, Duelo y Resiliencia',            'P. Almada Ferreira',      'trauma',       'Procesos de elaboración del trauma, acompañamiento del duelo y desarrollo de recursos para la resiliencia.',                    'Gs. 230.000', 'disponible', 'plum', 'Trauma\n& Duelo',          true),
  ('Psicología Infantil y Desarrollo',       'G. Ortiz Mendoza',        'infantil',     'Hitos del desarrollo, dinámicas vinculares y herramientas de observación para el trabajo con la infancia.',                    'Gs. 205.000', 'disponible', 'ivory','Infancia\n& Desarrollo',   false),
  ('Mindfulness y Bienestar Emocional',      'L. Cardozo',              'mindfulness',  'Atención plena, regulación emocional y prácticas contemplativas con base científica para el bienestar cotidiano.',             'Gs. 165.000', 'disponible', 'green','Mindfulness',              true),
  ('Manual de Psiquiatría Clínica',          'F. Mereles Duarte',       'psiquiatria',  'Obra de referencia para el estudio de los principales cuadros psiquiátricos y sus criterios diagnósticos.',                    'Gs. 340.000', 'consultar',  'coal', 'Psiquiatría',              false),
  ('Depresión: Lecturas Clínicas',           'N. Sosa Villalba',        'depresion',    'Aproximaciones contemporáneas al estudio y abordaje de los trastornos del estado de ánimo.',                                   'Gs. 195.000', 'disponible', 'blue', 'Depresión',               false),
  ('Vínculos, Apego y Pareja',               'I. Romero Cáceres',       'vinculos',     'Teoría del apego aplicada a la comprensión de los vínculos adultos y la dinámica de pareja.',                                  'Gs. 220.000', 'disponible', 'red',  'Vínculos',                false),
  ('Desarrollo Humano: Una Mirada Integrada','T. Aguilera',             'desarrollo',   'Lecturas formativas sobre el crecimiento personal, el sentido y los procesos del desarrollo a lo largo de la vida.',           'Gs. 180.000', 'disponible', 'green','Desarrollo\nHumano',       false)
;

-- ============================================================
-- DATOS INICIALES — FAQs
-- ============================================================
INSERT INTO pl_faqs (question, answer, sort_order) VALUES
  ('¿Cómo puedo consultar por un libro?',                         'Podés hacerlo desde el botón de WhatsApp en cada libro o desde la sección de contacto.',                                                         1),
  ('¿Los libros están disponibles para entrega inmediata?',       'La disponibilidad puede variar según el título. Cada consulta será confirmada por WhatsApp.',                                                    2),
  ('¿Puedo pedir un libro que no aparece en el catálogo?',        'Sí, podés escribirnos indicando el título o autor que estás buscando y haremos lo posible por gestionarlo.',                                     3),
  ('¿Tienen libros para estudiantes de psicología?',              'Sí, contamos con materiales para estudiantes, profesionales y personas interesadas en salud mental.',                                            4),
  ('¿Realizan envíos?',                                           'Consultanos por WhatsApp para confirmar disponibilidad de envíos y coordinar la entrega.',                                                       5),
  ('¿Los precios están actualizados?',                            'Los precios se actualizan regularmente. Ante cualquier duda podés consultar directamente por WhatsApp.',                                         6)
;

SELECT 'Schema psicología-libros creado correctamente ✓' AS resultado;
