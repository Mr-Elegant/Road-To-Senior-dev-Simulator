# Reference: Accessible ARIA 1.2 Enterprise Multi-Select Combobox

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The WAI-ARIA 1.2 Combobox pattern requires:\n1. An input with role=\"combobox\", aria-expanded, aria-haspopup=\"listbox\", aria-controls=\"listbox-id\", and aria-autocomplete.\n2. When the popup opens, focus remains inside the text input so typing continues uninterrupted.\n3. Virtual focus is conveyed via 'aria-activedescendant=\"opt-[id]\"', where the input references the ID of the currently highlighted list item.\n4. ArrowDown/Up moves virtual focus without scrolling the page. Enter selects the highlighted item and closes. Escape closes without selecting.",
    "codeOrArtifact": "export function AccessibleCombobox({ options, onSelect }) {\n  const [isOpen, setIsOpen] = useState(false);\n  const [activeIndex, setActiveIndex] = useState(-1);\n  const [query, setQuery] = useState('');\n\n  const activeOptionId = activeIndex >= 0 && options[activeIndex] \n    ? `option-${options[activeIndex].id}` \n    : undefined;\n\n  const handleKeyDown = (e) => {\n    if (e.key === 'ArrowDown') {\n      e.preventDefault();\n      if (!isOpen) setIsOpen(true);\n      setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));\n    } else if (e.key === 'ArrowUp') {\n      e.preventDefault();\n      if (!isOpen) setIsOpen(true);\n      setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));\n    } else if (e.key === 'Enter') {\n      e.preventDefault();\n      if (isOpen && activeIndex >= 0) {\n        onSelect(options[activeIndex]);\n        setIsOpen(false);\n      }\n    } else if (e.key === 'Escape') {\n      setIsOpen(false);\n      setActiveIndex(-1);\n    }\n  };\n\n  return (\n    <div>\n      <input\n        role=\"combobox\"\n        aria-expanded={isOpen}\n        aria-haspopup=\"listbox\"\n        aria-controls=\"combobox-options-list\"\n        aria-activedescendant={activeOptionId}\n        value={query}\n        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}\n        onKeyDown={handleKeyDown}\n      />\n      {isOpen && (\n        <ul id=\"combobox-options-list\" role=\"listbox\">\n          {options.map((opt, i) => (\n            <li\n              key={opt.id}\n              id={`option-${opt.id}`}\n              role=\"option\"\n              aria-selected={activeIndex === i}\n            >\n              {opt.label}\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}"
  },
  "rubric": [
    {
      "id": "rb-aria-semantics",
      "category": "code_quality",
      "label": "WAI-ARIA Combobox Semantics",
      "description": "Implements aria-expanded, aria-controls, role=\"combobox\", aria-activedescendant.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Full WAI-ARIA 1.2 spec compliance, flawless virtual focus."
        },
        {
          "score": 2,
          "description": "Basic keyboard handling but missing aria-activedescendant."
        },
        {
          "score": 0,
          "description": "Not accessible."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Radix UI Primitives, Headless UI, or Downshift for battle-tested accessible combobox state machines."
  ],
  "commonMistakes": [
    "Moving physical DOM focus (.focus()) to the list item on ArrowDown, preventing the user from typing more characters.",
    "Missing aria-expanded=\"false\" when closed."
  ],
  "followUps": [
    {
      "id": "react-fq-4",
      "question": "Why is aria-activedescendant preferred over moving physical document.activeElement focus into the dropdown list?",
      "expectedConcepts": [
        "Keeps text caret active in input",
        "Allows uninterrupted typing and filtering",
        "Virtual focus paradigm"
      ],
      "sampleStrongAnswer": "With aria-activedescendant, the browser maintains physical focus inside the `<input>`. This allows the user to continue typing or editing text without interruption, while assistive technologies (screen readers) announce the highlighted option as if focus moved to it."
    }
  ]
}
```
