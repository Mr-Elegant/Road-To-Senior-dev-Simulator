import { progressRoute } from '@/lib/persistence/progressServer';

export async function POST(request: Request) { return progressRoute(request, 'notes'); }

