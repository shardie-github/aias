/**
 * Compliance Guard
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DSARRequest {
  userId: string;
  type: 'export' | 'delete';
  requestedAt: Date;
}

export async function processDSAR(request: DSARRequest): Promise<void> {
  if (request.type === 'export') {
    await exportUserData(request.userId);
  } else if (request.type === 'delete') {
    await deleteUserData(request.userId);
  }
}

async function exportUserData(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: true,
      apiKeys: true,
      aiRuns: true,
      reports: true,
      projects: true,
    },
  });

  const redacted = redactSensitiveData(user);
  const fs = await import('fs');
  const exportPath = `ops/exports/dsar-${userId}-${Date.now()}.json`;
  fs.writeFileSync(exportPath, JSON.stringify(redacted, null, 2));
}

async function deleteUserData(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}

function redactSensitiveData(data: any): any {
  const sensitiveFields = ['password', 'secret', 'token', 'key', 'apiKey'];
  const redacted = JSON.parse(JSON.stringify(data));

  function redact(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        redact(obj[key]);
      } else if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]';
      }
    }
  }

  redact(redacted);
  return redacted;
}

export function redactLog(log: string): string {
  const patterns = [
    /(password|pwd|passwd)=[^\s&]+/gi,
    /(token|secret|key|apikey)=[^\s&]+/gi,
    /(email)=[^\s&]+@[^\s&]+/gi,
  ];

  let redacted = log;
  for (const pattern of patterns) {
    redacted = redacted.replace(pattern, (match) => {
      const [key] = match.split('=');
      return `${key}=[REDACTED]`;
    });
  }

  return redacted;
}
