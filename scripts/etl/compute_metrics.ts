// scripts/etl/compute_metrics.ts
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.SUPABASE_SERVICE_ROLE_KEY;
const IS_CRON = process.argv.includes("--cron");

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

async function computeMetrics() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    // Compute metrics for yesterday (or today if running manually)
    const targetDate = IS_CRON
      ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    console.log(`Computing metrics for ${targetDate}...`);

    // Get sessions (from events table - approximate)
    const sessionsResult = await client.query(
      `SELECT COUNT(DISTINCT user_id) as sessions
       FROM public.events
       WHERE DATE(occurred_at) = $1
       AND event_name IN ('page_view', 'session_start')`,
      [targetDate]
    );
    const sessions = parseInt(sessionsResult.rows[0]?.sessions || "0");

    // Get add to carts
    const atcResult = await client.query(
      `SELECT COUNT(*) as count
       FROM public.events
       WHERE DATE(occurred_at) = $1
       AND event_name = 'add_to_cart'`,
      [targetDate]
    );
    const addToCarts = parseInt(atcResult.rows[0]?.count || "0");

    // Get orders
    const ordersResult = await client.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_cents), 0) as revenue_cents
       FROM public.orders
       WHERE DATE(placed_at) = $1`,
      [targetDate]
    );
    const orders = parseInt(ordersResult.rows[0]?.count || "0");
    const revenueCents = parseInt(ordersResult.rows[0]?.revenue_cents || "0");

    // Get refunds
    const refundsResult = await client.query(
      `SELECT COALESCE(SUM(total_cents), 0) as refunds_cents
       FROM public.orders
       WHERE DATE(placed_at) = $1
       AND EXISTS (SELECT 1 FROM public.events WHERE event_name = 'refund' AND props->>'order_id' = orders.id::text)`,
      [targetDate]
    );
    const refundsCents = parseInt(refundsResult.rows[0]?.refunds_cents || "0");

    // Calculate AOV
    const aovCents = orders > 0 ? Math.round(revenueCents / orders) : 0;

    // Get CAC from spend table
    const cacResult = await client.query(
      `SELECT COALESCE(SUM(spend_cents), 0) as spend_cents, COALESCE(SUM(conv), 0) as conv
       FROM public.spend
       WHERE date = $1`,
      [targetDate]
    );
    const spendCents = parseInt(cacResult.rows[0]?.spend_cents || "0");
    const conversions = parseInt(cacResult.rows[0]?.conv || "0");
    const cacCents = conversions > 0 ? Math.round(spendCents / conversions) : 0;

    // Calculate conversion rate
    const conversionRate = sessions > 0 ? orders / sessions : 0;

    // Estimate gross margin (assume 75% for now, should come from product costs)
    const grossMarginCents = Math.round(revenueCents * 0.75);

    // Estimate traffic (sessions is a proxy)
    const traffic = sessions;

    // Insert/update metrics_daily
    await client.query(
      `INSERT INTO public.metrics_daily (day, sessions, add_to_carts, orders, revenue_cents, refunds_cents, aov_cents, cac_cents, conversion_rate, gross_margin_cents, traffic)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (day) DO UPDATE SET
         sessions = EXCLUDED.sessions,
         add_to_carts = EXCLUDED.add_to_carts,
         orders = EXCLUDED.orders,
         revenue_cents = EXCLUDED.revenue_cents,
         refunds_cents = EXCLUDED.refunds_cents,
         aov_cents = EXCLUDED.aov_cents,
         cac_cents = EXCLUDED.cac_cents,
         conversion_rate = EXCLUDED.conversion_rate,
         gross_margin_cents = EXCLUDED.gross_margin_cents,
         traffic = EXCLUDED.traffic`,
      [
        targetDate,
        sessions,
        addToCarts,
        orders,
        revenueCents,
        refundsCents,
        aovCents,
        cacCents,
        conversionRate,
        grossMarginCents,
        traffic,
      ]
    );

    console.log(`✅ Computed metrics for ${targetDate}:`);
    console.log(`   Sessions: ${sessions}`);
    console.log(`   Orders: ${orders}`);
    console.log(`   Revenue: $${(revenueCents / 100).toFixed(2)}`);
    console.log(`   CAC: $${(cacCents / 100).toFixed(2)}`);
    console.log(`   Conversion Rate: ${(conversionRate * 100).toFixed(2)}%`);
  } catch (error) {
    console.error("Error computing metrics:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  computeMetrics().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { computeMetrics };
