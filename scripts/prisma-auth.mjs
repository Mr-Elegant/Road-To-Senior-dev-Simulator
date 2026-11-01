import nextEnv from '@next/env';
import { spawnSync } from 'node:child_process';

// Use the same .env.local precedence as Next.js; never print connection strings.
nextEnv.loadEnvConfig(process.cwd());
const result = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env });
process.exitCode = result.status ?? 1;
