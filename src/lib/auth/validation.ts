import { z } from 'zod';

export const emailSchema = z.email().max(254).transform((value) => value.trim().toLowerCase());
export const passwordSchema = z.string().min(12, 'Use at least 12 characters.').max(128, 'Use at most 128 characters.');
export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(100),
  email: z.string().trim().pipe(emailSchema),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });

const interviewConfigSchema = z.strictObject({
  role: z.string().trim().min(1).max(200), technology: z.string().trim().min(1).max(300),
  difficulty: z.enum(['Beginner', 'Mid-Level', 'Senior', 'Staff/Principal']),
  durationMinutes: z.number().int().min(5).max(120),
});
export const aiRequestSchema = z.strictObject({
  action: z.enum(['start', 'reply', 'hint', 'evaluate'], { error: "Invalid 'action'. Must be one of: 'start', 'reply', 'hint', 'evaluate'." }),
  config: interviewConfigSchema.optional(),
  candidateAnswer: z.string().max(10000, 'Candidate answer exceeds maximum allowed length of 10,000 characters.').optional(),
  sessionState: z.strictObject({
    config: interviewConfigSchema.optional(), currentQuestion: z.string().min(1).max(24000),
    history: z.array(z.strictObject({ role: z.enum(['interviewer', 'candidate', 'hint']), content: z.string().max(20000) })).max(40).optional(),
    currentTurn: z.number().int().min(1).max(5).optional(), maxTurns: z.number().int().min(1).max(5).optional(),
  }).optional(),
});

export function safeDestination(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || /[\\\u0000-\u0020%]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://local.invalid');
    if (url.origin !== 'https://local.invalid' || /^\/(login|signup|api)(\/|$)/.test(url.pathname)) return '/';
    return url.pathname + url.search + url.hash;
  } catch {
    return '/';
  }
}
