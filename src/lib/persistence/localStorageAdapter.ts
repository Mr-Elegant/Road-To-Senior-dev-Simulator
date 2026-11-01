import { UserProgressData, AttemptSubmission } from '@/types/userProgress';
import { Tier1ProgressData, Tier1Attempt } from '@/types/tier1';
import { SqlTrackProgressData, SqlAttempt, SqlTierLevel } from '@/types/sqlTrack';
import { StorageAdapter } from './storageAdapter';
import { mergeProgress, progressSchema } from './progressMerge';

const STORAGE_KEY = 'fullstack_interview_lab_progress_v1';
const TIER1_STORAGE_KEY = 'fullstack_interview_lab_tier1_v1';
const SQL_STORAGE_KEY = 'fullstack_interview_lab_sql_v1';

const DEFAULT_TIER1_PROGRESS: Tier1ProgressData = {
  attempts: [],
  bookmarkedQuestionIds: [],
  lastActiveDate: '',
  totalScore: 0,
};

const DEFAULT_TIER_PROGRESS = {
  attempts: [],
  completedQuestionIds: [],
  bookmarkedQuestionIds: [],
  averageScore: 0,
};

const DEFAULT_SQL_PROGRESS: SqlTrackProgressData = {
  tier1: { ...DEFAULT_TIER_PROGRESS },
  tier2: { ...DEFAULT_TIER_PROGRESS },
  tier3: { ...DEFAULT_TIER_PROGRESS },
  tier4: { ...DEFAULT_TIER_PROGRESS },
  lastActiveDate: '',
  totalQuestionsCompleted: 0,
};

const DEFAULT_PROGRESS: UserProgressData = {
  attempts: [],
  bookmarkedScenarioIds: [],
  streakDays: 0,
  lastActiveDate: '',
  customNotes: {},
  tier1Progress: { ...DEFAULT_TIER1_PROGRESS },
  sqlProgress: { ...DEFAULT_SQL_PROGRESS },
};

export class LocalStorageAdapter implements StorageAdapter {
  private inMemoryFallback: UserProgressData = { ...DEFAULT_PROGRESS };
  private tier1Fallback: Tier1ProgressData = { ...DEFAULT_TIER1_PROGRESS };
  private sqlFallback: SqlTrackProgressData = { ...DEFAULT_SQL_PROGRESS };
  private accountId: string | null = null;
  private pendingSync: Promise<void> = Promise.resolve();

  public setAccount(userId: string | null): void { this.accountId = userId; }
  public scopedKey(key: string): string { return this.accountId ? `${key}:user:${this.accountId}` : key; }
  public getAccountId(): string | null { return this.accountId; }

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Non-blocking background sync to PostgreSQL via Next.js route handlers
   */
  private async syncToRemote(endpoint: string, body?: any, method: string = 'POST'): Promise<void> {
    if (!this.isClient() || !this.accountId) return;
    const accountId = this.accountId;
    this.pendingSync = this.pendingSync.then(async () => {
      if (this.accountId !== accountId) return;
      try {
        const response = await fetch(endpoint, {
          method, headers: { 'Content-Type': 'application/json' },
          body: body === undefined || body === null ? undefined : JSON.stringify(body),
        });
        if (!response.ok) window.dispatchEvent(new CustomEvent('progress-sync-error', { detail: response.status === 401 ? 'Your session expired. Sign in again to sync. Your work is still saved on this device.' : 'Cloud sync failed. Your work is still saved on this device. Retry from Settings.' }));
      } catch {
        window.dispatchEvent(new CustomEvent('progress-sync-error', { detail: 'You are offline. Your work is still saved on this device.' }));
      }
    });
    return this.pendingSync;
  }

  private calculateStreak(lastActive: string, currentStreak: number): { streak: number; today: string } {
    const today = new Date().toISOString().split('T')[0];
    if (!lastActive) {
      return { streak: 1, today };
    }

    if (lastActive === today) {
      return { streak: Math.max(1, currentStreak), today };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive === yesterday) {
      return { streak: currentStreak + 1, today };
    }

    // Missed more than 1 day
    return { streak: 1, today };
  }

  async getProgress(): Promise<UserProgressData> {
    if (!this.isClient()) {
      return {
        ...this.inMemoryFallback,
        tier1Progress: this.tier1Fallback,
      };
    }

    try {
      const raw = window.localStorage.getItem(this.scopedKey(STORAGE_KEY));
      if (!raw) {
        return DEFAULT_PROGRESS;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return DEFAULT_PROGRESS;
      }
      const tier1 = await this.getTier1Progress();
      const sqlProgress = await this.getSqlProgress();

      return {
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
        bookmarkedScenarioIds: Array.isArray(parsed.bookmarkedScenarioIds) ? parsed.bookmarkedScenarioIds : [],
        streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : 0,
        lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : '',
        customNotes: parsed.customNotes && typeof parsed.customNotes === 'object' ? parsed.customNotes : {},
        tier1Progress: tier1,
        sqlProgress,
      };
    } catch (e) {
      console.error('Failed to parse progress from localStorage:', e);
      return DEFAULT_PROGRESS;
    }
  }

  private save(data: UserProgressData): void {
    if (this.isClient()) {
      try {
        window.localStorage.setItem(this.scopedKey(STORAGE_KEY), JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    } else {
      this.inMemoryFallback = data;
    }
  }

  async saveAttempt(attempt: AttemptSubmission): Promise<UserProgressData> {
    const current = await this.getProgress();
    const { streak, today } = this.calculateStreak(current.lastActiveDate, current.streakDays);

    // Replace if same attempt or prepend
    const updatedAttempts = [
      attempt,
      ...current.attempts.filter((a) => a.id !== attempt.id),
    ];

    const updated: UserProgressData = {
      ...current,
      attempts: updatedAttempts,
      streakDays: streak,
      lastActiveDate: today,
    };

    this.save(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/attempt', {
      attempt,
    });

    return updated;
  }

  async toggleBookmark(scenarioId: string): Promise<string[]> {
    const current = await this.getProgress();
    const isBookmarked = current.bookmarkedScenarioIds.includes(scenarioId);
    const updatedBookmarks = isBookmarked
      ? current.bookmarkedScenarioIds.filter((id) => id !== scenarioId)
      : [...current.bookmarkedScenarioIds, scenarioId];

    const updated: UserProgressData = {
      ...current,
      bookmarkedScenarioIds: updatedBookmarks,
    };

    this.save(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/bookmark', {
      scenarioId,
      bookmarked: !isBookmarked,
    });

    return updatedBookmarks;
  }

  async saveNotes(scenarioId: string, notes: string): Promise<void> {
    const current = await this.getProgress();
    const updated: UserProgressData = {
      ...current,
      customNotes: {
        ...current.customNotes,
        [scenarioId]: notes,
      },
    };
    this.save(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/notes', {
      scenarioId,
      notes,
    });
  }

  async exportProgressJson(): Promise<string> {
    const data = await this.getProgress();
    return JSON.stringify(data, null, 2);
  }

  async importProgressJson(jsonString: string): Promise<boolean> {
    try {
      const validation = progressSchema.safeParse(JSON.parse(jsonString));
      if (!validation.success) return false;
      const parsed = validation.data;

      const sanitized: UserProgressData = {
        attempts: parsed.attempts,
        bookmarkedScenarioIds: Array.isArray(parsed.bookmarkedScenarioIds) ? parsed.bookmarkedScenarioIds : [],
        streakDays: Number(parsed.streakDays) || 0,
        lastActiveDate: String(parsed.lastActiveDate || ''),
        customNotes: parsed.customNotes || {},
        tier1Progress: parsed.tier1Progress,
        sqlProgress: parsed.sqlProgress,
      };

      if (parsed.tier1Progress) {
        this.saveTier1Direct(parsed.tier1Progress);
      }

      if (parsed.sqlProgress) {
        this.saveSqlDirect(parsed.sqlProgress);
      }

      this.save(sanitized);

      // Asynchronously sync the full imported payload to PostgreSQL
      this.syncToRemote('/api/progress/import', {
          progress: sanitized,
      });

      return true;
    } catch {
      return false;
    }
  }

  async resetProgress(): Promise<void> {
    const reset = { ...DEFAULT_PROGRESS };
    this.save(reset);
    await this.resetTier1Progress();
    await this.resetSqlProgress();

    // Reset in PostgreSQL
    this.syncToRemote('/api/progress/reset', null, 'DELETE');
  }

  /**
   * Sync complete local state to PostgreSQL
   */
  async syncAllToPostgres(): Promise<{ success: boolean; message: string }> {
    if (!this.accountId) return { success: false, message: 'Sign in to sync account progress.' };
    await this.pendingSync;
    try {
      const current = await this.getProgress();
      const res = await fetch('/api/progress/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: current }),
      });
      return {
        success: res.ok,
        message: res.ok ? 'Progress merged into your account. Existing records were preserved.' : 'Could not merge progress. Your local data is unchanged.',
      };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Network error syncing to PostgreSQL' };
    }
  }

  /**
   * Fetch latest state from PostgreSQL and hydrate local storage
   */
  async fetchFromPostgres(): Promise<{ success: boolean; message: string }> {
    if (!this.accountId) return { success: false, message: 'Sign in to load account progress.' };
    const accountId = this.accountId;
    await this.pendingSync;
    try {
      const res = await fetch('/api/progress');
      if (!res.ok) return { success: false, message: 'Remote database returned error status' };
      const remote = await res.json();
      if (this.accountId !== accountId) return { success: false, message: 'Account changed. Please retry.' };
      const data = mergeProgress(remote, await this.getProgress());
      if (data && Array.isArray(data.attempts)) {
        this.save(data);
        if (data.tier1Progress) {
          this.saveTier1Direct(data.tier1Progress);
        }
        if (data.sqlProgress) {
          this.saveSqlDirect(data.sqlProgress);
        }
        return { success: true, message: `Loaded ${data.attempts.length} attempts from PostgreSQL.` };
      }
      return { success: false, message: 'Invalid payload from PostgreSQL' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to fetch from PostgreSQL' };
    }
  }

  // -------------------------------------------------------------
  // TIER 1 BEGINNER TRACK PERSISTENCE METHODS
  // -------------------------------------------------------------

  async getTier1Progress(): Promise<Tier1ProgressData> {
    if (!this.isClient()) {
      return this.tier1Fallback;
    }

    try {
      const raw = window.localStorage.getItem(this.scopedKey(TIER1_STORAGE_KEY));
      if (!raw) {
        return DEFAULT_TIER1_PROGRESS;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return DEFAULT_TIER1_PROGRESS;
      }
      return {
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
        bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
        lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : '',
        totalScore: typeof parsed.totalScore === 'number' ? parsed.totalScore : 0,
      };
    } catch (e) {
      console.error('Failed to parse Tier 1 progress from localStorage:', e);
      return DEFAULT_TIER1_PROGRESS;
    }
  }

  private saveTier1Direct(data: Tier1ProgressData): void {
    if (this.isClient()) {
      try {
        window.localStorage.setItem(this.scopedKey(TIER1_STORAGE_KEY), JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save Tier 1 progress to localStorage:', e);
      }
    } else {
      this.tier1Fallback = data;
      this.inMemoryFallback.tier1Progress = data;
    }
  }

  async saveTier1Attempt(attempt: Tier1Attempt): Promise<Tier1ProgressData> {
    const current = await this.getTier1Progress();
    const today = new Date().toISOString().split('T')[0];

    // Replace if same attempt or prepend
    const updatedAttempts = [
      attempt,
      ...current.attempts.filter((a) => a.id !== attempt.id),
    ];

    // Calculate total score average
    const totalScore = Math.round(
      updatedAttempts.reduce((acc, curr) => acc + curr.evaluation.scoreOutOf100, 0) /
        updatedAttempts.length
    );

    const updated: Tier1ProgressData = {
      ...current,
      attempts: updatedAttempts,
      lastActiveDate: today,
      totalScore,
    };

    this.saveTier1Direct(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/tier1', {
      attempt,
    });

    return updated;
  }

  async toggleTier1Bookmark(questionId: string): Promise<string[]> {
    const current = await this.getTier1Progress();
    const isBookmarked = current.bookmarkedQuestionIds.includes(questionId);
    const updatedBookmarks = isBookmarked
      ? current.bookmarkedQuestionIds.filter((id) => id !== questionId)
      : [...current.bookmarkedQuestionIds, questionId];

    const updated: Tier1ProgressData = {
      ...current,
      bookmarkedQuestionIds: updatedBookmarks,
    };

    this.saveTier1Direct(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/tier1', {
      bookmarkQuestionId: questionId,
      bookmarked: !isBookmarked,
    });

    return updatedBookmarks;
  }

  async resetTier1Progress(): Promise<void> {
    const reset = { ...DEFAULT_TIER1_PROGRESS };
    this.saveTier1Direct(reset);
  }

  // -------------------------------------------------------------
  // SQL & POSTGRESQL TRACK PERSISTENCE METHODS
  // -------------------------------------------------------------

  async getSqlProgress(): Promise<SqlTrackProgressData> {
    if (!this.isClient()) {
      return this.sqlFallback;
    }

    try {
      const raw = window.localStorage.getItem(this.scopedKey(SQL_STORAGE_KEY));
      if (!raw) {
        return DEFAULT_SQL_PROGRESS;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return DEFAULT_SQL_PROGRESS;
      }

      const sanitizeTier = (t: any) => ({
        attempts: Array.isArray(t?.attempts) ? t.attempts : [],
        completedQuestionIds: Array.isArray(t?.completedQuestionIds) ? t.completedQuestionIds : [],
        bookmarkedQuestionIds: Array.isArray(t?.bookmarkedQuestionIds) ? t.bookmarkedQuestionIds : [],
        averageScore: typeof t?.averageScore === 'number' ? t.averageScore : 0,
      });

      return {
        tier1: sanitizeTier(parsed.tier1),
        tier2: sanitizeTier(parsed.tier2),
        tier3: sanitizeTier(parsed.tier3),
        tier4: sanitizeTier(parsed.tier4),
        lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : '',
        totalQuestionsCompleted: typeof parsed.totalQuestionsCompleted === 'number' ? parsed.totalQuestionsCompleted : 0,
      };
    } catch (e) {
      console.error('Failed to parse SQL progress from localStorage:', e);
      return DEFAULT_SQL_PROGRESS;
    }
  }

  public saveSqlDirect(data: SqlTrackProgressData): void {
    if (this.isClient()) {
      try {
        window.localStorage.setItem(this.scopedKey(SQL_STORAGE_KEY), JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save SQL progress to localStorage:', e);
      }
    } else {
      this.sqlFallback = data;
      this.inMemoryFallback.sqlProgress = data;
    }
  }

  async saveSqlAttempt(attempt: SqlAttempt): Promise<SqlTrackProgressData> {
    const current = await this.getSqlProgress();
    const today = new Date().toISOString().split('T')[0];

    const tierKey = attempt.tier.replace('-', '') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
    const tierProgress = current[tierKey] || { ...DEFAULT_TIER_PROGRESS };

    const updatedAttempts = [
      attempt,
      ...tierProgress.attempts.filter((a) => a.id !== attempt.id),
    ];

    const completedSet = new Set(tierProgress.completedQuestionIds);
    if (attempt.passed) {
      completedSet.add(attempt.questionId);
    }
    const updatedCompletedIds = Array.from(completedSet);

    const avgScore = updatedAttempts.length > 0
      ? Math.round(updatedAttempts.reduce((acc, curr) => acc + curr.scoreOutOf100, 0) / updatedAttempts.length)
      : 0;

    const updatedTierProgress = {
      ...tierProgress,
      attempts: updatedAttempts,
      completedQuestionIds: updatedCompletedIds,
      averageScore: avgScore,
    };

    const allCompleted = new Set([
      ...(tierKey === 'tier1' ? updatedCompletedIds : current.tier1.completedQuestionIds),
      ...(tierKey === 'tier2' ? updatedCompletedIds : current.tier2.completedQuestionIds),
      ...(tierKey === 'tier3' ? updatedCompletedIds : current.tier3.completedQuestionIds),
      ...(tierKey === 'tier4' ? updatedCompletedIds : current.tier4.completedQuestionIds),
    ]);

    const updated: SqlTrackProgressData = {
      ...current,
      [tierKey]: updatedTierProgress,
      lastActiveDate: today,
      totalQuestionsCompleted: allCompleted.size,
    };

    this.saveSqlDirect(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/sql', {
      attempt,
    });

    return updated;
  }

  async toggleSqlBookmark(questionId: string, tierLevel: SqlTierLevel = 'tier-1'): Promise<string[]> {
    const current = await this.getSqlProgress();
    const tierKey = tierLevel.replace('-', '') as 'tier1' | 'tier2' | 'tier3' | 'tier4';
    const tierProgress = current[tierKey] || { ...DEFAULT_TIER_PROGRESS };

    const isBookmarked = tierProgress.bookmarkedQuestionIds.includes(questionId);
    const updatedBookmarks = isBookmarked
      ? tierProgress.bookmarkedQuestionIds.filter((id) => id !== questionId)
      : [...tierProgress.bookmarkedQuestionIds, questionId];

    const updated: SqlTrackProgressData = {
      ...current,
      [tierKey]: {
        ...tierProgress,
        bookmarkedQuestionIds: updatedBookmarks,
      },
    };

    this.saveSqlDirect(updated);

    // Asynchronously sync to PostgreSQL
    this.syncToRemote('/api/progress/sql', {
      bookmarkQuestionId: questionId,
      bookmarked: !isBookmarked,
      tier: tierLevel,
    });

    return updatedBookmarks;
  }

  async resetSqlProgress(): Promise<void> {
    const reset = { ...DEFAULT_SQL_PROGRESS };
    this.saveSqlDirect(reset);
  }
  public getAnonymousProgress(): UserProgressData {
    const main = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || JSON.stringify(DEFAULT_PROGRESS));
    const tier1 = JSON.parse(window.localStorage.getItem(TIER1_STORAGE_KEY) || JSON.stringify(DEFAULT_TIER1_PROGRESS));
    const sql = JSON.parse(window.localStorage.getItem(SQL_STORAGE_KEY) || JSON.stringify(DEFAULT_SQL_PROGRESS));
    return progressSchema.parse({ ...main, tier1Progress: tier1, sqlProgress: sql });
  }

  public async mergeAnonymousProgress(): Promise<{ success: boolean; message: string }> {
    if (!this.accountId) return { success: false, message: 'Sign in before importing progress.' };
    try {
      await this.pendingSync;
      const progress = this.getAnonymousProgress();
      const response = await fetch('/api/progress/import', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ progress }),
      });
      if (!response.ok) return { success: false, message: 'Import failed. Anonymous data is unchanged. Check the progress format or sign in again.' };
      await this.fetchFromPostgres();
      return { success: true, message: 'Anonymous progress merged into your account. The original device data is preserved.' };
    } catch {
      return { success: false, message: 'Could not import progress. Your anonymous data is unchanged.' };
    }
  }

}

export const storage = new LocalStorageAdapter();
