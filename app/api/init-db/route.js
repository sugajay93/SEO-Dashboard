import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

export async function GET() {
  try {
    // Create the function for checking and creating tables if it doesn't exist
    const { error: functionError } = await supabase.rpc('create_check_table_function', {
      function_query: `
        CREATE OR REPLACE FUNCTION check_and_create_table(table_name text, create_query text)
        RETURNS VOID AS $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = table_name
          ) THEN
            EXECUTE create_query;
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (functionError) {
      // If the function can't be created directly via RPC, try with a raw SQL query
      const { error: sqlError } = await supabase.sql(`
        CREATE OR REPLACE FUNCTION check_and_create_table(table_name text, create_query text)
        RETURNS VOID AS $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = table_name
          ) THEN
            EXECUTE create_query;
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
      
      if (sqlError) {
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to create helper function',
          error: sqlError 
        }, { status: 500 });
      }
    }

    // Create clients table if it doesn't exist
    const { error: clientsError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        website TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        status TEXT DEFAULT 'active',
        auth_user_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    if (clientsError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create clients table',
        error: clientsError 
      }, { status: 500 });
    }

    // Create keywords table if it doesn't exist
    const { error: keywordsError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS keywords (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        keyword TEXT NOT NULL,
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        current_position INTEGER,
        previous_position INTEGER,
        best_position INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    if (keywordsError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create keywords table',
        error: keywordsError 
      }, { status: 500 });
    }

    // Create backlinks table if it doesn't exist
    const { error: backlinksError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS backlinks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        source_url TEXT NOT NULL,
        target_url TEXT NOT NULL,
        anchor_text TEXT,
        do_follow BOOLEAN DEFAULT true,
        cost DECIMAL(10, 2),
        acquired_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    if (backlinksError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create backlinks table',
        error: backlinksError 
      }, { status: 500 });
    }

    // Create user_profiles table if it doesn't exist
    const { error: userProfilesError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY,
        email TEXT,
        client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    if (userProfilesError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create user_profiles table',
        error: userProfilesError 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error initializing database',
      error: error.message 
    }, { status: 500 });
  }
}