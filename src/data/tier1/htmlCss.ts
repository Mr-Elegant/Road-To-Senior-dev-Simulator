import { Tier1Question } from '@/types/tier1';

export const htmlCssQuestions: Tier1Question[] = [
  {
    id: 't1-hc-01',
    title: 'What is semantic HTML and why is it important?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 1,
    expectedConcepts: [
      'Meaning of tags (<header>, <nav>, <main>, <article>, <section>, <footer>)',
      'Accessibility and screen readers',
      'Search Engine Optimization (SEO)',
      'Readability and maintainability over generic <div>',
    ],
    shortReferenceAnswer:
      'Semantic HTML means using HTML markup that clearly reinforces the meaning and role of information on a webpage, rather than just defining its appearance with generic `<div>` and `<span>` tags. Examples include `<header>`, `<nav>`, `<main>`, `<article>`, and `<footer>`. Semantic tags allow screen readers to navigate content accurately for visually impaired users, improve search engine indexing, and make code cleaner to maintain.',
    practicalExample: `<!-- Non-semantic approach -->
<div class="header">
  <div class="nav-links"><a href="/">Home</a></div>
</div>

<!-- Semantic approach -->
<header>
  <nav aria-label="Main Navigation">
    <a href="/">Home</a>
  </nav>
</header>`,
    optionalFollowUp: {
      question: 'What is the difference between <section> and <article>?',
      expectedAnswer:
        '<article> represents independent, self-contained content that makes sense on its own (like a blog post or news card), while <section> groups related thematic content, usually with a heading.',
    },
    hints: [
      'Why would a blind user using a screen reader benefit from tags like <nav> or <button>?',
      'Compare a generic <div> with an element that describes its purpose.',
    ],
  },
  {
    id: 't1-hc-02',
    title: 'How do HTML forms work, and why should inputs always have associated labels?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 2,
    expectedConcepts: [
      'The <form> element (action, method attributes)',
      'Input types (text, email, password, checkbox, radio, submit)',
      'Label pairing with id and htmlFor/for',
      'Usability and touch target increase',
    ],
    shortReferenceAnswer:
      'The `<form>` element collects user input and specifies submission destinations via `action` and HTTP methods (`GET` or `POST`). Inputs should always be paired with `<label>` elements using the `for` attribute (or `htmlFor` in React) matching the input’s `id`. This enables screen readers to announce what the input is for and improves usability by letting users click the label text to focus or toggle the input.',
    practicalExample: `<form action="/api/login" method="POST">
  <div class="form-group">
    <!-- Clicking the label focuses the input -->
    <label for="user-email">Email Address</label>
    <input 
      type="email" 
      id="user-email" 
      name="email" 
      required 
      placeholder="you@example.com"
    />
  </div>
  <button type="submit">Log In</button>
</form>`,
    optionalFollowUp: {
      question: 'What happens when a form button with no type attribute is clicked inside a form?',
      expectedAnswer:
        'By default, inside a <form>, an unspecified button defaults to type="submit", which will trigger form submission and a page refresh unless preventDefault() is called.',
    },
    hints: [
      'How does clicking on the label text help mobile users?',
      'Which attribute connects a label to an input’s id?',
    ],
    codingExercise: {
      instruction:
        'Write the HTML markup for an accessible text input for "Username" with an associated label.',
      starterCode: `<!-- Write a <label> and <input> correctly connected -->
`,
      solutionCode: `<label for="username">Username</label>
<input type="text" id="username" name="username" required />`,
      language: 'html',
      expectedOutput: 'Connected label with for="username" and input with id="username"',
    },
  },
  {
    id: 't1-hc-03',
    title: 'How does CSS specificity work and what are the main selector types?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 3,
    expectedConcepts: [
      'Type (element) selector (p, div, h1)',
      'Class selector (.button, .card)',
      'ID selector (#navbar, #hero)',
      'Inline styles and !important',
      'Specificity hierarchy: Inline > ID > Class/Attribute/Pseudo-class > Element',
    ],
    shortReferenceAnswer:
      'CSS specificity determines which style rule takes precedence when multiple conflicting declarations target the same element. Specificity is calculated as a hierarchy: Inline styles have highest weight, followed by ID selectors (`#id`), then class/pseudo-class/attribute selectors (`.class`, `:hover`, `[type="text"]`), and finally element selectors (`div`, `p`). If specificity is equal, the rule appearing latest in the stylesheet wins.',
    practicalExample: `/* Specificity: 0-0-1 */
p { color: black; }

/* Specificity: 0-1-0 (Wins over element) */
.intro-text { color: blue; }

/* Specificity: 1-0-0 (Wins over class) */
#main-banner { color: red; }`,
    optionalFollowUp: {
      question: 'Why is using !important generally considered a bad practice in CSS?',
      expectedAnswer:
        '!important overrides the normal cascade and specificity hierarchy, making styles difficult to maintain, debug, and override cleanly later.',
    },
    hints: [
      'Which is more specific: an ID like #header or a class like .header?',
      'If two rules have the exact same specificity, which one applies?',
    ],
  },
  {
    id: 't1-hc-04',
    title: 'What is the CSS Box Model and what does box-sizing: border-box do?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 4,
    expectedConcepts: [
      'Four layers: Content, Padding, Border, Margin',
      'content-box default behavior adding padding/border to width',
      'border-box keeping total width constant',
    ],
    shortReferenceAnswer:
      'The CSS Box Model is the container structure wrapping every HTML element, composed of: **Content** (text/image), **Padding** (transparent space inside the border), **Border** (outer boundary), and **Margin** (space outside the border). By default (`content-box`), adding padding and borders expands the rendered width beyond the declared `width`. Setting `box-sizing: border-box` ensures that padding and borders are included *inside* the declared width, making layout sizing predictable.',
    practicalExample: `/* Universal box-sizing reset */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* With border-box, total rendered width remains exactly 200px. */
  /* With default content-box, total width would be 250px (200 + 40 + 10). */
}`,
    optionalFollowUp: {
      question: 'What is margin collapsing in CSS?',
      expectedAnswer:
        'When vertical margins of two adjacent block elements touch, they combine into a single margin equal to the larger of the two, rather than adding together.',
    },
    hints: [
      'Name the 4 parts from the innermost text to the outermost space.',
      'Why would a 100px wide box with 10px padding become 120px wide without border-box?',
    ],
  },
  {
    id: 't1-hc-05',
    title: 'What is Flexbox and what are its core container and item properties?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 5,
    expectedConcepts: [
      'One-dimensional layout (row or column)',
      'display: flex and flex-direction',
      'justify-content (main axis alignment)',
      'align-items (cross axis alignment)',
      'flex-grow, flex-shrink, flex-wrap',
    ],
    shortReferenceAnswer:
      'Flexbox (Flexible Box Layout) is a one-dimensional CSS layout model designed for distributing space and aligning items along a single axis (either row or column). The container sets `display: flex`. Key container properties include `flex-direction` (row/column), `justify-content` (aligns along main axis), and `align-items` (aligns along perpendicular cross axis). Child items can use `flex: 1` (`flex-grow: 1`) to expand and fill available remaining space.',
    practicalExample: `.navbar {
  display: flex;
  justify-content: space-between; /* Pushes brand to left, menu to right */
  align-items: center;            /* Centers vertically */
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;                    /* Modern gap spacing between flex items */
}`,
    optionalFollowUp: {
      question: 'If flex-direction is set to column, what does justify-content align?',
      expectedAnswer:
        'When flex-direction is column, the main axis becomes vertical, so justify-content aligns items vertically (top, center, bottom).',
    },
    hints: [
      'Is Flexbox intended for 1-dimensional or 2-dimensional layouts?',
      'Which property aligns items horizontally in a standard row flex container?',
    ],
    codingExercise: {
      instruction:
        'Write CSS for a .container that uses Flexbox to center its child item both horizontally and vertically.',
      starterCode: `.container {
  display: flex;
  /* Add alignment properties here */
}`,
      solutionCode: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
      language: 'css',
      expectedOutput: 'justify-content: center and align-items: center',
    },
  },
  {
    id: 't1-hc-06',
    title: 'What is CSS Grid and when would you choose it over Flexbox?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 6,
    expectedConcepts: [
      'Two-dimensional layout (rows AND columns simultaneously)',
      'grid-template-columns and grid-template-rows',
      'repeat() and fractional units (fr)',
      'Choosing Flexbox (content-driven / 1D) vs Grid (layout-driven / 2D page templates)',
    ],
    shortReferenceAnswer:
      'CSS Grid is a two-dimensional layout system that allows placing elements into structured rows and columns simultaneously. While Flexbox is ideal for single-axis linear components (like navbars or button groups), CSS Grid is ideal for overall page page layouts, card galleries, and complex dashboards where alignment across both horizontal and vertical axes is required.',
    practicalExample: `.card-grid {
  display: grid;
  /* Responsive columns that auto-fit with minimum 250px width */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    optionalFollowUp: {
      question: 'What does the fr unit mean in CSS Grid?',
      expectedAnswer:
        'The fr unit represents a fraction of the available free space in the grid container after fixed tracks are allocated.',
    },
    hints: [
      'How many dimensions can Flexbox control at once versus Grid?',
      'What unit divides remaining space into fractions?',
    ],
  },
  {
    id: 't1-hc-07',
    title: 'How do you create a responsive web design using media queries?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 7,
    expectedConcepts: [
      'Viewport meta tag (<meta name="viewport" content="width=device-width, initial-scale=1.0">)',
      'CSS Media Queries (@media)',
      'Mobile-first design principles (min-width)',
      'Fluid layouts and responsive images',
    ],
    shortReferenceAnswer:
      'Responsive Web Design ensures websites render well on all screen sizes (mobile, tablet, desktop). It requires the viewport `<meta>` tag so mobile browsers render at device scale, fluid CSS widths (percentages, flexbox, grid), and `@media` queries that apply specific styles when screen width exceeds or drops below target breakpoints. Modern best practice is **mobile-first**, styling mobile defaults first and adding desktop enhancements using `min-width` queries.',
    practicalExample: `/* Mobile default (1 column) */
.content-wrapper {
  display: flex;
  flex-direction: column;
}

/* Tablet & Desktop (switches to row above 768px) */
@media (min-width: 768px) {
  .content-wrapper {
    flex-direction: row;
  }
}`,
    optionalFollowUp: {
      question: 'What happens on mobile phones if you omit the viewport meta tag from the HTML <head>?',
      expectedAnswer:
        'Mobile browsers will assume a standard desktop viewport (usually around 980px) and scale the entire desktop page down, rendering text tiny and illegible.',
    },
    hints: [
      'What CSS @-rule is used to check device width?',
      'Why is mobile-first (min-width) preferred over desktop-first (max-width)?',
    ],
  },
  {
    id: 't1-hc-08',
    title: 'What is the difference between px, rem, em, and % units in CSS?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 8,
    expectedConcepts: [
      'Absolute units (px: fixed pixels on screen)',
      'rem (root em: relative to root <html> font-size, default 16px)',
      'em (relative to parent element font-size)',
      'Percentage (%: relative to parent dimension)',
      'Accessibility benefits of rem for user browser zoom/text-resizing',
    ],
    shortReferenceAnswer:
      '`px` is an absolute unit representing physical display pixels. `rem` (root em) is relative to the root `<html>` element’s font size (1rem = 16px by default), making typography and spacing scale gracefully when users change their browser font settings for accessibility. `em` is relative to the font-size of its immediate parent element (which can compound). `%` is relative to the parent container’s size.',
    practicalExample: `/* If root font-size is 16px */
h1 {
  font-size: 2rem; /* 32px */
  margin-bottom: 1rem; /* 16px */
}

.parent {
  font-size: 20px;
}
.child {
  font-size: 1.5em; /* 30px (1.5 * 20px) */
}`,
    optionalFollowUp: {
      question: 'Why do modern design systems recommend rem for typography instead of px?',
      expectedAnswer:
        'Because if a visually impaired user increases their browser default font size from 16px to 24px, rem values automatically scale up proportionally, whereas px values remain locked and ignore user preferences.',
    },
    hints: [
      'Which unit references the root <html> font size?',
      'Which unit is absolute and ignores browser zoom preferences?',
    ],
  },
  {
    id: 't1-hc-09',
    title: 'How do the different CSS position values work (static, relative, absolute, fixed, sticky)?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 9,
    expectedConcepts: [
      'static: Default normal document flow',
      'relative: Positioned relative to normal position, creates reference frame for children',
      'absolute: Removed from flow, positioned relative to nearest positioned ancestor',
      'fixed: Positioned relative to browser viewport, stays on screen during scroll',
      'sticky: Toggles between relative and fixed depending on scroll threshold',
    ],
    shortReferenceAnswer:
      '`position: static` is the default where elements follow normal document flow. `relative` keeps the element in flow but allows shifting via `top/left` and acts as a coordinate anchor for `absolute` children. `absolute` pulls the element out of normal flow, positioning it relative to its closest non-static parent. `fixed` locks the element relative to the browser viewport so it stays visible while scrolling. `sticky` acts relatively until a scroll threshold is met, then locks in place like fixed.',
    practicalExample: `/* Parent anchor */
.card {
  position: relative;
  width: 300px;
  height: 200px;
}

/* Badge pinned to top-right corner of card */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Sticky header */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
}`,
    optionalFollowUp: {
      question: 'What is required for position: sticky to work properly?',
      expectedAnswer:
        'A threshold position must be specified (such as top: 0), and none of the parent elements in the hierarchy can have overflow: hidden.',
    },
    hints: [
      'Which position value pulls an element completely out of the document flow?',
      'What position must a parent have so its absolute child stays inside it?',
    ],
  },
  {
    id: 't1-hc-10',
    title: 'What are the most reliable modern ways to center an element in CSS?',
    category: 'HTML and CSS',
    difficulty: 'Beginner',
    tier: 'tier-1',
    order: 10,
    expectedConcepts: [
      'Flexbox centering (justify-content: center; align-items: center;)',
      'CSS Grid centering (display: grid; place-items: center;)',
      'Margin auto centering for block elements with defined width',
    ],
    shortReferenceAnswer:
      'The two modern and reliable methods are: 1) **Flexbox** on the parent container (`display: flex; justify-content: center; align-items: center;`), and 2) **CSS Grid** on the parent container (`display: grid; place-items: center;`), which centers the child both horizontally and vertically in just two lines of CSS. For simple horizontal centering of a block element with a fixed width, `margin: 0 auto;` can also be used.',
    practicalExample: `/* Modern Grid One-Liner Centering */
.modal-overlay {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

/* Flexbox Centering */
.hero-banner {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
    optionalFollowUp: {
      question: 'Can margin: auto center an item vertically inside a flex container?',
      expectedAnswer:
        'Yes! Inside a flex container with height, setting margin: auto on the flex child centers it both horizontally and vertically.',
    },
    hints: [
      'What two-word CSS Grid shorthand combines align-items and justify-items into one line?',
      'What flex properties handle horizontal and vertical alignment?',
    ],
    codingExercise: {
      instruction:
        'Use CSS Grid to write a single rule on .center-box that centers all its content both horizontally and vertically.',
      starterCode: `.center-box {
  display: grid;
  /* Add place-items shorthand here */
}`,
      solutionCode: `.center-box {
  display: grid;
  place-items: center;
}`,
      language: 'css',
      expectedOutput: 'place-items: center',
    },
  },
];

