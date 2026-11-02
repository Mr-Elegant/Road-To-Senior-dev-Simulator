import { Suspense } from 'react';
import { TicketDetails } from './TicketDetails';
import { StreamingAiAssistant } from './StreamingAiAssistant';
import { LocalErrorBoundary } from '@/components/LocalErrorBoundary';
import { AiSkeleton, AiErrorFallback } from '@/components/AiStates';

export default async function TicketPage({ params }) {
  return (
    <div className="flex gap-6">
      {/* Critical path: renders immediately */}
      <main className="flex-1">
        <TicketDetails ticketId={params.id} />
      </main>

      {/* Non-critical AI assistant: streamed progressively and failure-isolated */}
      <aside className="w-80">
        <LocalErrorBoundary fallback={<AiErrorFallback />}>
          <Suspense fallback={<AiSkeleton />}>
            <StreamingAiAssistant ticketId={params.id} />
          </Suspense>
        </LocalErrorBoundary>
      </aside>
    </div>
  );
}
