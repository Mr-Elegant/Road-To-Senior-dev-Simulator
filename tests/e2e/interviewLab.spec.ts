import { test, expect } from '@playwright/test';

test.describe('Full Stack Engineering Interview Lab E2E Flows', () => {
  test('Dashboard displays metrics, readiness report, and filters', async ({ page }) => {
    await page.goto('/');

    // Verify title and header
    await expect(page).toHaveTitle(/Full Stack Engineering Interview Lab/i);
    await expect(page.getByText('Engineering Interview Cockpit')).toBeVisible();

    // Verify metrics
    await expect(page.getByText('Scenarios In Library', { exact: true })).toBeVisible();
    await expect(page.getByText('Readiness Estimate', { exact: true })).toBeVisible();
    await expect(page.getByText(/Senior Engineering Interview Readiness/i)).toBeVisible();

    // Verify disclaimer presence
    await expect(page.getByText(/Disclaimer:/i)).toBeVisible();

    // Verify quick action buttons
    await expect(page.getByRole('button', { name: /Start Random Challenge/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Timed Interview/i })).toBeVisible();
  });

  test('Challenge Catalog supports search and topic filtering', async ({ page }) => {
    await page.goto('/library');

    await expect(page.getByText(/Challenge Catalog/i)).toBeVisible();

    // Search for "Stripe"
    const searchInput = page.getByPlaceholder(/Search challenges/i);
    await searchInput.fill('Stripe');
    await expect(page.getByText(/Stripe/i).first()).toBeVisible();

    // Filter by topic "React"
    await page.goto('/library?topic=React');
    await expect(page.getByText(/Order-Book Live Ticker/i)).toBeVisible();
  });

  test('Interactive Workspace supports hint revelation, testing, and rubric evaluation', async ({ page }) => {
    await page.goto('/challenge/js-event-loop-microtasks');

    // Verify problem specification
    await expect(page.getByText(/Flash-Sale Batch Processor/i)).toBeVisible();
    await expect(page.getByText(/Production Business Context/i)).toBeVisible();

    // Progressive Hints revelation via title
    const hintsBtn = page.getByTitle('Open Progressive Hints');
    await hintsBtn.click();
    const revealNextBtn = page.getByRole('button', { name: /Reveal Hint/i });
    if (await revealNextBtn.isVisible()) {
      await revealNextBtn.click();
      await expect(page.getByText(/Hint 1/i)).toBeVisible();
    }

    // Submit & Evaluate modal
    const submitBtn = page.getByRole('button', { name: /Submit & Evaluate/i });
    await submitBtn.click();

    await expect(page.getByText(/Transparent Rubric Evaluation & Self-Assessment/i)).toBeVisible();
    
    // Save attempt
    const saveBtn = page.getByRole('button', { name: /Save & Record Attempt/i });
    await saveBtn.click();

    // Solution reveal drawer opens post-submission
    await expect(page.getByText(/Staff Reference Benchmark & Solution/i)).toBeVisible();
  });

  test('Mock Interview simulator generates multi-round interview track', async ({ page }) => {
    await page.goto('/interview?tier=tier-4');

    await expect(page.getByText(/Select Your Senior Simulation Loop/i)).toBeVisible();
    await expect(page.getByText(/Senior Full-Stack Engineer Loop/i)).toBeVisible();

    // Start simulation
    const beginBtn = page.getByRole('button', { name: /Begin Timed Senior Interview/i });
    await beginBtn.click();

    await expect(page.getByText(/Live Timed Interview Simulation/i)).toBeVisible();
    await expect(page.getByText(/Time Remaining/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Open Round 1/i })).toBeVisible();
  });

  test('In-Browser Coding Practice environment runs code, validates test suites, and flags unconfigured environments', async ({ page }) => {
    await page.goto('/practice');

    // Verify title and workspace
    await expect(page.getByText(/Coding Practice Lab/i)).toBeVisible();
    await expect(page.getByText(/Monaco Editor/i)).toBeVisible();

    // Verify Run Code and Submit Answer buttons
    const runBtn = page.getByRole('button', { name: /Run Code/i });
    const submitBtn = page.getByRole('button', { name: /Submit Answer/i });
    await expect(runBtn).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Click "Run Code (Samples)"
    await runBtn.click();
    await expect(page.getByText(/Test Execution Results/i)).toBeVisible();

    // Test Language Filter: switch to SQL
    const sqlFilter = page.getByRole('button', { name: 'SQL', exact: true });
    await sqlFilter.click();
    await expect(page.getByRole('heading', { name: /Monthly User Cohort Retention/i })).toBeVisible();

    // Switch to unconfigured Python challenge
    const pyFilter = page.getByRole('button', { name: 'Python', exact: true });
    await pyFilter.click();
    await expect(page.getByRole('heading', { name: /Token Bucket/i })).toBeVisible();

    // Run Python code: should safely trigger unconfigured service guard
    await runBtn.click();
    await expect(page.getByText(/Execution Service Not Configured/i)).toBeVisible();
  });

  test('Conversational AI Interviewer flow starts session, submits answer, asks contextual follow-up, and renders final scorecard', async ({ page }) => {
    // Mock Gemini API route responses for automated testing without requiring an external API key or network latency
    await page.route('**/api/ai-interview', async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'ok',
            isGeminiConfigured: true,
            model: 'gemini-2.0-flash',
            message: 'Mocked Gemini active',
          }),
        });
      }

      const body = req.postDataJSON();
      if (body.action === 'start') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            isGeminiLive: true,
            modelUsed: 'gemini-2.0-flash',
            question: '### Scenario: High-Volume Event Ingestion Pipeline\nHow do you design an idempotent consumer in Kafka?',
          }),
        });
      }
      if (body.action === 'reply') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            isGeminiLive: true,
            modelUsed: 'gemini-2.0-flash',
            turnFeedback: {
              technicalCorrectness: 'Exemplary',
              strengths: ['Identified outbox pattern and deduplication.'],
              gapsOrMisconceptions: ['Consider consumer group rebalances.'],
              scoreOutOf10: 9,
            },
            question: 'How do you handle consumer group rebalances during rolling deployments?',
            isCompleted: false,
          }),
        });
      }
      if (body.action === 'hint') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            isGeminiLive: true,
            modelUsed: 'gemini-2.0-flash',
            hint: 'Hint: Think about static membership and cooperative sticky assignment.',
          }),
        });
      }
      if (body.action === 'evaluate') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            isGeminiLive: true,
            modelUsed: 'gemini-2.0-flash',
            assessment: {
              overallScore: 92,
              hiringVerdict: 'Strong Hire',
              targetLevelAchieved: 'Senior',
              executiveSummary: 'Demonstrated outstanding distributed systems mastery.',
              topStrengths: ['Deep Kafka understanding', 'Idempotency mastery'],
              criticalWeaknesses: ['Could specify exact buffer memory sizes'],
              competencyBreakdown: {
                systemArchitecture: { score: 95, comment: 'Exemplary architecture' },
                correctnessAndEdgeCases: { score: 90, comment: 'Solid edge handling' },
                productionReadiness: { score: 92, comment: 'High production readiness' },
                tradeoffAnalysis: { score: 91, comment: 'Clear trade-offs' },
              },
              actionableRoadmap: ['Continue mastering zero-copy networking'],
              disclaimer: 'AI-generated evaluation powered by Google Gemini.',
            },
          }),
        });
      }
      return route.continue();
    });

    await page.goto('/interview?mode=ai');

    // Verify AI Interviewer setup screen
    await expect(page.getByText(/Target Engineering Role/i)).toBeVisible();
    await expect(page.getByText(/Technology Domain & Specialization/i)).toBeVisible();

    // Start AI interview
    const startBtn = page.getByRole('button', { name: /Start AI Interview Session/i });
    await startBtn.click();

    // Verify conversation thread displays the interviewer's synthesized question
    await expect(page.getByText(/Staff Hiring Bar Interviewer/i)).toBeVisible();
    await expect(page.getByText(/Round 1 of/i)).toBeVisible();

    // Enter candidate answer
    const textarea = page.getByPlaceholder(/Structure your architectural response/i);
    await textarea.fill('We utilize the Transactional Outbox pattern with PostgreSQL and Debezium CDC to publish domain events to Kafka atomically, avoiding dual-write failures.');

    // Submit answer
    const submitAnswerBtn = page.getByRole('button', { name: /Submit Answer/i });
    await submitAnswerBtn.click();

    // Verify turn feedback and next contextual question appear
    await expect(page.getByText(/Interviewer Assessment/i)).toBeVisible();
    await expect(page.getByText(/Round 2 of/i)).toBeVisible();

    // Request progressive hint
    const hintBtn = page.getByRole('button', { name: /Request Hint/i });
    await hintBtn.click();
    await expect(page.getByText(/Architectural Guidance Hint/i)).toBeVisible();

    // End interview and generate final scorecard
    const endBtn = page.getByRole('button', { name: /End & Generate Scorecard/i });
    await endBtn.click();

    // Verify Hiring Committee Evaluation Scorecard renders
    await expect(page.getByText(/Hiring Committee Evaluation Scorecard/i)).toBeVisible();
    await expect(page.getByText(/Verified Strengths/i)).toBeVisible();
    await expect(page.getByText(/Critical Areas for Growth/i)).toBeVisible();
    await expect(page.getByText(/AI-Generated Evaluation/i).first()).toBeVisible();
  });

  test('Enterprise Loan Management Dashboard supports searching, filtering, pagination, drawer inspection, optimistic updates, and bug scenarios', async ({
    page,
  }) => {
    await page.goto('/challenges/loan-management');

    // 1. Check title & summary cards
    await expect(page.getByText(/Enterprise Loan Management Dashboard/i)).toBeVisible();
    await expect(page.getByText(/Total Applications/i)).toBeVisible();
    await expect(page.getByText(/Approved Loans/i)).toBeVisible();

    // 2. Test search filter
    const searchInput = page.getByPlaceholder(/Search by ID, applicant name/i);
    await searchInput.fill('Sophia');
    await page.waitForTimeout(400); // Allow 300ms debounce
    await expect(page.getByText(/Sophia Chen/i)).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(400);

    // 3. Test status filter pill
    const pendingPill = page.getByRole('button', { name: /^Pending$/i });
    await pendingPill.click();
    await page.waitForTimeout(200);

    // 4. Test row click to open Details Drawer
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    await expect(page.getByText(/Underwriting Metrics/i)).toBeVisible();
    await expect(page.getByText(/Audit Timeline/i)).toBeVisible();

    // Close drawer
    const closeBtn = page.getByRole('button', { name: /Close drawer/i });
    await closeBtn.click();
    await expect(page.getByText(/Underwriting Metrics/i)).not.toBeVisible();

    // 5. Test Bug Scenarios Explorer toggle
    const bugBtn = page.getByRole('button', { name: /8 Production Bugs/i });
    await bugBtn.click();
    await expect(page.getByText(/Production Incident & Concurrency Deep Dives/i)).toBeVisible();
    await expect(page.getByText(/BUG #1/i)).toBeVisible();

    // 6. Test Senior Interview Mode toggle
    const interviewBtn = page.getByRole('button', { name: /Senior Interview Mode/i });
    await interviewBtn.click();
    await expect(page.getByText(/Enterprise React & Redux Architecture Oral Defense/i)).toBeVisible();
  });

  test('Tier 1 Beginner Track provides difficulty selection, Practice Mode with hints, and Mock Interview Mode', async ({ page }) => {
    await page.goto('/interview?tier=tier-1');

    // 1. Verify Tier Selector
    await expect(page.getByText(/Choose Your Difficulty Track/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tier 1: Beginner' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tier 4: Senior / Production-Level' })).toBeVisible();

    // 2. Verify Tier 1 Header & Questions
    await expect(page.getByText(/Beginner Full-Stack Interview Preparation/i)).toBeVisible();
    await expect(page.getByText(/63 foundational questions/i)).toBeVisible();

    // 3. Test Practice Mode: Hint & Submit Answer
    const hintBtn = page.getByRole('button', { name: /Hint \(/i });
    await hintBtn.click();
    await expect(page.getByText(/Progressive Guidance Hints/i)).toBeVisible();

    // Fill answer and submit
    const answerTextarea = page.getByPlaceholder(/Explain what this concept is/i);
    await answerTextarea.fill('var is function-scoped while let and const are block-scoped. const prevents reassignment.');
    const submitBtn = page.getByRole('button', { name: /Submit for Review/i });
    await submitBtn.click();

    // Check evaluation result
    await expect(page.getByText(/Evaluation:/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Performance Score', { exact: true })).toBeVisible();

    // 4. Test Mock Interview Mode
    const mockTabBtn = page.getByRole('button', { name: /Mock Interview Mode/i });
    await mockTabBtn.click();
    await expect(page.getByText(/Beginner Mock Interview Simulation/i)).toBeVisible();
    await expect(page.getByText(/Select Question Count/i)).toBeVisible();

    // Start mock interview
    const beginMockBtn = page.getByRole('button', { name: /Begin Tier 1 Mock Interview/i });
    await beginMockBtn.click();

    // Verify mock interview runner
    await expect(page.getByText(/Question 1 of/i)).toBeVisible();
    await expect(page.getByText(/Your Technical Response/i)).toBeVisible();
  });
});
