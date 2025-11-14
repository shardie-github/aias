import { NextResponse } from 'next/server';

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_JWT_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

export async function GET() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  return NextResponse.json({
    ok: missing.length === 0,
    missing,
    timestamp: new Date().toISOString(),
  });
}
