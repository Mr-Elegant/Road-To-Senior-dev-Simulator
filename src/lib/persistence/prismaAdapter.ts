import { UserProgressData, AttemptSubmission } from '@/types/userProgress';
import { Tier1ProgressData, Tier1Attempt } from '@/types/tier1';
import { StorageAdapter } from './storageAdapter';

/**
 * PrismaStorageAdapter implements StorageAdapter for PostgreSQL persistence.
 * Allows seamless drop-in transition from LocalStorageAdapter to PostgreSQL.
 */
export class PrismaStorageAdapter implements StorageAdapter {
  private userId: string;

  constructor(userId: string = 'default-user') {
    this.userId = userId;
  }

  async getProgress(): Promise<UserProgressData> {
    try {
      const res = await fetch(`/api/progress?userId=${encodeURIComponent(this.userId)}`);
      if (!res.ok) throw new Error('Failed to fetch remote progress');
      return await res.json();
    } catch (e) {
      console.warn('Prisma remote storage unavailable, falling back to empty state', e);
      return {
        attempts: [],
        bookmarkedScenarioIds: [],
        streakDays: 0,
        lastActiveDate: '',
        customNotes: {},
      };
    }
  }

  async saveAttempt(attempt: AttemptSubmission): Promise<UserProgressData> {
    const res = await fetch('/api/progress/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId, attempt }),
    });
    if (!res.ok) throw new Error('Failed to persist attempt');
    return await res.json();
  }

  async toggleBookmark(scenarioId: string): Promise<string[]> {
    const res = await fetch('/api/progress/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId, scenarioId }),
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    const data = await res.json();
    return data.bookmarkedScenarioIds;
  }

  async saveNotes(scenarioId: string, notes: string): Promise<void> {
    await fetch('/api/progress/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId, scenarioId, notes }),
    });
  }

  async exportProgressJson(): Promise<string> {
    const progress = await this.getProgress();
    return JSON.stringify(progress, null, 2);
  }

  async importProgressJson(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      const res = await fetch('/api/progress/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.userId, progress: parsed }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async resetProgress(): Promise<void> {
    await fetch(`/api/progress/reset?userId=${encodeURIComponent(this.userId)}`, {
      method: 'DELETE',
    });
  }

  // Tier 1 Beginner Track methods
  async getTier1Progress(): Promise<Tier1ProgressData> {
    try {
      const res = await fetch(`/api/progress/tier1?userId=${encodeURIComponent(this.userId)}`);
      if (!res.ok) throw new Error('Failed to fetch tier1 progress');
      return await res.json();
    } catch {
      return {
        attempts: [],
        bookmarkedQuestionIds: [],
        lastActiveDate: '',
        totalScore: 0,
      };
    }
  }

  async saveTier1Attempt(attempt: Tier1Attempt): Promise<Tier1ProgressData> {
    const res = await fetch('/api/progress/tier1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId, attempt }),
    });
    if (!res.ok) throw new Error('Failed to save tier1 attempt');
    return await res.json();
  }

  async toggleTier1Bookmark(questionId: string): Promise<string[]> {
    const res = await fetch('/api/progress/tier1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId, bookmarkQuestionId: questionId }),
    });
    if (!res.ok) throw new Error('Failed to toggle tier1 bookmark');
    const data = await res.json();
    return data.bookmarkedQuestionIds;
  }

  async resetTier1Progress(): Promise<void> {
    await fetch(`/api/progress/reset?userId=${encodeURIComponent(this.userId)}`, {
      method: 'DELETE',
    });
  }
}
