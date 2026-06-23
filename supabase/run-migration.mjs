#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = 'vmqiwwgtlkxmajorteor';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const API_URL = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

async function runMigration() {
  if (!ACCESS_TOKEN) {
    console.error('Error: SUPABASE_ACCESS_TOKEN environment variable is required');
    console.error('Set it with: export SUPABASE_ACCESS_TOKEN=your_token_here');
    process.exit(1);
  }

  const migrationFile = resolve(__dirname, 'migrations', '001_agent_tables.sql');
  const sql = readFileSync(migrationFile, 'utf-8');

  console.log('Running migration: 001_agent_tables.sql');
  console.log(`SQL length: ${sql.length} chars`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Migration failed:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('Migration completed successfully!');
    console.log('Result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error running migration:', error.message);
    process.exit(1);
  }
}

runMigration();
