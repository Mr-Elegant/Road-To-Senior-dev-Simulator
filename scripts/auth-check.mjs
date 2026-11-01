import nextEnv from '@next/env';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';

nextEnv.loadEnvConfig(process.cwd());
const mode = process.argv[2] || 'build';
// Test-only secret stays in process memory. Configure a persistent secret for normal deployments.
const env = { ...process.env, BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || randomBytes(48).toString('base64url'), BETTER_AUTH_URL: mode === 'serve' ? 'http://localhost:3100' : process.env.BETTER_AUTH_URL || 'http://localhost:3000' };
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', ...(mode === 'serve' ? ['start', '-p', '3100'] : ['build'])], { stdio: 'inherit', env });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
