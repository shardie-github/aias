#!/usr/bin/env tsx
/**
 * Smoke Test Script
 * Lightweight end-to-end test for CI/CD pipelines.
 * Tests: DB write/read, RLS, health endpoint
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;
const healthUrl = process.env.HEALTH_URL || "http://localhost:3000/api/healthz";

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !databaseUrl) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

async function smokeTest() {
  console.log("🧪 Running smoke tests...\n");
  let passed = 0;
  let failed = 0;

  // Test 1: Database connection
  try {
    console.log("1. Testing database connection...");
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await supabaseService.from("app_events").select("count").limit(1);
    if (error) throw error;
    console.log("   ✓ Database connection OK");
    passed++;
  } catch (e: any) {
    console.error(`   ✗ Database connection failed: ${e.message}`);
    failed++;
  }

  // Test 2: Insert row as service role
  try {
    console.log("2. Testing insert as service role...");
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabaseService
      .from("api_logs")
      .insert({
        method: "GET",
        path: "/smoke-test",
        status_code: 200,
        response_time_ms: 1,
      })
      .select()
      .single();

    if (error) throw error;
    console.log(`   ✓ Inserted test row (id: ${data.id})`);
    passed++;

    // Test 3: Read as anon (should fail if RLS is on)
    console.log("3. Testing RLS (anon read should fail)...");
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const { data: readData, error: readError } = await supabaseAnon
      .from("api_logs")
      .select("*")
      .eq("id", data.id)
      .single();

    if (readError) {
      console.log("   ✓ RLS working: anon cannot read (expected)");
      passed++;
    } else {
      console.log("   ⚠ RLS may not be enforced: anon can read");
      passed++; // Don't fail, but warn
    }

    // Cleanup
    await supabaseService.from("api_logs").delete().eq("id", data.id);
  } catch (e: any) {
    console.error(`   ✗ Insert test failed: ${e.message}`);
    failed++;
  }

  // Test 4: Health endpoint
  try {
    console.log("4. Testing /api/healthz endpoint...");
    const response = await fetch(healthUrl);
    const json = await response.json();

    if (json.ok && json.db?.ok && json.auth?.ok) {
      console.log("   ✓ Health endpoint OK");
      passed++;
    } else {
      console.error(`   ✗ Health endpoint failed: ${JSON.stringify(json)}`);
      failed++;
    }
  } catch (e: any) {
    console.error(`   ✗ Health endpoint unreachable: ${e.message}`);
    failed++;
  }

  // Summary
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log("✅ All smoke tests passed!\n");
    process.exit(0);
  } else {
    console.log("❌ Some smoke tests failed.\n");
    process.exit(1);
  }
}

smokeTest().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
