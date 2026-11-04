# Reference: Check upload count, size and MIME type

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Admission order makes error reporting deterministic. MIME metadata and filenames are caller claims; this policy is not content inspection. Apply transport limits before materializing large bodies, then use server-owned object keys and content checks.",
    "codeOrArtifact": "function solution({files,maxBytes,allowed}){const accepted=[],rejected=[];for(const file of files){if(file.size>maxBytes)rejected.push({name:file.name,reason:'size'});else if(!allowed.includes(file.type))rejected.push({name:file.name,reason:'type'});else accepted.push(file.name);}return {accepted,rejected};}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-upload-admission-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {files,maxBytes,allowed}; files has {name,size,type}, size is a nonnegative integer; allowed is a MIME string array. Return {accepted,rejected}, preserving input order. Reject size>maxBytes as size before checking MIME as type. Empty batches are allowed. Only names are returned.",
      "weight": 5,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-upload-admission-testing",
      "category": "testing",
      "label": "Evidence and counterexamples",
      "description": "Show the authored boundary cases and distinguish policy-model evidence from real Next.js runtime evidence.",
      "weight": 4,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-upload-admission-security",
      "category": "security",
      "label": "Isolation and trust boundaries",
      "description": "Explain caller validation, data exposure, authorization and the limits relevant to this task.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-upload-admission-tradeoffs",
      "category": "tradeoffs",
      "label": "Versions and operational trade-offs",
      "description": "Explain the 15/16 behavior, configuration assumptions, rollout and the interview variation.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    }
  ],
  "alternatives": [
    "Prefer a short-lived, scoped direct-to-object-storage upload flow with authenticated admission, server-side completion verification, quotas and asynchronous scanning. Keep secrets and unrestricted storage keys off the client."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-upload-admission-extension",
      "question": "Would you upload large videos through a serverless Route Handler?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "Prefer a short-lived, scoped direct-to-object-storage upload flow with authenticated admission, server-side completion verification, quotas and asynchronous scanning. Keep secrets and unrestricted storage keys off the client."
    }
  ]
}
```
