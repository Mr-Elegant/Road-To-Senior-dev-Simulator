import type { UserProgressData, AttemptSubmission } from '@/types/userProgress';
import type { Tier1ProgressData, Tier1Attempt } from '@/types/tier1';
import type { StorageAdapter } from './storageAdapter';
import { progressSchema } from './progressMerge';

/** Remote-only adapter. Identity always comes from the HttpOnly session cookie. */
export class PrismaStorageAdapter implements StorageAdapter {
  private async request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
    const response = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!response.ok) throw new Error(response.status === 401 ? 'Sign in again to access account progress.' : 'Account progress request failed.');
    return response.json();
  }
  async getProgress(): Promise<UserProgressData> { return this.request('/api/progress'); }
  async saveAttempt(attempt: AttemptSubmission): Promise<UserProgressData> { return this.request('/api/progress/attempt', 'POST', { attempt }); }
  async toggleBookmark(scenarioId: string): Promise<string[]> {
    const current = await this.getProgress();
    const data = await this.request<{ bookmarkedScenarioIds: string[] }>('/api/progress/bookmark', 'POST', { scenarioId, bookmarked: !current.bookmarkedScenarioIds.includes(scenarioId) });
    return data.bookmarkedScenarioIds;
  }
  async saveNotes(scenarioId: string, notes: string): Promise<void> { await this.request('/api/progress/notes', 'POST', { scenarioId, notes }); }
  async exportProgressJson(): Promise<string> { return JSON.stringify(await this.getProgress(), null, 2); }
  async importProgressJson(jsonString: string): Promise<boolean> {
    try { await this.request('/api/progress/import', 'POST', { progress: progressSchema.parse(JSON.parse(jsonString)) }); return true; }
    catch { return false; }
  }
  async resetProgress(): Promise<void> { await this.request('/api/progress/reset', 'DELETE'); }
  async getTier1Progress(): Promise<Tier1ProgressData> { return this.request('/api/progress/tier1'); }
  async saveTier1Attempt(attempt: Tier1Attempt): Promise<Tier1ProgressData> { return this.request('/api/progress/tier1', 'POST', { attempt }); }
  async toggleTier1Bookmark(questionId: string): Promise<string[]> {
    const current = await this.getTier1Progress();
    const result = await this.request<Tier1ProgressData>('/api/progress/tier1', 'POST', { bookmarkQuestionId: questionId, bookmarked: !current.bookmarkedQuestionIds.includes(questionId) });
    return result.bookmarkedQuestionIds;
  }
  async resetTier1Progress(): Promise<void> { await this.request('/api/progress/tier1', 'DELETE'); }
}
