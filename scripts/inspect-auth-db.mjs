import nextEnv from '@next/env';
import { PrismaClient } from '@prisma/client';

nextEnv.loadEnvConfig(process.cwd());
const db = new PrismaClient({ log: [] });
try {
  const tables = await db.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = CURRENT_SCHEMA()`;
  const columns = await db.$queryRaw`SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = CURRENT_SCHEMA() ORDER BY table_name, ordinal_position`;
  console.log(JSON.stringify({ connected: true, tables, columns, users: await db.user.count(), attempts: await db.scenarioAttempt.count() }, null, 2));
} catch (error) {
  console.error('Database inspection failed:', error.code || 'connection_failed');
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
