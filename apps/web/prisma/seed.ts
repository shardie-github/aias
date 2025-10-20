import { PrismaClient, Role, Plan, SubscriptionStatus, SourceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create organizations
  const org1 = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'ACME Corp',
      slug: 'acme-corp',
      description: 'A leading technology company',
      website: 'https://acme-corp.com',
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { slug: 'startup-inc' },
    update: {},
    create: {
      name: 'Startup Inc',
      slug: 'startup-inc',
      description: 'An innovative startup',
      website: 'https://startup-inc.com',
    },
  });

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@acme-corp.com' },
    update: {},
    create: {
      email: 'admin@acme-corp.com',
      name: 'Admin User',
      supabaseId: 'admin-supabase-id',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user@startup-inc.com' },
    update: {},
    create: {
      email: 'user@startup-inc.com',
      name: 'Regular User',
      supabaseId: 'user-supabase-id',
    },
  });

  // Create memberships
  await prisma.membership.upsert({
    where: { userId_orgId: { userId: user1.id, orgId: org1.id } },
    update: {},
    create: {
      userId: user1.id,
      orgId: org1.id,
      role: Role.ADMIN,
    },
  });

  await prisma.membership.upsert({
    where: { userId_orgId: { userId: user2.id, orgId: org2.id } },
    update: {},
    create: {
      userId: user2.id,
      orgId: org2.id,
      role: Role.EDITOR,
    },
  });

  // Create subscriptions
  await prisma.subscription.upsert({
    where: { stripeCustomerId: 'cus_acme_corp' },
    update: {},
    create: {
      orgId: org1.id,
      status: SubscriptionStatus.ACTIVE,
      plan: Plan.PRO,
      stripeCustomerId: 'cus_acme_corp',
      stripeSubscriptionId: 'sub_acme_corp',
      stripePriceId: 'price_pro_monthly',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.subscription.upsert({
    where: { stripeCustomerId: 'cus_startup_inc' },
    update: {},
    create: {
      orgId: org2.id,
      status: SubscriptionStatus.ACTIVE,
      plan: Plan.BASIC,
      stripeCustomerId: 'cus_startup_inc',
      stripeSubscriptionId: 'sub_startup_inc',
      stripePriceId: 'price_basic_monthly',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create projects
  await prisma.project.create({
    data: {
      name: 'E-commerce Optimization',
      description: 'AI-powered optimization for online store',
      userId: user1.id,
      orgId: org1.id,
      metadata: {
        industry: 'retail',
        budget: 50000,
        timeline: '3 months',
      },
    },
  });

  await prisma.project.create({
    data: {
      name: 'Marketing Automation',
      description: 'Automated marketing workflows',
      userId: user2.id,
      orgId: org2.id,
      metadata: {
        industry: 'saas',
        budget: 25000,
        timeline: '2 months',
      },
    },
  });

  // Create data sources
  await prisma.source.create({
    data: {
      name: 'Shopify Products',
      type: SourceType.SHOPIFY_JSON,
      orgId: org1.id,
      config: {
        url: 'https://acme-corp.myshopify.com/admin/api/2023-10/products.json',
        apiKey: 'encrypted-api-key',
      },
    },
  });

  await prisma.source.create({
    data: {
      name: 'Google Trends Data',
      type: SourceType.GOOGLE_TRENDS_CSV,
      orgId: org2.id,
      config: {
        keywords: ['AI', 'automation', 'e-commerce'],
        region: 'US',
        timeframe: '12m',
      },
    },
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'AI Chat Assistant',
        description: 'Intelligent customer support chatbot',
        price: 99.99,
        currency: 'USD',
        category: 'Software',
        tags: ['AI', 'chatbot', 'customer-support'],
        metadata: {
          features: ['Natural language processing', 'Multi-language support', 'Analytics dashboard'],
        },
      },
      {
        name: 'Marketing Automation Suite',
        description: 'Complete marketing automation platform',
        price: 299.99,
        currency: 'USD',
        category: 'Software',
        tags: ['marketing', 'automation', 'email'],
        metadata: {
          features: ['Email campaigns', 'Lead scoring', 'A/B testing'],
        },
      },
    ],
  });

  // Create sample trends
  await prisma.trend.createMany({
    data: [
      {
        keyword: 'AI consultancy',
        volume: 12000,
        category: 'Technology',
        region: 'US',
        period: '2024-01',
        metadata: {
          competition: 'medium',
          cpc: 2.50,
        },
      },
      {
        keyword: 'marketing automation',
        volume: 8500,
        category: 'Marketing',
        region: 'US',
        period: '2024-01',
        metadata: {
          competition: 'high',
          cpc: 3.20,
        },
      },
    ],
  });

  // Create feature flags
  await prisma.featureFlag.createMany({
    data: [
      {
        key: 'enable_ai_chat',
        name: 'AI Chat Feature',
        description: 'Enable AI chat assistant on the website',
        enabled: true,
        orgId: org1.id,
      },
      {
        key: 'enable_advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Enable advanced analytics dashboard',
        enabled: false,
        orgId: org1.id,
      },
      {
        key: 'enable_ai_chat',
        name: 'AI Chat Feature',
        description: 'Enable AI chat assistant on the website',
        enabled: true,
        orgId: org2.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });