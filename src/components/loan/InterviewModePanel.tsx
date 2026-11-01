'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { selectInterviewModeOpen } from '@/lib/redux/selectors';
import { setInterviewModeOpen } from '@/lib/redux/slices/uiSlice';
import {
  MessageSquare,
  X,
  Send,
  HelpCircle,
  Award,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  expectedConcepts: string[];
  hint: string;
  referenceAnswer: string;
}

const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: 'How would you structure the Redux store for an enterprise loan management dashboard with thousands of records?',
    category: 'Redux Architecture (20%)',
    expectedConcepts: [
      'Normalized state slices (applications, dashboard, ui)',
      'Avoiding duplicating derived data; using createSelector',
      'Storing minimal essential state: items, totalCount, filters, sorting, pagination',
      'Typed hooks with RootState and AppDispatch',
    ],
    hint: 'Think about separating data fetching and record storage from UI transient state (modals, toasts) and precomputed dashboard aggregates.',
    referenceAnswer: `A senior architecture decouples state into three domain-driven slices:
1. applicationsSlice: Stores server entity state (items: LoanApplication[], totalCount: number, pagination: {page, limit}, filters: LoanFilters, sorting: SortConfig, optimisticBackups, updatingIds, and latestRequestId for concurrency guards).
2. dashboardSlice: Stores high-level aggregated KPI metrics and volume statistics with independent cache invalidation.
3. uiSlice: Manages client-only transient state (modals, drawer visibility, active filters drawer, toasts, and simulation flags).

Critical Principle: Never duplicate derived values (e.g. filtered items count, page statistics, status distribution) in state. Instead, compute them via memoized 'createSelector' selectors to guarantee single sources of truth.`,
  },
  {
    id: 2,
    question: 'Why use Redux Toolkit createAsyncThunk instead of making API calls directly inside component useEffect hooks?',
    category: 'API Integration (20%)',
    expectedConcepts: [
      'Separation of concerns (data fetching logic decoupled from presentation)',
      'Built-in pending/fulfilled/rejected lifecycle actions handled centrally',
      'Cancellation support via thunkAPI.signal',
      'Testability: thunks can be tested independently of React component render trees',
    ],
    hint: 'Consider what happens when multiple components need the same data, or when error handling and optimistic updates need to coordinate across different parts of the UI.',
    referenceAnswer: `Calling APIs directly inside components violates separation of concerns and leads to:
1. Component bloat and scattered loading/error states across every component.
2. Race conditions that are impossible to coordinate across multiple components.
3. Inability to execute optimistic updates that affect multiple slices (e.g. updating a loan status in the table while updating dashboard pending counts).

createAsyncThunk provides:
- Standardized pending, fulfilled, rejected action dispatching that reducers can react to centrally.
- Access to thunkAPI.signal for automated AbortController integration.
- Ability to read active state via thunkAPI.getState() to prevent stale closure bugs.
- Pure unit testability without mounting React component DOM nodes.`,
  },
  {
    id: 3,
    question: 'How do you prevent stale API responses from overwriting newer search results during rapid typing or network jitter?',
    category: 'Race Conditions (15%)',
    expectedConcepts: [
      'AbortController / thunkAPI.signal to cancel in-flight requests',
      'Monotonic request tokens or action.meta.requestId comparison',
      'Ignoring fulfilled actions whose requestId does not match state.latestRequestId',
      'Debouncing search inputs to reduce unnecessary in-flight requests',
    ],
    hint: 'What two layers of defense protect against asynchronous responses returning out of chronological order?',
    referenceAnswer: `A production-grade solution uses dual-layer defense:
1. Network cancellation layer: Pass 'signal' from createAsyncThunk directly to fetch/axios. When a new query is dispatched, the previous in-flight promise is aborted at the browser network stack.
2. State commit layer (Monotonic Guard): In Redux state, track 'latestRequestId: string | null'. When fetchApplications.pending fires, record 'state.latestRequestId = action.meta.requestId'. In extraReducers.fulfilled, only commit action.payload if 'action.meta.requestId === state.latestRequestId'. Any delayed responses that bypassed network cancellation are discarded before touching state.`,
  },
  {
    id: 4,
    question: 'How would you implement optimistic updates safely for loan approvals, ensuring failed requests roll back without stomping concurrent edits?',
    category: 'State Management (20%)',
    expectedConcepts: [
      'Immediate draft mutation on pending',
      'Preserving original item snapshot in an optimisticBackups map by ID',
      'Locking the specific row (updatingIds) to prevent duplicate submissions',
      'Restoring snapshot on rejected and showing clear error notification',
      'Cleaning up snapshot on fulfilled',
    ],
    hint: 'How do you know what the state was before the update was applied, and what stops the user from clicking Approve twice while the first request is pending?',
    referenceAnswer: `Safe optimistic updates require snapshotting and row locking:
1. Pending Handler: Capture original application in 'state.optimisticBackups[id] = { ...item }'. Mark 'state.updatingIds[id] = true' so the button is disabled and duplicate clicks are impossible. Apply the optimistic status change to 'item.status = newStatus'.
2. Fulfilled Handler: Delete 'state.optimisticBackups[id]', unlock 'state.updatingIds[id]', and reconcile with final server payload.
3. Rejected Handler: Look up 'state.optimisticBackups[id]', atomically restore it to 'state.items[index]', delete the backup, unlock the row, and dispatch an error toast alert explaining the rollback.`,
  },
  {
    id: 5,
    question: 'When would you choose RTK Query over createAsyncThunk for an enterprise dashboard like this?',
    category: 'Architecture Trade-offs (15%)',
    expectedConcepts: [
      'RTK Query provides automated caching, deduplication, and polling',
      'Normalized cache tags (providesTags / invalidatesTags)',
      'Auto-generated typed hooks (useGetApplicationsQuery, useUpdateStatusMutation)',
      'When to prefer createAsyncThunk: custom multi-step thunk orchestration, fine-grained optimistic rollback maps, manual offline queues',
    ],
    hint: 'What boilerplates does RTK Query eliminate (caching, deduplication, tag invalidation), and what custom thunk flexibility might you lose?',
    referenceAnswer: `Choose RTK Query when:
- You want declarative data fetching with automated caching, request deduplication, and cache lifecycle management.
- You have CRUD REST/GraphQL endpoints that benefit from tag-based cache invalidation (e.g. updating an application invalidates tag 'Applications').
- You want auto-generated React hooks ('useGetApplicationsQuery') with built-in polling, refetchOnFocus, and cache lifetimes.

Stick with createAsyncThunk when:
- Complex multi-slice orchestration is required (e.g., dispatching across 3 disparate slices upon one response).
- Custom client-side caching algorithms (like LRU or IndexedDB offline caching) are mandatory.
- Fine-grained sequential business workflows require step-by-step conditional branching based on getState().`,
  },
  {
    id: 6,
    question: 'How would you investigate and eliminate unnecessary React re-renders when typing into the search input on this dashboard?',
    category: 'Performance Optimization (10%)',
    expectedConcepts: [
      'Using React DevTools Profiler (Highlight updates when components render)',
      'Debouncing the search input to decouple input typing from Redux state dispatches',
      'Wrapping table rows in React.memo',
      'Passing stable action callbacks using useCallback',
      'Fine-grained useSelector subscriptions rather than selecting the entire slice',
    ],
    hint: 'If typing in an input in the header causes every table row to re-render, what are the two main reasons child rows re-render?',
    referenceAnswer: `Investigation & Elimination:
1. Open React DevTools Profiler, check 'Record why each component rendered while profiling'. Look for 'Parent component rendered' or 'Hook X changed'.
2. Decouple input typing: Maintain a local 'useState' in the search component. Only dispatch to Redux after 300ms of inactivity using a debounce timer.
3. Wrap 'LoanTableRow' in 'React.memo' with shallow prop comparison.
4. Pass stable callbacks wrapped in 'useCallback([dispatch])' to row components so callback reference changes don't bust React.memo.
5. In selectors, select primitive values or use 'createSelector' so subscribers only fire when their exact selected slice changes.`,
  },
  {
    id: 7,
    question: 'How do you reliably test asynchronous race conditions in unit tests without relying on flaky real-world timers?',
    category: 'Automated Testing (10%)',
    expectedConcepts: [
      'Deterministic mock resolvers using deferred promises',
      'Controlling promise resolution order manually (resolve query B before query A)',
      'Vitest vi.useFakeTimers() or explicit promise deferrals',
      'Verifying the Redux store state matches the chronologically latest dispatch rather than the slowest resolved promise',
    ],
    hint: 'Instead of using real setTimeout(1000), how can you hold promise A open, resolve promise B first, and then resolve promise A?',
    referenceAnswer: `To test race conditions deterministically:
1. Use Deferred Promises: Create two pending promises for requests A and B where you retain the 'resolve' functions:
   let resolveA, resolveB;
   mockService.getApplications
     .mockImplementationOnce(() => new Promise(r => resolveA = r))
     .mockImplementationOnce(() => new Promise(r => resolveB = r));
2. Dispatch action A ('search=Aarav'), then action B ('search=Sophia').
3. Resolve B FIRST with Sophia's results: 'resolveB({ items: [sophia] })'.
4. Await state assertion: state must equal Sophia.
5. Resolve A LATER with Aarav's results: 'resolveA({ items: [aarav] })'.
6. Verify final state: state STILL equals Sophia because the monotonic request ID guard discarded Aarav's stale payload!`,
  },
  {
    id: 8,
    question: 'If this NBFC dashboard scales to 100,000 active loan applications, what architectural changes are required on the frontend and Redux layer?',
    category: 'Scale & System Design (15%)',
    expectedConcepts: [
      'Server-driven pagination & cursor-based pagination (keyset)',
      'Windowing / DOM Virtualization (react-window or @tanstack/react-virtual)',
      'State normalization with Redux Toolkit createEntityAdapter',
      'Never loading 100,000 items in browser memory; keeping a small active window in Redux',
      'Server-side aggregation for stats rather than computing on client',
    ],
    hint: 'What breaks first in the browser when data volume grows from 100 to 100,000 items (DOM node limits, memory, network payload size)?',
    referenceAnswer: `At 100,000 records, client memory and DOM node counts will collapse the browser if loaded simultaneously.
Architectural adjustments:
1. Keyset / Cursor Pagination: Migrate from OFFSET pagination to keyset pagination ('WHERE id > last_seen_id LIMIT 50') for O(1) database query performance.
2. DOM Virtualization: Use '@tanstack/react-virtual' to render only the visible ~20 rows in the viewport, regardless of whether 1,000 rows are buffered in memory.
3. Normalized Redux Entity Cache: Use Redux Toolkit 'createEntityAdapter' to store applications by ID ('{ ids: string[], entities: Record<string, LoanApplication> }') for O(1) lookups and updates.
4. Server-Side Aggregations: Move all KPI stats computation to the backend database; never calculate 100k sums on the client thread.`,
  },
];

export function InterviewModePanel() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectInterviewModeOpen);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [evaluationScore, setEvaluationScore] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentQ = interviewQuestions[currentQuestionIndex];
  const isAnswered = Boolean(submittedAnswers[currentQ.id]);
  const isHintRevealed = Boolean(revealedHints[currentQ.id]);
  const isSolutionRevealed = Boolean(revealedSolutions[currentQ.id]);

  const handleSubmitAnswer = () => {
    if (!candidateAnswer.trim()) return;

    setSubmittedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: candidateAnswer,
    }));
  };

  const handleRevealHint = () => {
    setRevealedHints((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleRevealSolution = () => {
    setRevealedSolutions((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCandidateAnswer(submittedAnswers[interviewQuestions[currentQuestionIndex + 1]?.id] || '');
    } else {
      // Calculate final score
      const answeredCount = Object.keys(submittedAnswers).length;
      const score = Math.min(100, Math.round((answeredCount / interviewQuestions.length) * 100));
      setEvaluationScore(score);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setCandidateAnswer(submittedAnswers[interviewQuestions[currentQuestionIndex - 1]?.id] || '');
    }
  };

  return (
    <div className="bg-zinc-950/95 border border-purple-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Senior & Staff Interview Simulation
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">
                Question {currentQuestionIndex + 1} of {interviewQuestions.length}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Enterprise React & Redux Architecture Oral Defense
            </h3>
          </div>
        </div>

        <button
          onClick={() => dispatch(setInterviewModeOpen(false))}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Close Interview Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-6 space-y-5">
        {/* Question Header & Category */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {currentQ.category}
            </span>
            <span className="text-zinc-400">
              Completed: {Object.keys(submittedAnswers).length} / {interviewQuestions.length}
            </span>
          </div>

          <h2 className="text-base font-bold text-white leading-relaxed">{currentQ.question}</h2>

          {/* Key Competencies Expected */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Hiring Committee Competencies Evaluated:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentQ.expectedConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Answer Box */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Your Technical Explanation & Architectural Reasoning:
          </label>
          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            disabled={isAnswered}
            placeholder="Structure your response: analyze trade-offs, state exact Redux & React primitives, address edge cases, and justify your choices..."
            rows={5}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 p-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-80"
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
              {!isHintRevealed ? (
                <button
                  onClick={handleRevealHint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request Hint</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Hint: {currentQ.hint}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isAnswered ? (
                <button
                  disabled={!candidateAnswer.trim()}
                  onClick={handleSubmitAnswer}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 disabled:opacity-40 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Answer for Rubric Evaluation
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold mr-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Answer Submitted
                  </span>

                  {!isSolutionRevealed ? (
                    <button
                      onClick={handleRevealSolution}
                      className="px-3 py-1.5 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs font-semibold transition-colors"
                    >
                      Reveal Senior Reference Benchmark
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revealed Reference Solution */}
        {isSolutionRevealed && (
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200/90 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-purple-300 font-bold mb-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Staff Engineer Reference Benchmark</span>
            </div>
            <pre className="whitespace-pre-line font-sans leading-relaxed text-zinc-300">
              {currentQ.referenceAnswer}
            </pre>
          </div>
        )}

        {/* Question Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={handlePrevQuestion}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Question
          </button>

          <div className="flex items-center gap-1">
            {interviewQuestions.map((q, idx) => {
              const answered = Boolean(submittedAnswers[q.id]);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setCandidateAnswer(submittedAnswers[q.id] || '');
                  }}
                  className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-purple-600 text-white shadow-md'
                      : answered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            <span>{currentQuestionIndex === interviewQuestions.length - 1 ? 'Finish & Score' : 'Next Question'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Final Evaluation Scorecard if finished */}
        {evaluationScore !== null && (
          <div className="mt-6 p-6 rounded-2xl bg-zinc-900 border border-purple-500/40 text-center animate-in zoom-in-95">
            <Award className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">Interview Assessment Completed</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Evaluated across 7 weighted categories (Redux 20%, API 20%, React Design 15%, Concurrency 15%, Performance 10%, Testing 10%, Code Quality 10%).
            </p>
            <div className="text-3xl font-black text-purple-400 mt-3 font-mono">
              {evaluationScore}% • {evaluationScore >= 80 ? 'Strong Hire' : evaluationScore >= 65 ? 'Hire' : 'Needs Practice'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

