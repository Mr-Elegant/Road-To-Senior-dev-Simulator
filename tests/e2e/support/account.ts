import type { Page } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loadEnvConfig } from '@next/env';
import { randomBytes, randomUUID } from 'node:crypto';

export async function signInTestAccount(page: Page): Promise<() => Promise<void>> {
  const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  const email = `auth-regression-${randomUUID()}@example.test`;
  const password = randomBytes(24).toString('base64url');
  const address = `192.0.2.${randomBytes(1)[0] || 1}`;
  const response = await page.request.post(`${origin}/api/auth/sign-up/email`, { headers: { Origin: origin, 'x-real-ip': address }, data: { name: 'Regression Candidate', email, password, confirmPassword: password } });
  if (!response.ok()) throw new Error(`Could not create disposable regression account (${response.status()}).`);
  const userId = (await response.json()).user.id as string;
  return async () => {
    loadEnvConfig(process.cwd());
    const db = new PrismaClient({ log: [] });
    try {
      await db.user.deleteMany({ where: { id: userId, email } });
      await db.rateLimit.deleteMany({ where: { key: `ai:${userId}` } });
    } finally { await db.$disconnect(); }
  };
}
