// scripts/etl/pull_ads_meta.ts
import pg from "pg";
import fetch from "node-fetch";

const META_API_VERSION = "v18.0";
const META_TOKEN = process.env.META_ACCESS_TOKEN || process.env.META_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!META_TOKEN || !META_AD_ACCOUNT_ID || !DATABASE_URL) {
  console.error("Missing required env vars: META_TOKEN, META_AD_ACCOUNT_ID, DATABASE_URL");
  process.exit(1);
}

interface MetaAdData {
  date_start: string;
  date_stop: string;
  spend: string;
  clicks: string;
  impressions: string;
  actions: Array<{ action_type: string; value: string }>;
}

async function pullMetaAds() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    // Pull last 30 days of data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const url = `https://graph.facebook.com/${META_API_VERSION}/${META_AD_ACCOUNT_ID}/insights`;
    const params = new URLSearchParams({
      fields: "date_start,date_stop,spend,clicks,impressions,actions",
      time_range: JSON.stringify({
        since: startDate.toISOString().split("T")[0],
        until: endDate.toISOString().split("T")[0],
      }),
      level: "adset",
      access_token: META_TOKEN!,
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`Meta API error: ${response.statusText}`);
    }

    const data = await response.json() as { data: MetaAdData[] };

    // Insert into spend table
    for (const row of data.data) {
      const conv = row.actions?.find((a) => a.action_type === "purchase")?.value || "0";
      const spendCents = Math.round(parseFloat(row.spend) * 100);
      const clicks = parseInt(row.clicks) || 0;
      const impressions = parseInt(row.impressions) || 0;
      const convCount = parseInt(conv) || 0;

      await client.query(
        `INSERT INTO public.spend (platform, campaign_id, adset_id, date, spend_cents, clicks, impressions, conv)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (platform, date, COALESCE(campaign_id, ''), COALESCE(adset_id, ''))
         DO UPDATE SET spend_cents = EXCLUDED.spend_cents, clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions, conv = EXCLUDED.conv`,
        ["meta", null, null, row.date_start, spendCents, clicks, impressions, convCount]
      );
    }

    console.log(`✅ Pulled ${data.data.length} Meta ad records`);
  } catch (error) {
    console.error("Error pulling Meta ads:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  pullMetaAds().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { pullMetaAds };
