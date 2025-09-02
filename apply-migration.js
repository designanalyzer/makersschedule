const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('Applying color column migration to goals table...');
    
    // First, let's check if the color column already exists
    const { data: existingData, error: checkError } = await supabase
      .from('goals')
      .select('id, title, category')
      .limit(1);

    if (checkError) {
      console.error('Error checking goals table:', checkError);
      return;
    }

    console.log('Goals table is accessible. Checking for color column...');

    // Try to select the color column to see if it exists
    const { data: colorTest, error: colorError } = await supabase
      .from('goals')
      .select('color')
      .limit(1);

    if (colorError && colorError.code === '42703') {
      console.log('Color column does not exist. You need to add it manually in the Supabase dashboard.');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log(`
        ALTER TABLE goals ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#DAFF7D';
        
        UPDATE goals SET color = CASE 
          WHEN category = 'fitness' THEN '#10B981'
          WHEN category = 'learning' THEN '#8B5CF6'
          WHEN category = 'business' THEN '#059669'
          WHEN category = 'finance' THEN '#F59E0B'
          WHEN category = 'travel' THEN '#14B8A6'
          WHEN category = 'creative' THEN '#EC4899'
          WHEN category = 'health' THEN '#EF4444'
          WHEN category = 'career' THEN '#6366F1'
          WHEN category = 'relationships' THEN '#F97316'
          WHEN category = 'personal' THEN '#6B7280'
          ELSE '#DAFF7D'
        END WHERE color IS NULL;
      `);
      return;
    }

    if (colorError) {
      console.error('Unexpected error checking color column:', colorError);
      return;
    }

    console.log('Color column already exists! Testing query...');
    
    // Test that the column works
    const { data, error } = await supabase
      .from('goals')
      .select('id, title, category, color')
      .limit(1);

    if (error) {
      console.error('Error testing color column:', error);
    } else {
      console.log('Migration successful! Color column is working.');
      console.log('Sample query result:', data);
    }

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyMigration(); 