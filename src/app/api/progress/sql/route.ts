import { progressRoute } from '@/lib/persistence/progressServer';

export async function GET(request: Request) { return progressRoute(request, 'sql'); }
export async function POST(request: Request) { return progressRoute(request, 'sql'); }
export async function DELETE(request: Request) { return progressRoute(request, 'reset-sql'); }

