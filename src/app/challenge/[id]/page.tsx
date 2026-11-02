'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getScenarioById } from '@/data';
import { storage } from '@/lib/persistence/localStorageAdapter';
import { AttemptSubmission, RubricScoreItem } from '@/types/userProgress';
import { ArchitectureNode, ArchitectureEdge } from '@/types/systemDesign';
import { runClientSideTestSuite, RunSuiteResult } from '@/lib/evaluation/safeCodeRunner';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { ProblemStatementPanel } from '@/components/workspace/ProblemStatementPanel';
import { CodeEditorPane } from '@/components/workspace/CodeEditorPane';
import { TestRunnerPane } from '@/components/workspace/TestRunnerPane';
import { IncidentTelemetryPane } from '@/components/workspace/IncidentTelemetryPane';
import { DiffViewerPane, CandidateReviewComment } from '@/components/workspace/DiffViewerPane';
import { SystemDesignCanvas } from '@/components/workspace/SystemDesignCanvas';
import { SeniorInterviewSession } from '@/components/workspace/SeniorInterviewSession';
import { RubricEvaluationModal } from '@/components/workspace/RubricEvaluationModal';
import { SolutionRevealDrawer } from '@/components/workspace/SolutionRevealDrawer';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { Scenario } from '@/types/scenario';
import { EvolvingIncidentWorkspace } from '@/components/workspace/EvolvingIncidentWorkspace';
import { useIncidentSession } from '@/components/workspace/useIncidentSession';
import { getIncidentView, incidentTranscript } from '@/lib/incidents/engine';

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const { id } = use(params);
  const scenario = getScenarioById(id);

  if (!scenario) {
    notFound();
  }
  return <ChallengeWorkspace key={id} scenario={scenario} />;
}

function ChallengeWorkspace({ scenario }: { scenario: Scenario }) {
  const incident = useIncidentSession(scenario);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Active time tracking
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    storage.getProgress().then((p) => {
      setIsBookmarked(p.bookmarkedScenarioIds.includes(scenario.id));
    });
  }, [scenario.id]);

  const handleToggleBookmark = async () => {
    const bookmarks = await storage.toggleBookmark(scenario.id);
    setIsBookmarked(bookmarks.includes(scenario.id));
  };

  // Progressive Hints
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isHintsDrawerOpen, setIsHintsDrawerOpen] = useState(false);
  const handleRevealNextHint = () => {
    if (hintsRevealed < scenario.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  // Code Editor state
  const [code, setCode] = useState(scenario.starterCode || '// Write your solution here\n');

  // Test Suite state
  const [testResult, setTestResult] = useState<RunSuiteResult | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRunTests = async () => {
    if (!scenario.testCases || scenario.testCases.length === 0) return;
    setIsRunningTests(true);
    try {
      const result = await runClientSideTestSuite(
        code,
        scenario.testCases,
        scenario.codeLanguage || 'javascript'
      );
      setTestResult(result);
    } catch (e: any) {
      console.error('Test execution error', e);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Incident Telemetry Form state
  const { rootCauseHypothesis, evidence, immediateMitigation, permanentCorrection, regressionTests, monitoringPlan } = incident.notes;
  const setRootCauseHypothesis = (value: string) => incident.setNote('rootCauseHypothesis', value);
  const setEvidence = (value: string) => incident.setNote('evidence', value);
  const setImmediateMitigation = (value: string) => incident.setNote('immediateMitigation', value);
  const setPermanentCorrection = (value: string) => incident.setNote('permanentCorrection', value);
  const setRegressionTests = (value: string) => incident.setNote('regressionTests', value);
  const setMonitoringPlan = (value: string) => incident.setNote('monitoringPlan', value);

  // Code Review Comments state
  const [reviewComments, setReviewComments] = useState<CandidateReviewComment[]>([]);
  const handleAddReviewComment = (c: CandidateReviewComment) => {
    setReviewComments((prev) => [...prev, c]);
  };
  const handleDeleteReviewComment = (commentId: string) => {
    setReviewComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // System Design Architecture state
  const [designNodes, setDesignNodes] = useState<ArchitectureNode[]>([]);
  const [designEdges, setDesignEdges] = useState<ArchitectureEdge[]>([]);
  const [apiContracts, setApiContracts] = useState('');
  const [dataSchema, setDataSchema] = useState('');
  const [scalingAnalysis, setScalingAnalysis] = useState('');
  const [failureScenarios, setFailureScenarios] = useState('');

  // Senior Interview dialogue answers state
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, string>>({});
  const handleInterviewAnswerChange = (qId: string, val: string) => {
    setInterviewAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  // Modals state
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isSolutionDrawerOpen, setIsSolutionDrawerOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Submit and save attempt
  const handleSubmitAndEvaluate = () => {
    if (scenario.incidentSimulation && !getIncidentView(scenario.incidentSimulation, incident.run, scenario.incidentTelemetry!).completed) {
      setSubmissionMessage('Complete all three developments before submitting. Use the simulation clock or advance to the next event.');
      return;
    }
    setSubmissionMessage('');
    // Open rubric modal for self-assessment
    setIsRubricModalOpen(true);
  };

  const handleSaveRubricAttempt = async (
    rubricScores: RubricScoreItem[],
    totalScorePercentage: number
  ) => {
    const attempt: AttemptSubmission = {
      id: `att-${Date.now()}`,
      scenarioId: scenario.id,
      timestamp: new Date().toISOString(),
      timeSpentSeconds,
      hintsUsedCount: hintsRevealed,
      submittedCode: code,
      rootCauseAnalysis: rootCauseHypothesis,
      immediateMitigation,
      permanentFix: permanentCorrection,
      testingStrategy: regressionTests,
      monitoringPlan,
      reviewComments: reviewComments.map((c) => ({
        line: c.line,
        comment: c.comment,
        category: c.category,
      })),
      systemDesignNotes: {
        apiEndpoints: apiContracts,
        dataSchema,
        scalingStrategy: scalingAnalysis,
        failureScenarios,
      },
      interviewAnswers: scenario.incidentSimulation ? { ...incidentTranscript(scenario.incidentSimulation, incident.run), 'incident.evidence': evidence } : scenario.type === 'incident' ? { 'incident.evidence': evidence } : interviewAnswers,
      rubricScores,
      totalScorePercentage,
      passedTestsCount: testResult?.passedTests || 0,
      totalTestsCount: testResult?.totalTests || (scenario.testCases?.length ?? 0),
      selfAssessmentCompleted: true,
    };

    await storage.saveAttempt(attempt);
    setHasSubmitted(true);
    // After submitting, open the reference solution drawer so candidate can inspect the model answer
    setIsSolutionDrawerOpen(true);
  };

  const handleReset = () => {
    if (confirm('Reset workspace code and inputs back to starter defaults?')) {
      setCode(scenario.starterCode || '');
      setTestResult(null);
      setReviewComments([]);
      setDesignNodes([]);
      setDesignEdges([]);
      setApiContracts('');
      setDataSchema('');
      setScalingAnalysis('');
      setFailureScenarios('');
      setInterviewAnswers({});
      incident.reset();
      setSubmissionMessage('');
      setHasSubmitted(false);
    }
  };

  return (
    <div className={scenario.incidentSimulation ? 'min-h-[calc(100vh-64px)] xl:h-[calc(100vh-64px)] flex flex-col xl:overflow-hidden bg-zinc-950' : 'h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-zinc-950'}>
      {/* Workspace Top Header Bar */}
      <WorkspaceHeader
        scenario={scenario}
        timeSpentSeconds={timeSpentSeconds}
        hintsUsedCount={hintsRevealed}
        totalHintsCount={scenario.hints.length}
        onOpenHints={() => setIsHintsDrawerOpen(true)}
        isBookmarked={isBookmarked}
        onToggleBookmark={handleToggleBookmark}
        onSubmit={handleSubmitAndEvaluate}
        onRevealSolution={() => setIsSolutionDrawerOpen(true)}
        onReset={handleReset}
        hasReferenceSolution={Boolean(scenario.referenceSolution)}
      />

      {submissionMessage && <p role="alert" className="bg-amber-500/10 text-amber-200 px-4 py-2 text-xs">{submissionMessage}</p>}

      {/* Main Workspace Body Split */}
      <div className={scenario.incidentSimulation ? 'flex flex-col xl:flex-row xl:flex-1 xl:min-h-0 xl:overflow-hidden' : 'flex-1 flex flex-col md:flex-row overflow-hidden'}>
        {/* Left Pane: Context, Problem Statement, Constraints & Tasks */}
        <div className={scenario.incidentSimulation ? 'w-full xl:w-4/12 max-h-72 xl:max-h-none xl:h-full overflow-hidden flex-shrink-0' : 'w-full md:w-5/12 lg:w-4/12 h-full overflow-hidden flex-shrink-0'}>
          <ProblemStatementPanel
            scenario={scenario}
            hintsRevealed={hintsRevealed}
            onRevealNextHint={handleRevealNextHint}
            isHintsDrawerOpen={isHintsDrawerOpen}
            onToggleHintsDrawer={() => setIsHintsDrawerOpen(!isHintsDrawerOpen)}
          />
        </div>

        {/* Right Pane: Dynamic Challenge Experience by Challenge Type */}
        <div className={scenario.incidentSimulation ? 'min-w-0 xl:flex-1 xl:min-h-0 xl:h-full xl:overflow-hidden' : 'flex-1 h-full overflow-hidden'}>
          {/* Coding & Debugging View */}
          {(scenario.type === 'coding' || scenario.type === 'debugging') && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <CodeEditorPane
                  code={code}
                  onChange={setCode}
                  language={scenario.codeLanguage || 'javascript'}
                  onRunTests={handleRunTests}
                  isRunningTests={isRunningTests}
                  hasTestCases={Boolean(scenario.testCases && scenario.testCases.length > 0)}
                />
              </div>

              {scenario.testCases && scenario.testCases.length > 0 && (
                <div className="h-64 flex-shrink-0">
                  <TestRunnerPane
                    testSuiteResult={testResult}
                    isRunning={isRunningTests}
                    onRunAgain={handleRunTests}
                    language={scenario.codeLanguage || 'javascript'}
                  />
                </div>
              )}
            </div>
          )}

          {/* Production Incident View */}
          {scenario.type === 'incident' && scenario.incidentTelemetry && !scenario.incidentSimulation && (
            <IncidentTelemetryPane
              telemetry={scenario.incidentTelemetry}
              rootCauseHypothesis={rootCauseHypothesis}
              onRootCauseChange={setRootCauseHypothesis}
              evidence={evidence}
              onEvidenceChange={setEvidence}
              immediateMitigation={immediateMitigation}
              onImmediateMitigationChange={setImmediateMitigation}
              permanentCorrection={permanentCorrection}
              onPermanentCorrectionChange={setPermanentCorrection}
              regressionTests={regressionTests}
              onRegressionTestsChange={setRegressionTests}
              monitoringPlan={monitoringPlan}
              onMonitoringPlanChange={setMonitoringPlan}
            />
          )}

          {scenario.incidentSimulation && <EvolvingIncidentWorkspace key={incident.resetVersion} scenario={scenario} session={incident} report={{
            rootCauseHypothesis, onRootCauseChange: setRootCauseHypothesis,
            evidence, onEvidenceChange: setEvidence,
            immediateMitigation, onImmediateMitigationChange: setImmediateMitigation,
            permanentCorrection, onPermanentCorrectionChange: setPermanentCorrection,
            regressionTests, onRegressionTestsChange: setRegressionTests,
            monitoringPlan, onMonitoringPlanChange: setMonitoringPlan,
          }} />}

          {/* Code Review PR View */}
          {scenario.type === 'code_review' && scenario.codeReviewFiles && (
            <DiffViewerPane
              files={scenario.codeReviewFiles}
              comments={reviewComments}
              onAddComment={handleAddReviewComment}
              onDeleteComment={handleDeleteReviewComment}
            />
          )}

          {/* System Design Canvas View */}
          {scenario.type === 'system_design' && (
            <SystemDesignCanvas
              nodes={designNodes}
              edges={designEdges}
              onUpdateNodes={setDesignNodes}
              onUpdateEdges={setDesignEdges}
              apiContracts={apiContracts}
              onApiContractsChange={setApiContracts}
              dataSchema={dataSchema}
              onDataSchemaChange={setDataSchema}
              scalingAnalysis={scalingAnalysis}
              onScalingAnalysisChange={setScalingAnalysis}
              failureScenarios={failureScenarios}
              onFailureScenariosChange={setFailureScenarios}
            />
          )}

          {/* Senior Interview View */}
          {scenario.type === 'senior_interview' && (
            <SeniorInterviewSession
              questions={scenario.followUpQuestions}
              answers={interviewAnswers}
              onAnswerChange={handleInterviewAnswerChange}
              isCompleted={hasSubmitted}
            />
          )}
        </div>
      </div>

      {/* Rubric Evaluation Modal */}
      <RubricEvaluationModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        rubric={scenario.rubric}
        onSubmitScores={handleSaveRubricAttempt}
      />

      {/* Solution Reveal Drawer (hides solution until submitted or explicitly requested) */}
      <SolutionRevealDrawer
        isOpen={isSolutionDrawerOpen}
        onClose={() => setIsSolutionDrawerOpen(false)}
        scenario={scenario}
      />
    </div>
  );
}

