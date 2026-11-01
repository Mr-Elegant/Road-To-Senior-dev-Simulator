const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const outputDir = path.join(__dirname, '..', 'docs', 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 850 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('Capturing screenshots from http://localhost:3000...');

  // 1. Dashboard
  console.log('1. Capturing Dashboard...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '01_dashboard.png') });

  // 2. Library
  console.log('2. Capturing Challenge Library...');
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outputDir, '02_library.png') });

  // 3. Challenge Workspace
  console.log('3. Capturing Challenge Workspace...');
  await page.goto('http://localhost:3000/challenge/js-event-loop-microtasks', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outputDir, '03_workspace.png') });

  // 4. Monaco Practice
  console.log('4. Capturing Coding Practice...');
  await page.goto('http://localhost:3000/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outputDir, '04_practice.png') });

  // 5. AI Interview Setup
  console.log('5. Capturing AI Interviewer Setup...');
  await page.goto('http://localhost:3000/interview?mode=ai', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '05_ai_interview.png') });

  // 6. Tier 1 Practice
  console.log('6. Capturing Tier 1 Beginner Track...');
  await page.goto('http://localhost:3000/interview?tier=tier-1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '06_tier1_practice.png') });

  // 7. Tier 1 Mock Mode
  console.log('7. Capturing Tier 1 Mock Mode...');
  const mockTabBtn = page.getByRole('button', { name: /Mock Interview Mode/i });
  if (await mockTabBtn.isVisible()) {
    await mockTabBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDir, '07_tier1_mock.png') });
  }

  // 8. Loan Management Dashboard
  console.log('8. Capturing Enterprise Loan Dashboard...');
  await page.goto('http://localhost:3000/challenges/loan-management', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '08_loan_dashboard.png') });

  // 9. Bug Scenarios Explorer in Loan Dashboard
  console.log('9. Capturing Bug Scenarios Explorer...');
  const bugBtn = page.getByRole('button', { name: /8 Production Bugs/i });
  if (await bugBtn.isVisible()) {
    await bugBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDir, '09_loan_bugs.png') });
  }

  // 10. Progress & Analytics
  console.log('10. Capturing Progress & Analytics...');
  await page.goto('http://localhost:3000/progress', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '10_progress.png') });

  // 11. SQL Track Hub & Tiers
  console.log('11. Capturing SQL & Postgres Track Hub...');
  await page.goto('http://localhost:3000/sql', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outputDir, '11_sql_hub.png') });

  // 12. SQL Playground
  console.log('12. Capturing SQL Playground & Monaco Editor...');
  const playgroundTabBtn = page.getByRole('button', { name: /SQL Sandbox & Playground/i });
  if (await playgroundTabBtn.isVisible()) {
    await playgroundTabBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '12_sql_playground.png') });
  }

  // 13. SQL SRE Incidents
  console.log('13. Capturing SQL SRE Incident Cockpit...');
  const incidentTabBtn = page.getByRole('button', { name: /Production Incident Cockpit/i });
  if (await incidentTabBtn.isVisible()) {
    await incidentTabBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '13_sql_incidents.png') });
  }

  // 14. SQL Mock Interview
  console.log('14. Capturing SQL Timed Mock Interview...');
  const sqlMockTabBtn = page.getByRole('button', { name: /Timed Mock/i });
  if (await sqlMockTabBtn.isVisible()) {
    await sqlMockTabBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '14_sql_mock.png') });
  }

  await browser.close();
  console.log('All screenshots captured successfully in docs/screenshots!');
}

captureScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

