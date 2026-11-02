import { describe, expect, it, vi } from 'vitest';

const { handlePost } = vi.hoisted(() => ({ handlePost: vi.fn() }));
vi.mock('@/lib/auth', () => ({ auth: {} }));
vi.mock('better-auth/next-js', () => ({ toNextJsHandler: () => ({ GET: vi.fn(), POST: handlePost }) }));
import { POST } from '@/app/api/auth/[...all]/route';

describe('authentication request transport', () => {
  it('forwards a fresh readable request with origin/cookies intact after bounded validation', async () => {
    handlePost.mockImplementationOnce(async (request: Request) => {
      expect(request.headers.get('origin')).toBe('http://localhost:3000');
      expect(request.headers.get('cookie')).toBe('test-cookie=example');
      expect(request.headers.has('content-length')).toBe(false);
      expect(await request.clone().json()).toEqual({ email: 'candidate@example.test', password: 'example-passphrase' });
      expect(await request.json()).toEqual({ email: 'candidate@example.test', password: 'example-passphrase' });
      return Response.json({ success: true });
    });
    const request = new Request('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', Cookie: 'test-cookie=example', 'Content-Length': '999' },
      body: JSON.stringify({ email: 'candidate@example.test', password: 'example-passphrase' }),
    });
    expect((await POST(request)).status).toBe(200);
  });

  it('preserves bodyless session-control requests', async () => {
    handlePost.mockImplementationOnce(async (request: Request) => {
      expect(request.body).toBeNull();
      expect(request.method).toBe('POST');
      return Response.json({ success: true });
    });
    expect((await POST(new Request('http://localhost:3000/api/auth/sign-out', { method: 'POST' }))).status).toBe(200);
  });
});
