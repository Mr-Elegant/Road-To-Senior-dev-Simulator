import type { Scenario, TestCase } from '@/types/scenario';
import type { ReactAction, ReactAssertion, ReactJourney } from '@/types/reactExercise';

const input = (selector: string, value: string): ReactAction => ({ type: 'input', selector, value });
const click = (selector: string): ReactAction => ({ type: 'click', selector });
const key = (selector: string, value: string): ReactAction => ({ type: 'key', selector, key: value });
const text = (selector: string, equals: string): ReactAssertion => ({ selector, property: 'text', equals });
const attr = (selector: string, attribute: string, equals: string | null): ReactAssertion => ({ selector, property: 'attribute', attribute, equals });
const count = (selector: string, equals: number): ReactAssertion => ({ selector, property: 'count', equals });
function uiCase(id: string, name: string, actions: ReactAction[], assertions: ReactAssertion[], props?: ReactJourney['props']): TestCase {
  return { id, name, inputDescription: JSON.stringify({ props, actions, assertions }), expectedOutput: 'All DOM assertions passed' };
}
function exercise(content: Pick<Scenario, 'id' | 'title' | 'businessContext' | 'problemStatement' | 'constraints' | 'starterCode' | 'testCases' | 'hints' | 'referenceSolution' | 'commonMistakes' | 'followUpQuestions'>): Scenario {
  return {
    ...content, type: 'coding', topic: 'React', subtopic: 'React UI Practice · Foundations', difficulty: 'Beginner',
    estimatedMinutes: 25, codeLanguage: 'jsx', reactExercise: true,
    candidateTasks: ['Implement the default-exported App component and the documented DOM contract.', 'Run every interaction journey, explain edge cases, then compare your implementation with the reference.'],
    rubric: [{ id: `${content.id}-behavior`, category: 'correctness', label: 'Component behavior and boundaries', weight: 5,
      description: 'Use test evidence to explain state transitions, accessible controls, and boundary behavior.', levels: [
        { score: 0, description: 'The component is missing or its main interaction fails.' },
        { score: 1, description: 'The happy path works but boundary cases fail.' },
        { score: 2, description: 'All authored cases pass; additional accessibility or edge-case reasoning is incomplete.' },
        { score: 3, description: 'All authored cases pass and the implementation and limitations are explained.' },
      ] }],
    alternativeApproaches: ['Extract a small pure helper for derived values; keep input state in the component. Extend with a custom hook only when behavior is reused.'],
  };
}

export const reactPracticeScenarios: Scenario[] = [
  exercise({
    id: 'react-ui-password-feedback', title: 'React UI: Account Password Feedback',
    businessContext: 'A trial account form needs immediate, understandable feedback without sending draft passwords to a service.',
    problemStatement: 'Export App. Render a controlled password input labelled Password. Four independent checks award one point each: at least 10 characters, both ASCII lowercase and uppercase letters, an ASCII digit, and a non-alphanumeric character. In [data-testid="feedback"], show Start typing for empty input, Weak for 1–9 characters with at most one passed check (also for any nonempty score 0–1), Fair for scores 2–3, and Strong for score 4. Show the numeric score in [data-testid="passed-rules"]. Recompute on every edit, including deletion.',
    constraints: ['Keep the input type=password and associate a visible label with it.', 'Do not store, log, or transmit the password. This meter is instructional feedback, not a password-security guarantee.'],
    starterCode: `import { useState } from 'react';
export default function App() {
  const [password, setPassword] = useState('');
  return <section><label>Password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    <p data-testid="feedback" role="status">Start typing</p><output data-testid="passed-rules">0</output></section>;
}`,
    testCases: [
      uiCase('pw-empty', 'Empty input starts without feedback severity', [], [text('[data-testid="feedback"]', 'Start typing'), text('[data-testid="passed-rules"]', '0'), attr('input', 'type', 'password')]),
      uiCase('pw-weak', 'Short lowercase text remains weak', [input('input', 'small')], [text('[data-testid="feedback"]', 'Weak'), text('[data-testid="passed-rules"]', '0')]),
      uiCase('pw-fair', 'Two independent checks produce fair feedback', [input('input', 'Hello1')], [text('[data-testid="feedback"]', 'Fair'), text('[data-testid="passed-rules"]', '2')]),
      uiCase('pw-strong', 'All four checks produce strong feedback', [input('input', 'LongPass42!')], [text('[data-testid="feedback"]', 'Strong'), text('[data-testid="passed-rules"]', '4')]),
      uiCase('pw-reset', 'Deleting the password resets the derived feedback', [input('input', 'LongPass42!'), input('input', '')], [text('[data-testid="feedback"]', 'Start typing'), text('[data-testid="passed-rules"]', '0')]),
    ],
    hints: ['Store the input string; compute the checks from it instead of maintaining a second score state.', 'Treat empty input separately from nonempty input with zero passed checks.'],
    referenceSolution: { explanation: 'The password is the single source of truth. Four booleans produce a numeric score during rendering, so deletion cannot leave a stale strength value. A labelled password input conceals the text and a status region announces feedback. A real password policy also considers breached-password screening and server validation; this exercise does not estimate entropy.', codeOrArtifact: `import { useState } from 'react';
export default function App() {
  const [password, setPassword] = useState('');
  const score = [password.length >= 10, /[a-z]/.test(password) && /[A-Z]/.test(password), /[0-9]/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length;
  const feedback = !password ? 'Start typing' : score < 2 ? 'Weak' : score < 4 ? 'Fair' : 'Strong';
  return <section><label>Password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    <p data-testid="feedback" role="status">{feedback}</p><output data-testid="passed-rules">{score}</output></section>;
}` },
    commonMistakes: ['Saving derived score independently and forgetting to update it on deletion.', 'Logging or persisting a password while debugging.'],
    followUpQuestions: [{ id: 'pw-follow', question: 'Would this replace server-side password validation?', expectedConcepts: ['Untrusted client', 'Server policy', 'Breached credentials'], sampleStrongAnswer: 'No. Client feedback helps usability but is bypassable. The server enforces the policy and handles credentials securely; avoid treating a checklist score as proof that a password is safe.' }],
  }),
  exercise({
    id: 'react-ui-web-address', title: 'React UI: Web Address Inspector',
    businessContext: 'An integrations setup form needs to catch unusable website addresses before a user saves the configuration.',
    problemStatement: 'Export App with a controlled input labelled Website. Trim its value for validation. An empty trimmed value shows Enter a web address. Otherwise accept only absolute URLs parsed by URL whose protocol is http: or https: and whose username and password are empty. Show Valid web address or Invalid web address in [data-testid="feedback"]. Put URL.href in [data-testid="normalized"] for accepted input and an empty string otherwise. Do not automatically add a scheme, navigate, or request the address.',
    constraints: ['Validation updates while typing and never throws for malformed input.', 'localhost is allowed if it has an explicit HTTP(S) scheme. This is a syntax check, not an SSRF or network-safety check.'],
    starterCode: `import { useState } from 'react';
export default function App() {
  const [value, setValue] = useState('');
  return <section><label>Website <input value={value} onChange={e => setValue(e.target.value)} /></label>
    <p data-testid="feedback" role="status">Enter a web address</p><output data-testid="normalized"></output></section>;
}`,
    testCases: [
      uiCase('url-empty', 'Whitespace is an empty address', [input('input', '   ')], [text('[data-testid="feedback"]', 'Enter a web address'), text('[data-testid="normalized"]', '')]),
      uiCase('url-valid', 'Normalize an HTTPS address without navigation', [input('input', ' https://EXAMPLE.com/path ')], [text('[data-testid="feedback"]', 'Valid web address'), text('[data-testid="normalized"]', 'https://example.com/path')]),
      uiCase('url-relative', 'A missing scheme is rejected', [input('input', 'example.com')], [text('[data-testid="feedback"]', 'Invalid web address')]),
      uiCase('url-scheme', 'Non-web schemes are rejected', [input('input', 'javascript:alert(1)')], [text('[data-testid="feedback"]', 'Invalid web address'), text('[data-testid="normalized"]', '')]),
      uiCase('url-auth', 'Embedded credentials are rejected', [input('input', 'https://person:secret@example.com')], [text('[data-testid="feedback"]', 'Invalid web address')]),
      uiCase('url-local', 'Localhost works with an explicit web scheme', [input('input', 'http://localhost:8080')], [text('[data-testid="feedback"]', 'Valid web address'), text('[data-testid="normalized"]', 'http://localhost:8080/')]),
    ],
    hints: ['Use new URL inside try/catch instead of a broad regular expression.', 'Clear the normalized output when input becomes invalid.'],
    referenceSolution: { explanation: 'Parsing is delegated to the platform URL implementation. A separate protocol and credential policy narrows the accepted parsed values. Both feedback and normalized output are derived from the same input, so a previously valid address cannot remain visible after an invalid edit. No network request is made; server-side URL consumers need their own destination restrictions.', codeOrArtifact: `import { useState } from 'react';
export default function App() {
  const [value, setValue] = useState('');
  const trimmed = value.trim();
  let normalized = '';
  try {
    const url = new URL(trimmed);
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) normalized = url.href;
  } catch {}
  const feedback = !trimmed ? 'Enter a web address' : normalized ? 'Valid web address' : 'Invalid web address';
  return <section><label>Website <input value={value} onChange={e => setValue(e.target.value)} /></label>
    <p data-testid="feedback" role="status">{feedback}</p><output data-testid="normalized">{normalized}</output></section>;
}` },
    commonMistakes: ['Accepting any parsed scheme.', 'Equating a syntactically valid URL with a safe server-side fetch target.'],
    followUpQuestions: [{ id: 'url-follow', question: 'How would a backend safely fetch a user-supplied URL?', expectedConcepts: ['SSRF', 'Destination validation', 'Redirects'], sampleStrongAnswer: 'Enforce an explicit destination policy on the server, including resolved addresses and redirects, block private or metadata targets where required, and bound connection time, response size, and redirect count. Browser syntax validation provides no SSRF protection.' }],
  }),
  exercise({
    id: 'react-ui-tag-editor', title: 'React UI: Team Tag Editor',
    businessContext: 'A support team labels saved views with a small set of tags and needs predictable keyboard behavior without accidental duplicates.',
    problemStatement: 'Export App({ limit = 3 }). Render an input labelled New tag and a list [data-testid="tags"]. Enter adds the trimmed nonempty draft and clears the input on success. Compare existing tags case-insensitively; a duplicate leaves the draft unchanged and sets [data-testid="feedback"] to Tag already exists. At the limit show Tag limit reached and retain the draft. Duplicate checking takes precedence over the limit. Blank Enter does nothing. Each tag has a native button named Remove followed by the original tag text. Backspace on an empty input removes the last tag. Clear feedback after a successful add or removal. Preserve original capitalization and insertion order.',
    constraints: ['limit is an integer from 1 to 5; tests only supply valid configuration.', 'Use immutable list updates, a labelled input, and native remove buttons. Do not submit a form on Enter.'],
    starterCode: `import { useState } from 'react';
export default function App() {
  const [draft, setDraft] = useState('');
  return <section><label>New tag <input value={draft} onChange={e => setDraft(e.target.value)} /></label>
    <ul data-testid="tags"></ul><p data-testid="feedback" role="status"></p></section>;
}`,
    testCases: [
      uiCase('tag-add', 'Enter trims the draft and adds a tag', [input('input', '  Ops  '), key('input', 'Enter')], [text('[data-testid="tags"] li', 'OpsRemove'), { selector: 'input', property: 'value', equals: '' }]),
      uiCase('tag-duplicate', 'Case-insensitive duplicates retain the draft', [input('input', 'Ops'), key('input', 'Enter'), input('input', 'ops'), key('input', 'Enter')], [count('[data-testid="tags"] li', 1), text('[data-testid="feedback"]', 'Tag already exists'), { selector: 'input', property: 'value', equals: 'ops' }]),
      uiCase('tag-limit', 'Configured limit prevents extra tags', [input('input', 'One'), key('input', 'Enter'), input('input', 'Two'), key('input', 'Enter')], [count('[data-testid="tags"] li', 1), text('[data-testid="feedback"]', 'Tag limit reached')], { limit: 1 }),
      uiCase('tag-remove', 'Removing a tag frees a slot', [input('input', 'Ops'), key('input', 'Enter'), click('[aria-label="Remove Ops"]')], [count('[data-testid="tags"] li', 0), text('[data-testid="feedback"]', '')]),
      uiCase('tag-backspace', 'Empty Backspace removes only the last tag', [input('input', 'First'), key('input', 'Enter'), input('input', 'Second'), key('input', 'Enter'), key('input', 'Backspace')], [count('[data-testid="tags"] li', 1), text('[data-testid="tags"] li', 'FirstRemove')]),
      uiCase('tag-blank', 'Whitespace does not create a tag', [input('input', '   '), key('input', 'Enter')], [count('[data-testid="tags"] li', 0)]),
    ],
    hints: ['Keep draft, tags, and feedback in separate state values.', 'Handle duplicates before capacity and remove tags using filter or slice rather than mutating the array.'],
    referenceSolution: { explanation: 'Enter normalizes only the draft boundaries, retains the authored capitalization, and compares a lowercase key for uniqueness. Duplicate checking precedes capacity so the result is deterministic at a full list. Functional updates avoid stale list writes; native buttons provide keyboard activation. Backspace removes the final tag only when the input is genuinely empty.', codeOrArtifact: `import { useState } from 'react';
export default function App({ limit = 3 }) {
  const [draft, setDraft] = useState('');
  const [tags, setTags] = useState([]);
  const [feedback, setFeedback] = useState('');
  function remove(tag) { setTags(old => old.filter(item => item !== tag)); setFeedback(''); }
  function onKeyDown(e) {
    if (e.key === 'Backspace' && draft === '') { setTags(old => old.slice(0, -1)); setFeedback(''); }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const tag = draft.trim();
    if (!tag) return;
    if (tags.some(item => item.toLowerCase() === tag.toLowerCase())) { setFeedback('Tag already exists'); return; }
    if (tags.length >= limit) { setFeedback('Tag limit reached'); return; }
    setTags(old => [...old, tag]); setDraft(''); setFeedback('');
  }
  return <section><label>New tag <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKeyDown} /></label>
    <ul data-testid="tags">{tags.map(tag => <li key={tag}>{tag}<button type="button" aria-label={'Remove ' + tag} onClick={() => remove(tag)}>Remove</button></li>)}</ul>
    <p data-testid="feedback" role="status">{feedback}</p></section>;
}` },
    commonMistakes: ['Checking capacity before duplicate detection.', 'Calling pop on an array held in React state.'],
    followUpQuestions: [{ id: 'tag-follow', question: 'How should this behave while a user is composing text with an IME?', expectedConcepts: ['Composition events', 'Keyboard input'], sampleStrongAnswer: 'Treat composition as a separate input phase and ignore Enter or Backspace commands while the event is composing. Add browser tests for the supported IMEs before shipping international input handling.' }],
  }),
  exercise({
    id: 'react-ui-project-progress', title: 'React UI: Project Completion Meter',
    businessContext: 'A project dashboard receives progress values from multiple importers, including values outside the display range.',
    problemStatement: 'Export App({ value = 0 }). Accept only finite JavaScript numbers; all other values display zero. Clamp the number to 0–100, then round to the nearest integer. Render an element with role=progressbar, aria-label="Project completion", aria-valuemin="0", aria-valuemax="100", and aria-valuenow equal to the display integer. Show the same integer followed by % in [data-testid="percentage"]. The displayed value must be derived from props rather than copied into mount-only state.',
    constraints: ['Numeric strings are invalid and must not be coerced.', 'The visual fill and accessible numeric value must agree. No animation is required.'],
    starterCode: `export default function App({ value = 0 }) {
  return <section><div role="progressbar" aria-label="Project completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" />
    <output data-testid="percentage">0%</output></section>;
}`,
    testCases: [
      uiCase('progress-zero', 'Default progress is zero', [], [text('[data-testid="percentage"]', '0%'), attr('[role="progressbar"]', 'aria-valuenow', '0')]),
      uiCase('progress-round', 'Fractional progress rounds consistently', [], [text('[data-testid="percentage"]', '53%'), attr('[role="progressbar"]', 'aria-valuenow', '53')], { value: 52.6 }),
      uiCase('progress-high', 'Progress above one hundred is clamped', [], [text('[data-testid="percentage"]', '100%'), attr('[role="progressbar"]', 'aria-valuenow', '100')], { value: 142 }),
      uiCase('progress-low', 'Negative progress is clamped', [], [text('[data-testid="percentage"]', '0%')], { value: -8 }),
      uiCase('progress-string', 'Numeric strings are not accepted', [], [text('[data-testid="percentage"]', '0%')], { value: '45' }),
      uiCase('progress-aria', 'The range and accessible label are explicit', [], [attr('[role="progressbar"]', 'aria-valuemin', '0'), attr('[role="progressbar"]', 'aria-valuemax', '100'), attr('[role="progressbar"]', 'aria-label', 'Project completion')], { value: 100 }),
    ],
    hints: ['Check typeof and Number.isFinite before applying Math.min and Math.max.', 'Use one normalized value for the fill, text, and ARIA attributes.'],
    referenceSolution: { explanation: 'A single normalized integer drives the entire presentation. Strict numeric validation avoids surprising coercion of strings and null; clamping before rounding keeps the result inside the ARIA range. The component derives its output directly from current props, so a parent update naturally refreshes the value without an effect.', codeOrArtifact: `export default function App({ value = 0 }) {
  const progress = typeof value === 'number' && Number.isFinite(value) ? Math.round(Math.max(0, Math.min(100, value))) : 0;
  return <section><div role="progressbar" aria-label="Project completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} style={{background:'#e4e4e7', height:16}}>
    <div style={{background:'#2563eb', height:'100%', width:progress + '%'}} /></div>
    <output data-testid="percentage">{progress}%</output></section>;
}` },
    commonMistakes: ['Coercing numeric strings even though the input contract forbids them.', 'Updating the text but leaving an inconsistent aria-valuenow.'],
    followUpQuestions: [{ id: 'progress-follow', question: 'What if the total work is unknown?', expectedConcepts: ['Indeterminate progress', 'ARIA'], sampleStrongAnswer: 'Use an indeterminate presentation and omit aria-valuenow while retaining an accessible name. Do not show a fabricated percentage. When a denominator becomes available, switch to a determinate value.' }],
  }),
  exercise({
    id: 'react-ui-loan-estimator', title: 'React UI: Monthly Loan Estimator',
    businessContext: 'A lending demo needs a transparent monthly-payment estimate with an explicit zero-interest path and clear invalid-input feedback.',
    problemStatement: 'Export App. Render initially empty inputs labelled Principal, Annual rate, and Years, with names principal, rate, and years. A native form with a Calculate button computes a payment on submit. Accept finite numeric values: principal > 0, annual percentage rate >= 0, and whole-number years from 1 to 50. Blank or invalid fields set [data-testid="error"] to Enter valid loan details and clear [data-testid="payment"]. For n=years*12 and r=annualRate/1200, use P/n when r=0; otherwise P*r/(1-(1+r)^(-n)). Display only payment.toFixed(2) in payment. Valid submission clears error. Prevent browser navigation. Assume accepted principal <= 1000000000 and annual rate <= 100.',
    constraints: ['Use type=text or type=number inputs with the documented names; all three fields must accept controlled edits.', 'This educational estimate excludes fees, taxes, insurance, lender rounding rules, and financial advice.'],
    starterCode: `import { useState } from 'react';
export default function App() {
  const [fields, setFields] = useState({principal:'', rate:'', years:''});
  return <form onSubmit={e => e.preventDefault()}>{[['principal','Principal'],['rate','Annual rate'],['years','Years']].map(([name,label]) =>
    <label key={name}>{label}<input name={name} value={fields[name]} onChange={e => setFields({...fields,[name]:e.target.value})} /></label>)}
    <button type="submit">Calculate</button><p data-testid="error" role="alert"></p><output data-testid="payment"></output></form>;
}`,
    testCases: [
      uiCase('loan-empty', 'Blank submission is rejected', [click('button')], [text('[data-testid="error"]', 'Enter valid loan details'), text('[data-testid="payment"]', '')]),
      uiCase('loan-zero', 'Zero interest divides principal by months', [input('[name="principal"]', '1200'), input('[name="rate"]', '0'), input('[name="years"]', '1'), click('button')], [text('[data-testid="payment"]', '100.00'), text('[data-testid="error"]', '')]),
      uiCase('loan-interest', 'Positive interest uses amortization', [input('[name="principal"]', '100000'), input('[name="rate"]', '6'), input('[name="years"]', '30'), click('button')], [text('[data-testid="payment"]', '599.55')]),
      uiCase('loan-fraction', 'Fractional years are rejected', [input('[name="principal"]', '1000'), input('[name="rate"]', '5'), input('[name="years"]', '1.5'), click('button')], [text('[data-testid="error"]', 'Enter valid loan details')]),
      uiCase('loan-clear', 'An invalid resubmission clears a previous payment', [input('[name="principal"]', '1200'), input('[name="rate"]', '0'), input('[name="years"]', '1'), click('button'), input('[name="principal"]', '-1'), click('button')], [text('[data-testid="payment"]', ''), text('[data-testid="error"]', 'Enter valid loan details')]),
    ],
    hints: ['Reject blank strings before Number conversion, because Number of an empty string is zero.', 'Branch explicitly for a zero monthly rate to avoid dividing zero by zero.'],
    referenceSolution: { explanation: 'The form owns raw input strings and validates them only on submission. Explicit blank checks prevent coercion from turning missing values into zero. The no-interest branch avoids a singular amortization expression. Invalid submissions clear stale estimates; valid submissions format the final result to two decimal places. This formula is an educational estimate rather than a full lending calculation.', codeOrArtifact: `import { useState } from 'react';
export default function App() {
  const [fields, setFields] = useState({principal:'', rate:'', years:''});
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault();
    const p=Number(fields.principal), annual=Number(fields.rate), y=Number(fields.years);
    if (Object.values(fields).some(v => !v.trim()) || ![p,annual,y].every(Number.isFinite) || p<=0 || p>1000000000 || annual<0 || annual>100 || !Number.isInteger(y) || y<1 || y>50) {
      setPayment(''); setError('Enter valid loan details'); return;
    }
    const n=y*12, r=annual/1200;
    setPayment((r===0 ? p/n : p*r/(1-Math.pow(1+r,-n))).toFixed(2)); setError('');
  }
  return <form onSubmit={submit}>{[['principal','Principal'],['rate','Annual rate'],['years','Years']].map(([name,label]) =>
    <label key={name}>{label}<input name={name} value={fields[name]} onChange={e => setFields({...fields,[name]:e.target.value})} /></label>)}
    <button type="submit">Calculate</button><p data-testid="error" role="alert">{error}</p><output data-testid="payment">{payment}</output></form>;
}` },
    commonMistakes: ['Using annual percentage directly as the monthly decimal rate.', 'Leaving the old payment visible after a failed submission.'],
    followUpQuestions: [{ id: 'loan-follow', question: 'What changes for production lending calculations?', expectedConcepts: ['Decimal arithmetic', 'Contractual rules', 'Server authority'], sampleStrongAnswer: 'Specify contractual compounding, schedule dates, fees, and rounding before selecting an implementation. Use authoritative server calculations and appropriate decimal or integer-money arithmetic, with fixtures agreed with domain experts. A floating-point UI estimate is insufficient for a lending contract.' }],
  }),
  exercise({
    id: 'react-ui-help-panels', title: 'React UI: Expandable Support Answers',
    businessContext: 'A compact support panel should expose one answer at a time while remaining usable with native keyboard controls.',
    problemStatement: 'Export App({ items = [] }). Each item has unique id, title, and body strings. Render a heading button per item, initially all collapsed. Activating a collapsed button opens its body and closes the previously open body; activating the same button collapses it. Each button needs aria-expanded and aria-controls="panel-ID". An open body is a region with id="panel-ID" and aria-labelledby referring to its button id="trigger-ID". Only open regions exist in the DOM. An empty array shows No help articles in [data-testid="empty"]. Use native buttons rather than clickable divs.',
    constraints: ['Item IDs are unique, nonempty, HTML-id-safe strings; titles and bodies are plain text.', 'Use stable item IDs for keys and open state, not array positions.'],
    starterCode: `export default function App({ items = [] }) {
  return <section>{items.map(item => <h3 key={item.id}><button type="button" id={'trigger-'+item.id} aria-controls={'panel-'+item.id} aria-expanded="false">{item.title}</button></h3>)}</section>;
}`,
    testCases: [
      uiCase('help-empty', 'Empty configuration has a useful state', [], [text('[data-testid="empty"]', 'No help articles')]),
      uiCase('help-collapsed', 'All answers initially collapsed', [], [attr('#trigger-a', 'aria-expanded', 'false'), count('[role="region"]', 0)], { items: [{ id: 'a', title: 'Delivery', body: 'Ships in two days' }] }),
      uiCase('help-open', 'Opening creates a labelled answer region', [click('#trigger-a')], [attr('#trigger-a', 'aria-expanded', 'true'), text('#panel-a', 'Ships in two days'), attr('#panel-a', 'aria-labelledby', 'trigger-a')], { items: [{ id: 'a', title: 'Delivery', body: 'Ships in two days' }] }),
      uiCase('help-exclusive', 'Opening another answer closes the first', [click('#trigger-a'), click('#trigger-b')], [count('#panel-a', 0), text('#panel-b', 'Contact support'), attr('#trigger-a', 'aria-expanded', 'false')], { items: [{ id: 'a', title: 'Delivery', body: 'Ships in two days' }, { id: 'b', title: 'Returns', body: 'Contact support' }] }),
      uiCase('help-toggle', 'Activating an open heading collapses it', [click('#trigger-a'), click('#trigger-a')], [count('[role="region"]', 0), attr('#trigger-a', 'aria-expanded', 'false')], { items: [{ id: 'a', title: 'Delivery', body: 'Ships in two days' }] }),
    ],
    hints: ['One open ID or null expresses the single-open invariant.', 'Derive aria-expanded from the same equality used to render the region.'],
    referenceSolution: { explanation: 'A single openId represents all possible states, preventing multiple panels from opening accidentally. Buttons retain native Enter/Space behavior. Stable IDs connect each heading and region through ARIA, and conditional rendering ensures closed answers are absent as specified. If content can change dynamically, derive open status from the current item set and keep IDs stable.', codeOrArtifact: `import { useState } from 'react';
export default function App({ items = [] }) {
  const [openId, setOpenId] = useState(null);
  if (!items.length) return <p data-testid="empty">No help articles</p>;
  return <section>{items.map(item => {
    const open = openId === item.id;
    return <article key={item.id}><h3><button type="button" id={'trigger-'+item.id} aria-controls={'panel-'+item.id} aria-expanded={open} onClick={() => setOpenId(old => old === item.id ? null : item.id)}>{item.title}</button></h3>
      {open && <div role="region" id={'panel-'+item.id} aria-labelledby={'trigger-'+item.id}>{item.body}</div>}</article>;
  })}</section>;
}` },
    commonMistakes: ['Keeping an independent open flag on each row, violating single-open behavior.', 'Rendering a visually hidden panel that still violates the specified DOM contract.'],
    followUpQuestions: [{ id: 'help-follow', question: 'When would you keep closed panels mounted?', expectedConcepts: ['State retention', 'Accessibility', 'Trade-offs'], sampleStrongAnswer: 'Mount retention is useful for expensive panels or preserving nested input state. Hide closed content with an appropriate semantic mechanism so its controls are not reachable while collapsed. That would be a deliberate contract change; this exercise explicitly removes closed regions.' }],
  }),
  exercise({
    id: 'react-ui-theme-switch', title: 'React UI: Scoped Appearance Switch',
    businessContext: 'An embedded workspace needs a theme control that affects only its own surface and does not mutate the host website.',
    problemStatement: 'Export App({ initialTheme = "light" }). Only initialTheme === "dark" starts dark; any other value starts light. Render a section [data-testid="surface"] with data-theme equal to the current theme. Render a button named Toggle appearance with aria-pressed true exactly in dark mode. Each activation toggles light/dark, updates [data-testid="current-theme"] to Light appearance or Dark appearance, and changes the surface foreground/background for readable contrast. Keep the theme local; do not write document.body, parent state, storage, or network.',
    constraints: ['Read the initial prop lazily when state is initialized; later user toggles are independent.', 'Use a native button and do not communicate mode through color alone.'],
    starterCode: `export default function App() {
  return <section data-testid="surface" data-theme="light"><button type="button" aria-label="Toggle appearance" aria-pressed="false">Toggle appearance</button>
    <p data-testid="current-theme">Light appearance</p></section>;
}`,
    testCases: [
      uiCase('theme-default', 'Light is the default appearance', [], [attr('[data-testid="surface"]', 'data-theme', 'light'), attr('button', 'aria-pressed', 'false')]),
      uiCase('theme-dark', 'Explicit dark configuration is respected', [], [attr('[data-testid="surface"]', 'data-theme', 'dark'), text('[data-testid="current-theme"]', 'Dark appearance')], { initialTheme: 'dark' }),
      uiCase('theme-invalid', 'Unknown initial values fall back to light', [], [attr('[data-testid="surface"]', 'data-theme', 'light')], { initialTheme: 'sepia' }),
      uiCase('theme-toggle', 'Toggling updates text and pressed state', [click('button')], [text('[data-testid="current-theme"]', 'Dark appearance'), attr('button', 'aria-pressed', 'true')]),
      uiCase('theme-twice', 'Two toggles restore light appearance', [click('button'), click('button')], [attr('[data-testid="surface"]', 'data-theme', 'light'), text('[data-testid="current-theme"]', 'Light appearance')]),
    ],
    hints: ['A boolean state is sufficient for two appearances.', 'Use the same boolean for accessible state, text, data attribute, and styles.'],
    referenceSolution: { explanation: 'Local state owns the appearance, initialized once from the supplied prop. A functional boolean update makes repeated activations reliable. Text and aria-pressed expose the same mode as the visual colors. Styling the section rather than the document avoids leaking an embedded component preference into unrelated application surfaces.', codeOrArtifact: `import { useState } from 'react';
export default function App({ initialTheme = 'light' }) {
  const [dark, setDark] = useState(() => initialTheme === 'dark');
  return <section data-testid="surface" data-theme={dark ? 'dark' : 'light'} style={{padding:16, background:dark ? '#18181b' : '#ffffff', color:dark ? '#fafafa' : '#18181b'}}>
    <button type="button" aria-label="Toggle appearance" aria-pressed={dark} onClick={() => setDark(old => !old)}>Toggle appearance</button>
    <p data-testid="current-theme">{dark ? 'Dark appearance' : 'Light appearance'}</p></section>;
}` },
    commonMistakes: ['Changing the global document class from an embedded component.', 'Keeping the pressed state and label out of sync with the actual appearance.'],
    followUpQuestions: [{ id: 'theme-follow', question: 'How would a product-wide persisted theme differ?', expectedConcepts: ['Provider', 'SSR', 'User preference'], sampleStrongAnswer: 'Centralize the preference in a theme provider, distinguish explicit preference from system appearance, and plan the server-rendered initial value to avoid a flash or hydration mismatch. Persist only the preference, with an account/device policy defined for the product.' }],
  }),
  exercise({
    id: 'react-ui-recipe-browser', title: 'React UI: Searchable Kitchen Cards',
    businessContext: 'A kitchen planning screen filters a small recipe list while retaining users’ selected dishes when they change their search.',
    problemStatement: 'Export App({ recipes = [] }). Each recipe has a unique string id, name, and category. Render a controlled Search recipes input and a Category select. All is the initial category; remaining options are unique category strings in first-seen order. Filter by trimmed, case-insensitive name substring AND exact selected category. Render visible recipes as li elements in [data-testid="recipes"], each showing its name and a native toggle button named Select NAME or Deselect NAME. Track selection by ID across filtering. [data-testid="selected-count"] contains the selected count as digits. No matches shows No matching recipes in [data-testid="empty"]. Do not mutate recipes.',
    constraints: ['Input recipe fields are valid strings; IDs are unique. All is reserved for the aggregate option.', 'Selections persist when hidden by filtering; a second activation deselects the same ID.'],
    starterCode: `export default function App({ recipes = [] }) {
  return <section><label>Search recipes <input /></label><label>Category <select><option>All</option></select></label>
    <ul data-testid="recipes">{recipes.map(r => <li key={r.id}>{r.name}<button type="button" aria-label={'Select '+r.name}>Select</button></li>)}</ul>
    <output data-testid="selected-count">0</output></section>;
}`,
    testCases: [
      uiCase('recipe-empty', 'An empty dataset renders a useful state', [], [count('[data-testid="recipes"] li', 0), text('[data-testid="empty"]', 'No matching recipes'), text('[data-testid="selected-count"]', '0')]),
      uiCase('recipe-search', 'Name search trims and ignores case', [input('input', '  SOUP ')], [count('[data-testid="recipes"] li', 1), count('select option', 3)], { recipes: [{ id: 's', name: 'Tomato Soup', category: 'Lunch' }, { id: 'p', name: 'Pancakes', category: 'Breakfast' }] }),
      uiCase('recipe-category', 'Category combines with name search', [input('select', 'Lunch'), input('input', 'cake')], [count('[data-testid="recipes"] li', 0), text('[data-testid="empty"]', 'No matching recipes')], { recipes: [{ id: 's', name: 'Soup', category: 'Lunch' }, { id: 'p', name: 'Pancakes', category: 'Breakfast' }] }),
      uiCase('recipe-selection', 'Selection survives hiding and restoring a row', [click('[aria-label="Select Soup"]'), input('input', 'unmatched'), input('input', '')], [text('[data-testid="selected-count"]', '1'), count('[aria-label="Deselect Soup"]', 1)], { recipes: [{ id: 's', name: 'Soup', category: 'Lunch' }] }),
      uiCase('recipe-deselect', 'Selecting a dish twice toggles it off', [click('[aria-label="Select Soup"]'), click('[aria-label="Deselect Soup"]')], [text('[data-testid="selected-count"]', '0')], { recipes: [{ id: 's', name: 'Soup', category: 'Lunch' }] }),
    ],
    hints: ['Derive visible rows from recipes, query, and category; do not store a filtered copy in state.', 'Store selected IDs independently of the visible rows.'],
    referenceSolution: { explanation: 'Filtering is a derived view over immutable props. A separate ID list tracks selection, so a search cannot accidentally delete hidden choices. Unique category options are built in first-seen order. Functional selection updates support predictable toggles, and accessible button names identify the dish and its next action. A large remote catalog would require a separate query, pagination, and consistency policy.', codeOrArtifact: `import { useState } from 'react';
export default function App({ recipes = [] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState([]);
  const categories = [...new Set(recipes.map(r => r.category))];
  const visible = recipes.filter(r => r.name.toLowerCase().includes(query.trim().toLowerCase()) && (category === 'All' || r.category === category));
  function toggle(id) { setSelected(old => old.includes(id) ? old.filter(item => item !== id) : [...old, id]); }
  return <section><label>Search recipes <input value={query} onChange={e => setQuery(e.target.value)} /></label>
    <label>Category <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
    <ul data-testid="recipes">{visible.map(r => <li key={r.id}>{r.name}<button type="button" aria-label={(selected.includes(r.id) ? 'Deselect ' : 'Select ')+r.name} onClick={() => toggle(r.id)}>{selected.includes(r.id) ? 'Deselect' : 'Select'}</button></li>)}</ul>
    {!visible.length && <p data-testid="empty">No matching recipes</p>}<output data-testid="selected-count">{selected.length}</output></section>;
}` },
    commonMistakes: ['Discarding selection whenever a recipe is filtered out.', 'Mutating props or using the visible row index as recipe identity.'],
    followUpQuestions: [{ id: 'recipe-follow', question: 'What if selected recipes disappear from a refreshed dataset?', expectedConcepts: ['Identity', 'Reconciliation policy'], sampleStrongAnswer: 'Choose an explicit product policy: retain unavailable selections with a warning or reconcile them against authoritative IDs. Do not silently lose choices merely because a search response omits them; distinguish filtering from actual deletion.' }],
  }),
];
