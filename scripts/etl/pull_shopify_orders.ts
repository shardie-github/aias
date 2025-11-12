// scripts/etl/pull_shopify_orders.ts
import pg from "pg";
import fetch from "node-fetch";

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_PASSWORD = process.env.SHOPIFY_PASSWORD;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SHOPIFY_API_KEY || !SHOPIFY_PASSWORD || !SHOPIFY_STORE || !DATABASE_URL) {
  console.error("Missing required env vars: SHOPIFY_API_KEY, SHOPIFY_PASSWORD, SHOPIFY_STORE, DATABASE_URL");
  process.exit(1);
}

const SHOPIFY_URL = `https://${SHOPIFY_API_KEY}:${SHOPIFY_PASSWORD}@${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01`;

interface ShopifyOrder {
  id: number;
  order_number: number;
  email: string;
  created_at: string;
  line_items: Array<{
    title: string;
    quantity: number;
    price: string;
  }>;
  subtotal_price: string;
  total_shipping_price_set: { shop_money: { amount: string } };
  total_tax: string;
  total_discounts: string;
  total_price: string;
  currency: string;
  source_name: string;
}

async function pullShopifyOrders() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    // Pull last 30 days of orders
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    let pageInfo: string | null = null;
    let hasNextPage = true;
    let totalOrders = 0;

    while (hasNextPage) {
      const url = `${SHOPIFY_URL}/orders.json?limit=250&created_at_min=${startDate.toISOString()}&created_at_max=${endDate.toISOString()}${pageInfo ? `&page_info=${pageInfo}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json() as { orders: ShopifyOrder[] };
      const linkHeader = response.headers.get("link");
      pageInfo = extractPageInfo(linkHeader);
      hasNextPage = !!pageInfo && linkHeader?.includes('rel="next"');

      // Insert into orders table
      for (const order of data.orders) {
        const items = order.line_items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          price: parseFloat(item.price),
        }));

        const subtotalCents = Math.round(parseFloat(order.subtotal_price) * 100);
        const shippingCents = Math.round(parseFloat(order.total_shipping_price_set.shop_money.amount) * 100);
        const taxCents = Math.round(parseFloat(order.total_tax) * 100);
        const discountCents = Math.round(parseFloat(order.total_discounts || "0") * 100);
        const totalCents = Math.round(parseFloat(order.total_price) * 100);

        await client.query(
          `INSERT INTO public.orders (order_number, user_id, items, subtotal_cents, shipping_cents, tax_cents, discount_cents, total_cents, currency, source, placed_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (order_number) DO UPDATE SET
             items = EXCLUDED.items,
             subtotal_cents = EXCLUDED.subtotal_cents,
             shipping_cents = EXCLUDED.shipping_cents,
             tax_cents = EXCLUDED.tax_cents,
             discount_cents = EXCLUDED.discount_cents,
             total_cents = EXCLUDED.total_cents,
             source = EXCLUDED.source`,
          [
            String(order.order_number),
            null, // user_id - would need to match by email
            JSON.stringify(items),
            subtotalCents,
            shippingCents,
            taxCents,
            discountCents,
            totalCents,
            order.currency,
            order.source_name,
            order.created_at,
          ]
        );
      }

      totalOrders += data.orders.length;
    }

    console.log(`✅ Pulled ${totalOrders} Shopify orders`);
  } catch (error) {
    console.error("Error pulling Shopify orders:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

function extractPageInfo(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  const match = linkHeader.match(/page_info=([^&>]+)/);
  return match ? match[1] : null;
}

if (require.main === module) {
  pullShopifyOrders().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { pullShopifyOrders };
