-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Update category constraint for 4 categories:
-- research (Pesquisa), docs (Documentação), deep-tech (Deep Tech), ai-labs (AI Labs)
ALTER TABLE news_articles DROP CONSTRAINT IF EXISTS news_articles_category_check;
ALTER TABLE news_articles ADD CONSTRAINT news_articles_category_check
  CHECK (category IN ('research', 'docs', 'deep-tech', 'ai-labs'));

-- Ensure diagrams column exists
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS diagrams JSONB DEFAULT '[]';

CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT,
  subtitle TEXT,
  source TEXT,
  source_url TEXT,
  date TEXT,
  read_time TEXT,
  category TEXT,
  category_label TEXT,
  author_name TEXT,
  author_avatar TEXT,
  image_url TEXT,
  paragraphs JSONB DEFAULT '[]',
  diagrams JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON news_articles
  FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role full access" ON news_articles
  FOR ALL USING (true);
