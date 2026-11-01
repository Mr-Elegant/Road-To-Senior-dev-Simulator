import { progressRoute } from '@/lib/persistence/progressServer';

export async function GET(request: Request) { return progressRoute(request, 'status'); }

