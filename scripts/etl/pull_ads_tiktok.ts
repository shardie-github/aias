// scripts/etl/pull_ads_tiktok.ts
import pg from "pg";
import fetch from "node-fetch";

const TIKTOK_API_VERSION = "v1.3";
const TIKTOK_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || process.env.TIKTOK_TOKEN;
const TIKTOK_ADVERTISER_ID = process.env.TIKTOK_ADVERTISER_ID;
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!TIKTOK_TOKEN || !TIKTOK_ADVERTISER_ID || !DATABASE_URL) {
  console.error("Missing required env vars: TIKTOK_TOKEN, TIKTOK_ADVERTISER_ID, DATABASE_URL");
  process.exit(1);
}

interface TikTokAdData {
  stat_time_day: string;
  spend: string;
  click: string;
  impression: string;
  conversion: string;
  campaign_id: string;
  adgroup_id: string;
}

async function pullTikTokAds() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    // Pull last 30 days of data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const url = `https://business-api.tiktok.com/open_api/${TIKTOK_API_VERSION}/report/integrated/get/`;
    const body = {
      advertiser_id: TIKTOK_ADVERTISER_ID,
      service_type: "AUCTION",
      report_type: "BASIC",
      data_level: "AUCTION_ADGROUP",
      dimensions: ["stat_time_day", "campaign_id", "adgroup_id"],
      metrics: ["spend", "click", "impression", "conversion"],
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      page_size: 1000,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": TIKTOK_TOKEN!,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`TikTok API error: ${response.statusText}`);
    }

    const data = await response.json() as { data: { list: TikTokAdData[] } };

    // Insert into spend table
    for (const row of data.data.list) {
      const spendCents = Math.round(parseFloat(row.spend) * 100);
      const clicks = parseInt(row.click) || 0;
      const impressions = parseInt(row.impression) || 0;
      const convCount = parseInt(row.conversion) || 0;

      await client.query(
        `INSERT INTO public.spend (platform, campaign_id, adset_id, date, spend_cents, clicks, impressions, conv)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (platform, date, COALESCE(campaign_id, ''), COALESCE(adset_id, ''))
         DO UPDATE SET spend_cents = EXCLUDED.spend_cents, clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions, conv = EXCLUDED.conv`,
        ["tiktok", row.campaign_id, row.adgroup_id, row.stat_time_day, spendCents, clicks, impressions, convCount]
      );
    }

    console.log(`✅ Pulled ${data.data.list.length} TikTok ad records`);
  } catch (error) {
    console.error("Error pulling TikTok ads:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  pullTikTokAds().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { pullTikTokAds };
