import { describe, it, expect } from 'vitest';
import { allScenarios } from '@/data';

describe('Engineering Scenario Library Validation Suite', () => {
  it('contains at least 40 complete scenarios in the initial library', () => {
    expect(allScenarios.length).toBeGreaterThanOrEqual(40);
  });

  it('guarantees every scenario has a unique ID', () => {
    const ids = new Set<string>();
    for (const scenario of allScenarios) {
      expect(ids.has(scenario.id), `Duplicate scenario ID detected: ${scenario.id}`).toBe(false);
      ids.add(scenario.id);
    }
  });

  it('verifies all required fields and pedagogical assets are complete without placeholder text', () => {
    const prohibitedPlaceholders = ['TODO', 'TBD', 'Lorem ipsum', 'sample text', 'placeholder'];

    for (const s of allScenarios) {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.topic).toBeTruthy();
      expect(s.subtopic).toBeTruthy();
      expect(s.difficulty).toBeTruthy();
      expect(s.estimatedMinutes).toBeGreaterThan(0);

      // Business Context & Problem Statement
      expect(s.businessContext.length, `Scenario ${s.id} businessContext too brief`).toBeGreaterThan(30);
      expect(s.problemStatement.length, `Scenario ${s.id} problemStatement too brief`).toBeGreaterThan(30);

      // Constraints & Candidate Tasks
      expect(s.constraints.length, `Scenario ${s.id} must have constraints`).toBeGreaterThanOrEqual(2);
      expect(s.candidateTasks.length, `Scenario ${s.id} must have tasks`).toBeGreaterThanOrEqual(2);

      // Pedagogical assets
      expect(s.hints.length, `Scenario ${s.id} must have progressive hints`).toBeGreaterThanOrEqual(2);
      expect(s.rubric.length, `Scenario ${s.id} must have rubric criteria`).toBeGreaterThanOrEqual(1);
      expect(s.referenceSolution.explanation.length, `Scenario ${s.id} missing reference solution explanation`).toBeGreaterThan(50);
      expect(s.alternativeApproaches.length, `Scenario ${s.id} missing alternative approaches`).toBeGreaterThanOrEqual(1);
      expect(s.commonMistakes.length, `Scenario ${s.id} missing common mistakes`).toBeGreaterThanOrEqual(1);
      expect(s.followUpQuestions.length, `Scenario ${s.id} missing follow-up questions`).toBeGreaterThanOrEqual(1);

      // Check placeholder prohibitions
      for (const phrase of prohibitedPlaceholders) {
        // Todo List is a legitimate topic name; unfinished TODO/TBD markers remain prohibited.
        if (phrase === 'TODO' || phrase === 'TBD') {
          expect(s.businessContext).not.toContain(phrase);
          expect(s.problemStatement).not.toContain(phrase);
        } else {
          expect(s.businessContext.toLowerCase()).not.toContain(phrase.toLowerCase());
          expect(s.problemStatement.toLowerCase()).not.toContain(phrase.toLowerCase());
        }
      }
    }
  });

  it('verifies that each challenge type contains its respective specialized data structure', () => {
    for (const s of allScenarios) {
      if (s.type === 'incident') {
        expect(s.incidentTelemetry, `Incident ${s.id} must have telemetry`).toBeDefined();
        expect(s.incidentTelemetry!.logs.length).toBeGreaterThan(0);
        expect(s.incidentTelemetry!.metrics.length).toBeGreaterThan(0);
      }
      if (s.type === 'code_review') {
        expect(s.codeReviewFiles, `Code Review ${s.id} must have files`).toBeDefined();
        expect(s.codeReviewFiles!.length).toBeGreaterThan(0);
      }
      if (s.type === 'system_design') {
        expect(s.systemDesignReqs, `System Design ${s.id} must have requirements`).toBeDefined();
        expect(s.systemDesignReqs!.functional.length).toBeGreaterThan(0);
      }
    }
  });
});

