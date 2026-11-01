import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { prisma } from './prisma';

// https://better-auth.com/docs/adapters/prisma
// https://better-auth.com/docs/reference/security
export const auth = betterAuth({
  appName: 'Full Stack Interview Lab',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: 'postgresql', transaction: true }),
  emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128 },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, cookieCache: { enabled: false } },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    defaultCookieAttributes: { httpOnly: true, sameSite: 'lax', path: '/' },
    // Configure the reverse proxy to overwrite this header. See docs/authentication.md.
    ipAddress: { ipAddressHeaders: ['x-real-ip'] },
  },
  rateLimit: {
    enabled: true, storage: 'database', window: 60, max: 100,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 3 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email' && (typeof ctx.body?.name !== 'string' || ctx.body.name.trim().length < 2 || ctx.body.name.length > 100)) {
        throw new APIError('BAD_REQUEST', { message: 'Name must contain 2 to 100 characters.' });
      }
    }),
  },
  logger: { disabled: true },
  databaseHooks: {
    user: { create: { before: async (user) => ({ data: { ...user, name: user.name.trim(), email: user.email.trim().toLowerCase() } }) } },
  },
});
