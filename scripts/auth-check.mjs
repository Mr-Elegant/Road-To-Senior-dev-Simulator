import nextEnv from '@next/env';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';

if (process.argv[2] !== 'serve') await import('./build-react-runtime.mjs');

nextEnv.loadEnvConfig(process.cwd());
const mode = process.argv[2] || 'build';
const port = process.env.AUTH_CHECK_PORT || '3100';
const isServer = mode === 'serve' || mode === 'dev';
// Test-only secret stays in process memory. Configure a persistent secret for normal deployments.
const env = { ...process.env, BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || randomBytes(48).toString('base64url'), BETTER_AUTH_URL: isServer ? `http://localhost:${port}` : process.env.BETTER_AUTH_URL || 'http://localhost:3000' };
const command = mode === 'serve' ? ['start', '-p', port] : mode === 'dev' ? ['dev', '-p', port] : ['build'];
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', ...command, ...process.argv.slice(3)], { stdio: 'inherit', env });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
