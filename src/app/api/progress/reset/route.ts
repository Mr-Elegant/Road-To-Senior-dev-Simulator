import { progressRoute } from '@/lib/persistence/progressServer';

export async function DELETE(request: Request) { return progressRoute(request, 'reset'); }

