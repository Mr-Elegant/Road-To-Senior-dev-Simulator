import { progressRoute } from '@/lib/persistence/progressServer';

export async function GET(request: Request) { return progressRoute(request, 'tier1'); }
export async function POST(request: Request) { return progressRoute(request, 'tier1'); }
export async function DELETE(request: Request) { return progressRoute(request, 'reset-tier1'); }

