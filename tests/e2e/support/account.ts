import type { Page } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loadEnvConfig } from '@next/env';
import { randomBytes, randomUUID } from 'node:crypto';

export async function signInTestAccount(page: Page): Promise<() => Promise<void>> {
  const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  const email = `auth-regression-${randomUUID()}@example.test`;
  const password = randomBytes(24).toString('base64url');
  const address = `2001:db8:${randomBytes(2).toString('hex')}:${randomBytes(2).toString('hex')}::1`;
  // Model a separate client for every disposable account, including browser
  // session reads. Use distinct /64s because Better Auth groups IPv6 clients by
  // subnet; missing headers also collapse into one shared rate-limit bucket.
  await page.context().setExtraHTTPHeaders({ 'x-real-ip': address });
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
