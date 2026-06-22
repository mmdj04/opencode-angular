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

-- ============================================================
-- Generated Code Repositories
-- ============================================================

CREATE TABLE IF NOT EXISTS generated_repos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  language TEXT NOT NULL,
  language_color TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  stars_today INTEGER DEFAULT 0,
  watch INTEGER DEFAULT 0,
  topics TEXT[] DEFAULT '{}',
  license TEXT DEFAULT 'MIT',
  default_branch TEXT DEFAULT 'main',
  template TEXT NOT NULL,
  files JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE generated_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON generated_repos
  FOR SELECT USING (true);

CREATE POLICY "Service role full access" ON generated_repos
  FOR ALL USING (true);
