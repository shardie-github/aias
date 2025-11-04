/**
 * Growth Engine
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
}

export async function trackUTM(userId: string, data: UTMData) {
  await prisma.user.update({
    where: { id: userId },
    data: {},
  });
}

export async function generateCohortReport(startDate: Date, endDate: Date) {
  const cohorts = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as cohort_month,
      COUNT(*) as users
    FROM users
    WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
    GROUP BY cohort_month
    ORDER BY cohort_month
  `;

  return cohorts;
}

export async function generateGrowthReport(): Promise<string> {
  const report = {
    date: new Date().toISOString(),
    cohorts: await generateCohortReport(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      new Date()
    ),
  };

  const reportPath = `ops/reports/growth-${new Date().toISOString().split('T')[0]}.json`;
  const fs = await import('fs');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
