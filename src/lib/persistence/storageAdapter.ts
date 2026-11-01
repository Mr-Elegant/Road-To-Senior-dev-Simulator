import { UserProgressData, AttemptSubmission } from '@/types/userProgress';
import { Tier1ProgressData, Tier1Attempt } from '@/types/tier1';
import { SqlTrackProgressData, SqlAttempt } from '@/types/sqlTrack';

export interface StorageAdapter {
  getProgress(): Promise<UserProgressData>;
  saveAttempt(attempt: AttemptSubmission): Promise<UserProgressData>;
  toggleBookmark(scenarioId: string): Promise<string[]>;
  saveNotes(scenarioId: string, notes: string): Promise<void>;
  exportProgressJson(): Promise<string>;
  importProgressJson(jsonString: string): Promise<boolean>;
  resetProgress(): Promise<void>;

  // Tier 1 Beginner Track persistence
  getTier1Progress?(): Promise<Tier1ProgressData>;
  saveTier1Attempt?(attempt: Tier1Attempt): Promise<Tier1ProgressData>;
  toggleTier1Bookmark?(questionId: string): Promise<string[]>;
  resetTier1Progress?(): Promise<void>;

  // SQL & PostgreSQL Track persistence
  getSqlProgress?(): Promise<SqlTrackProgressData>;
  saveSqlAttempt?(attempt: SqlAttempt): Promise<SqlTrackProgressData>;
  toggleSqlBookmark?(questionId: string): Promise<string[]>;
  resetSqlProgress?(): Promise<void>;
}
