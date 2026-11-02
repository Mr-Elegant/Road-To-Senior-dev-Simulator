'use client';

import { useEffect, useRef, useState } from 'react';
import type { LoanLabExercise, LoanLabRun } from '@/types/loanLab';
import { freshLoanLabDraft, parseLoanLabDraft } from '@/lib/loanLab/draft';
import { runLoanLab } from '@/lib/loanLab/runner';
import { storage } from '@/lib/persistence/localStorageAdapter';

export function useLoanBugLab(exercise: LoanLabExercise, onRecorded: () => void) {
  const [draft, setDraft] = useState(() => freshLoanLabDraft(exercise));
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<LoanLabRun | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const activeRun = useRef<AbortController | null>(null);
  const key = storage.scopedKey(`fullstack_loan_lab_v1:${exercise.bugId}`);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      const restored = parseLoanLabDraft(raw, exercise);
      if (restored) setDraft(restored);
      else if (raw) setWarning('The saved draft could not be restored. Starter code is ready.');
    } catch { setWarning('Draft storage is unavailable. Keep this tab open while working.'); }
    setReady(true);
    return () => { activeRun.current?.abort(); };
  }, [exercise, key]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(key, JSON.stringify(draft)); }
    catch { setWarning('Your draft could not be saved on this device.'); }
  }, [draft, key, ready]);

  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') setDraft((value) => ({ ...value, elapsedSeconds: Math.min(604800, value.elapsedSeconds + 1) }));
    }, 1000);
    return () => clearInterval(timer);
  }, [ready]);

  const changeCode = (code: string) => {
    if (code.length > 100000) { setWarning('Keep the solution under 100,000 characters.'); return; }
    activeRun.current?.abort();
    setResult(null); setMessage(''); setDraft((value) => ({ ...value, code }));
  };
  const execute = async (mode: 'sample' | 'submit') => {
    if (activeRun.current || !ready) return;
    const controller = new AbortController();
    activeRun.current = controller;
    const accountId = storage.getAccountId();
    const snapshot = draft;
    setBusy(true); setMessage(''); setResult(null);
    try {
      const output = await runLoanLab(exercise, snapshot.code, mode, controller.signal);
      if (controller.signal.aborted || storage.getAccountId() !== accountId) return;
      setResult(output);
      if (mode === 'submit') {
        await storage.saveAttempt({
          id: `loan-lab-${crypto.randomUUID()}`, scenarioId: `loan-lab:${exercise.bugId}`,
          timestamp: new Date().toISOString(), timeSpentSeconds: snapshot.elapsedSeconds,
          hintsUsedCount: snapshot.hintsRevealed, submittedCode: snapshot.code,
          totalScorePercentage: Math.round(output.passed / output.total * 100),
          passedTestsCount: output.passed, totalTestsCount: output.total,
          failedTestCases: output.results.filter((item) => !item.passed).map((item) => item.name),
          interviewAnswers: { 'loanLab.version': '1', 'loanLab.assisted': String(snapshot.referenceRevealed), 'loanLab.mode': 'full-suite' },
          rubricScores: [], selfAssessmentCompleted: false,
        });
        if (!controller.signal.aborted) { setMessage('Full test submission recorded in your progress.'); onRecorded(); }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') setMessage('Test run stopped. No attempt was recorded.');
      else setWarning(error instanceof Error ? error.message : 'Tests could not run. Retry the exercise.');
    } finally {
      if (activeRun.current === controller) { activeRun.current = null; setBusy(false); }
    }
  };

  return {
    draft, ready, result, busy, message, warning, changeCode, execute,
    stop: () => activeRun.current?.abort(),
    revealHint: () => setDraft((value) => ({ ...value, hintsRevealed: Math.min(exercise.hints.length, value.hintsRevealed + 1) })),
    revealReference: () => setDraft((value) => ({ ...value, referenceRevealed: true })),
    loadReference: () => { changeCode(exercise.referenceCode); setDraft((value) => ({ ...value, referenceRevealed: true })); },
    reset: () => {
      activeRun.current?.abort(); setResult(null); setMessage('Starter restored. Previous best submissions remain in history.');
      setDraft((value) => ({ ...freshLoanLabDraft(exercise), hintsRevealed: value.hintsRevealed, referenceRevealed: value.referenceRevealed }));
    },
  };
}
