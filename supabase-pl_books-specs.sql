-- Ejecutar en Supabase SQL Editor (tabla pl_books)
ALTER TABLE pl_books ADD COLUMN IF NOT EXISTS editorial text;
ALTER TABLE pl_books ADD COLUMN IF NOT EXISTS soporte text;
ALTER TABLE pl_books ADD COLUMN IF NOT EXISTS paginas text;
ALTER TABLE pl_books ADD COLUMN IF NOT EXISTS idioma text;
ALTER TABLE pl_books ADD COLUMN IF NOT EXISTS tema text;
