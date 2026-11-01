import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { allScenarios } from '../src/data/index';
import { allTier1Questions } from '../src/data/tier1/index';
import { practiceProblems } from '../src/data/practiceProblems';
import { loanBugScenarios } from '../src/data/loanBugScenarios';
import { ALL_SQL_QUESTIONS } from '../src/data/sql/index';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function buildPdfAndHtml() {
  console.log('🚀 Starting System Architecture Documentation & PDF Build...');

  const templatePath = path.resolve(process.cwd(), 'scripts', 'template.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`);
  }
  let html = fs.readFileSync(templatePath, 'utf8');

  // 1. Process Screenshots (14 Screens)
  console.log('📸 Encoding screenshots to Base64 (14 items)...');
  const screenshots = [
    { key: '{{IMG_01}}', file: '01_dashboard.png' },
    { key: '{{IMG_02}}', file: '02_library.png' },
    { key: '{{IMG_03}}', file: '03_workspace.png' },
    { key: '{{IMG_04}}', file: '04_practice.png' },
    { key: '{{IMG_05}}', file: '05_ai_interview.png' },
    { key: '{{IMG_06}}', file: '06_tier1_practice.png' },
    { key: '{{IMG_07}}', file: '07_tier1_mock.png' },
    { key: '{{IMG_08}}', file: '08_loan_dashboard.png' },
    { key: '{{IMG_09}}', file: '09_loan_bugs.png' },
    { key: '{{IMG_10}}', file: '10_progress.png' },
    { key: '{{IMG_11}}', file: '11_sql_hub.png' },
    { key: '{{IMG_12}}', file: '12_sql_playground.png' },
    { key: '{{IMG_13}}', file: '13_sql_incidents.png' },
    { key: '{{IMG_14}}', file: '14_sql_mock.png' },
  ];

  for (const s of screenshots) {
    const imgPath = path.resolve(process.cwd(), 'docs', 'screenshots', s.file);
    if (fs.existsSync(imgPath)) {
      const b64 = fs.readFileSync(imgPath).toString('base64');
      const dataUri = `data:image/png;base64,${b64}`;
      html = html.replace(new RegExp(s.key, 'g'), dataUri);
      console.log(`  ✓ Injected ${s.file} (${Math.round(b64.length / 1024)} KB)`);
    } else {
      console.warn(`  ⚠️ Image file not found: ${imgPath}`);
      html = html.replace(new RegExp(s.key, 'g'), '');
    }
  }

  // 2. Build SQL Track Questions Table (120 Questions)
  console.log('📋 Building SQL & PostgreSQL Track Table (120 items)...');
  const sqlRows = ALL_SQL_QUESTIONS.map((q) => {
    let tierBadge = 'badge-emerald';
    let tierLabel = 'Tier 1';
    if (q.tier === 'tier-2') {
      tierBadge = 'badge-blue';
      tierLabel = 'Tier 2';
    } else if (q.tier === 'tier-3') {
      tierBadge = 'badge-purple';
      tierLabel = 'Tier 3';
    } else if (q.tier === 'tier-4') {
      tierBadge = 'badge-rose';
      tierLabel = 'Tier 4';
    }

    let typeBadge = 'badge-slate';
    let typeLabel = 'Conceptual';
    if (q.questionType === 'executable') {
      typeBadge = 'badge-emerald';
      typeLabel = 'Interactive SQL';
    } else if (q.questionType === 'incident') {
      typeBadge = 'badge-rose';
      typeLabel = 'SRE Incident';
    }

    return `
      <tr>
        <td><span class="badge ${tierBadge}">${tierLabel}</span></td>
        <td><span class="badge badge-slate">${escapeHtml(q.category)}</span></td>
        <td><code>${escapeHtml(q.id)}</code></td>
        <td><strong>${escapeHtml(q.title)}</strong></td>
        <td><span class="badge ${typeBadge}">${typeLabel}</span></td>
      </tr>
    `.trim();
  }).join('\n');
  html = html.replace('{{SQL_QUESTIONS_TABLE}}', sqlRows);

  // 3. Build Scenarios Table (51 Senior Scenarios)
  console.log('📋 Building Senior Scenarios Table (51 items)...');
  const scenarioRows = allScenarios.map((sc) => {
    let diffBadge = 'badge-blue';
    if (sc.difficulty === 'Staff/Principal') diffBadge = 'badge-rose';
    else if (sc.difficulty === 'Senior') diffBadge = 'badge-purple';
    else diffBadge = 'badge-emerald';

    let topicBadge = 'badge-blue';
    if (sc.topic.includes('React') || sc.topic.includes('Next')) topicBadge = 'badge-purple';
    else if (sc.topic.includes('Database') || sc.topic.includes('Postgre')) topicBadge = 'badge-emerald';
    else if (sc.topic.includes('System') || sc.topic.includes('Operations')) topicBadge = 'badge-amber';
    else if (sc.topic.includes('Security')) topicBadge = 'badge-rose';

    return `
      <tr>
        <td><span class="badge ${topicBadge}">${escapeHtml(sc.topic)}</span></td>
        <td><code>${escapeHtml(sc.id)}</code></td>
        <td><strong>${escapeHtml(sc.title)}</strong></td>
        <td><span class="badge ${diffBadge}">${escapeHtml(sc.difficulty)}</span></td>
        <td><span class="badge badge-slate">${escapeHtml(sc.type)}</span></td>
      </tr>
    `.trim();
  }).join('\n');
  html = html.replace('{{SCENARIOS_TABLE}}', scenarioRows);

  // 4. Build Tier 1 Table (63 Beginner Questions)
  console.log('📋 Building Tier 1 Questions Table (63 items)...');
  const tier1Rows = allTier1Questions.map((q) => {
    let catBadge = 'badge-purple';
    if (q.category.includes('HTML')) catBadge = 'badge-blue';
    else if (q.category.includes('React')) catBadge = 'badge-emerald';
    else if (q.category.includes('Redux')) catBadge = 'badge-amber';
    else if (q.category.includes('Node') || q.category.includes('REST')) catBadge = 'badge-rose';

    const hasCode = Boolean(q.codingExercise);
    const codeBadge = hasCode ? 'badge-emerald' : 'badge-slate';
    const codeText = hasCode ? 'Interactive Code' : 'Conceptual';

    return `
      <tr>
        <td><span class="badge ${catBadge}">${escapeHtml(q.category)}</span></td>
        <td><code>${escapeHtml(q.id)}</code></td>
        <td><strong>${escapeHtml(q.title)}</strong></td>
        <td><span class="badge ${codeBadge}">${codeText}</span></td>
      </tr>
    `.trim();
  }).join('\n');
  html = html.replace('{{TIER1_TABLE}}', tier1Rows);

  // 5. Build Practice Problems Table (6 Items)
  console.log('📋 Building Monaco Practice Table (6 items)...');
  const practiceRows = practiceProblems.map((p) => {
    let langBadge = 'badge-blue';
    if (p.language === 'typescript') langBadge = 'badge-purple';
    else if (p.language === 'sql') langBadge = 'badge-emerald';
    else if (p.language === 'python') langBadge = 'badge-amber';

    return `
      <tr>
        <td><span class="badge ${langBadge}">${escapeHtml(p.language.toUpperCase())}</span></td>
        <td><code>${escapeHtml(p.id)}</code></td>
        <td><strong>${escapeHtml(p.title)}</strong></td>
        <td><span class="badge badge-rose">${escapeHtml(p.difficulty)}</span></td>
      </tr>
    `.trim();
  }).join('\n');
  html = html.replace('{{PRACTICE_TABLE}}', practiceRows);

  // 6. Build Loan Bug Scenarios Table (8 Items)
  console.log('📋 Building Loan Management Bug Scenarios Table (8 items)...');
  const loanBugRows = loanBugScenarios.map((b) => {
    return `
      <tr>
        <td style="text-align: center;"><span class="badge badge-rose">Bug #${b.number}</span></td>
        <td><span class="badge badge-amber">${escapeHtml(b.category)}</span></td>
        <td>
          <strong style="color: #0f172a;">${escapeHtml(b.title)}</strong>
          <div style="font-size: 7.2pt; color: #64748b; margin-top: 4px;">${escapeHtml(b.description)}</div>
        </td>
        <td>
          <div style="margin-bottom: 6px;"><strong style="color: #dc2626;">Root Cause:</strong> ${escapeHtml(b.rootCause)}</div>
          <div><strong style="color: #059669;">Senior Fix:</strong> ${escapeHtml(b.solutionExplanation)}</div>
        </td>
      </tr>
    `.trim();
  }).join('\n');
  html = html.replace('{{LOAN_BUGS_TABLE}}', loanBugRows);

  // 7. Write standalone HTML file
  const outHtmlPath = path.resolve(process.cwd(), 'Full_Stack_Engineering_Interview_Lab_Architecture.html');
  fs.writeFileSync(outHtmlPath, html, 'utf8');
  console.log(`📄 Saved Standalone HTML: ${outHtmlPath} (${(fs.statSync(outHtmlPath).size / 1024).toFixed(1)} KB)`);

  // 8. Render PDF via Playwright
  console.log('🖨️ Generating A4 High-Resolution PDF via Playwright...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + outHtmlPath.replace(/\\/g, '/');
  
  await page.goto(fileUrl, {
    waitUntil: 'networkidle',
    timeout: 90000
  });

  // Give webfonts and images an extra moment to stabilize
  await page.waitForTimeout(2000);

  const outPdfPath = path.resolve(process.cwd(), 'Full_Stack_Engineering_Interview_Lab_Architecture.pdf');
  await page.pdf({
    path: outPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '14mm',
      right: '14mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 7pt; font-family: 'Inter', sans-serif; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;">
        <span>Full Stack Engineering Interview Lab — Architectural Specification</span>
        <span>Confidential / Internal Engineering Guide</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 7pt; font-family: 'JetBrains Mono', monospace; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;">
        <span>System Architecture &amp; Complete Challenge Catalog (248 Problems)</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();
  const pdfStats = fs.statSync(outPdfPath);
  console.log(`✅ PDF Generated Successfully: ${outPdfPath}`);
  console.log(`📊 PDF Size: ${(pdfStats.size / (1024 * 1024)).toFixed(2)} MB`);
}

buildPdfAndHtml().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
