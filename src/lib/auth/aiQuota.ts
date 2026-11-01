import { prisma } from '@/lib/prisma';
import { AccessError } from './server';

export async function consumeAiQuota(userId: string): Promise<void> {
  const allowed = await prisma.$transaction(async (db) => {
    await db.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    const key = `ai:${userId}`;
    const current = await db.rateLimit.findUnique({ where: { key } });
    const now = Date.now();
    const inWindow = current && now - Number(current.lastRequest) < 60000;
    if (inWindow && current.count >= 20) return false;
    await db.rateLimit.upsert({ where: { key }, create: { id: key, key, count: 1, lastRequest: BigInt(now) }, update: { count: inWindow ? current.count + 1 : 1, lastRequest: inWindow ? current.lastRequest : BigInt(now) } });
    return true;
  });
  if (!allowed) throw new AccessError(429, 'You have reached the interview request limit. Try again in a minute.');
}
