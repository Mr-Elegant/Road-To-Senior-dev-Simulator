import { prisma } from '../src/lib/prisma';

async function main() {
  const start = Date.now();
  console.log('Testing connection to Neon PostgreSQL...');
  const userCount = await prisma.user.count();
  const attemptCount = await prisma.scenarioAttempt.count();
  const latency = Date.now() - start;

  console.log('✅ Connected successfully!');
  console.log(`⏱️ Latency: ${latency}ms`);
  console.log(`👥 Users in DB: ${userCount}`);
  console.log(`📝 Scenario Attempts in DB: ${attemptCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Connection failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

