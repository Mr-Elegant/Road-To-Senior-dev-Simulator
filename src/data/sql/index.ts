import { SqlCategory, SqlQuestion, SqlTierLevel, SqlTierName } from '@/types/sqlTrack';
import { TIER1_BEGINNER_QUESTIONS } from './tier1_beginner';
import { TIER2_INTERMEDIATE_QUESTIONS } from './tier2_intermediate';
import { TIER3_ADVANCED_QUESTIONS } from './tier3_advanced';
import { TIER4_SENIOR_QUESTIONS } from './tier4_senior';

export * from './datasets';
export { TIER1_BEGINNER_QUESTIONS } from './tier1_beginner';
export { TIER2_INTERMEDIATE_QUESTIONS } from './tier2_intermediate';
export { TIER3_ADVANCED_QUESTIONS } from './tier3_advanced';
export { TIER4_SENIOR_QUESTIONS } from './tier4_senior';

export const ALL_SQL_QUESTIONS: SqlQuestion[] = [
  ...TIER1_BEGINNER_QUESTIONS,
  ...TIER2_INTERMEDIATE_QUESTIONS,
  ...TIER3_ADVANCED_QUESTIONS,
  ...TIER4_SENIOR_QUESTIONS
];

export interface SqlTierMetadata {
  id: SqlTierLevel;
  name: SqlTierName;
  badge: string;
  difficultyLabel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior/Staff';
  tagline: string;
  description: string;
  color: string;
  accentBg: string;
  totalQuestions: number;
  executableCount: number;
  conceptualCount: number;
  incidentCount: number;
  keyTopics: string[];
}

export const SQL_TIERS_METADATA: Record<SqlTierLevel, SqlTierMetadata> = {
  'tier-1': {
    id: 'tier-1',
    name: 'Tier 1: Beginner SQL',
    badge: 'Beginner',
    difficultyLabel: 'Beginner',
    tagline: 'Relational Foundations, Queries, Filters & Aggregations',
    description:
      'Master essential SQL syntax, filtering, multi-table joins, GROUP BY aggregations, CASE expressions, and constraint basics with hands-on practice.',
    color: 'emerald',
    accentBg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    totalQuestions: TIER1_BEGINNER_QUESTIONS.length,
    executableCount: TIER1_BEGINNER_QUESTIONS.filter((q) => q.questionType === 'executable').length,
    conceptualCount: TIER1_BEGINNER_QUESTIONS.filter((q) => q.questionType === 'conceptual').length,
    incidentCount: TIER1_BEGINNER_QUESTIONS.filter((q) => q.questionType === 'incident').length,
    keyTopics: [
      'SELECT, WHERE, ORDER BY, LIMIT',
      'INNER, LEFT, RIGHT JOINs',
      'Aggregate Functions & HAVING',
      'NULL Semantics & COALESCE',
      'Primary Keys, Foreign Keys, & Constraints'
    ]
  },
  'tier-2': {
    id: 'tier-2',
    name: 'Tier 2: Intermediate SQL',
    badge: 'Intermediate',
    difficultyLabel: 'Intermediate',
    tagline: 'Window Functions, CTEs, Transactions & Normalization',
    description:
      'Tackle analytical queries with RANK and running totals, Common Table Expressions, ACID guarantees, composite indexes, surrogate keys, and upserts.',
    color: 'blue',
    accentBg: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    totalQuestions: TIER2_INTERMEDIATE_QUESTIONS.length,
    executableCount: TIER2_INTERMEDIATE_QUESTIONS.filter((q) => q.questionType === 'executable').length,
    conceptualCount: TIER2_INTERMEDIATE_QUESTIONS.filter((q) => q.questionType === 'conceptual').length,
    incidentCount: TIER2_INTERMEDIATE_QUESTIONS.filter((q) => q.questionType === 'incident').length,
    keyTopics: [
      'Window Functions (DENSE_RANK, SUM OVER, LAG)',
      'Subqueries & Common Table Expressions',
      'Surrogate vs Natural Keys & UUIDv4 Fragmentation',
      'ACID Guarantees & SELECT FOR UPDATE',
      'Partial Indexes & ON CONFLICT Upserts'
    ]
  },
  'tier-3': {
    id: 'tier-3',
    name: 'Tier 3: Advanced PostgreSQL',
    badge: 'Advanced',
    difficultyLabel: 'Advanced',
    tagline: 'B-Tree Internals, EXPLAIN ANALYZE, MVCC & Partitioning',
    description:
      'Dive deep into PostgreSQL database internals: page splits, GIN/GiST/BRIN indexes, query planner cost models, SSI isolation, JSONB indexing, and RLS.',
    color: 'purple',
    accentBg: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    totalQuestions: TIER3_ADVANCED_QUESTIONS.length,
    executableCount: TIER3_ADVANCED_QUESTIONS.filter((q) => q.questionType === 'executable').length,
    conceptualCount: TIER3_ADVANCED_QUESTIONS.filter((q) => q.questionType === 'conceptual').length,
    incidentCount: TIER3_ADVANCED_QUESTIONS.filter((q) => q.questionType === 'incident').length,
    keyTopics: [
      'B-Tree Leaf Pages, Splits & Fillfactor',
      'EXPLAIN (ANALYZE, BUFFERS) Plan Reading',
      'GIN, GiST & BRIN Index Architecture',
      'MVCC Tuple Headers (xmin, xmax, t_ctid)',
      'Declarative Partitioning & Pruning',
      'PgBouncer Connection Pooling Modes',
      'Row-Level Security (RLS) Policies'
    ]
  },
  'tier-4': {
    id: 'tier-4',
    name: 'Tier 4: Senior PostgreSQL & Production Engineering',
    badge: 'Senior/Staff',
    difficultyLabel: 'Senior/Staff',
    tagline: 'Production Incidents, Zero-Downtime Migrations & SRE Architecture',
    description:
      'Solve high-stakes production incidents: deadlock graph post-mortems, replication lag surges, table bloat remediation, zero-downtime DDL, and disaster PITR.',
    color: 'rose',
    accentBg: 'from-rose-500/20 to-amber-500/10 border-rose-500/30 text-rose-400',
    totalQuestions: TIER4_SENIOR_QUESTIONS.length,
    executableCount: TIER4_SENIOR_QUESTIONS.filter((q) => q.questionType === 'executable').length,
    conceptualCount: TIER4_SENIOR_QUESTIONS.filter((q) => q.questionType === 'conceptual').length,
    incidentCount: TIER4_SENIOR_QUESTIONS.filter((q) => q.questionType === 'incident').length,
    keyTopics: [
      'Multi-Transaction Deadlock Graph Post-Mortems',
      'Zero-Downtime Column Rename & Type Migrations',
      'Replication Lag & Replication Slot Disk Full Incidents',
      'Online Bloat Remediation: pg_repack vs VACUUM FULL',
      'Checkpoint Tuning & WAL Generation Spikes',
      'Point-In-Time Recovery (PITR) Disaster Procedures',
      'High-Availability Patroni, Split-Brain & STONITH Fencing'
    ]
  }
};

export function getSqlQuestionsByTier(tier: SqlTierLevel): SqlQuestion[] {
  switch (tier) {
    case 'tier-1':
      return TIER1_BEGINNER_QUESTIONS;
    case 'tier-2':
      return TIER2_INTERMEDIATE_QUESTIONS;
    case 'tier-3':
      return TIER3_ADVANCED_QUESTIONS;
    case 'tier-4':
      return TIER4_SENIOR_QUESTIONS;
    default:
      return [];
  }
}

export function getSqlQuestionById(id: string): SqlQuestion | undefined {
  return ALL_SQL_QUESTIONS.find((q) => q.id === id);
}

export function getSqlQuestionsByCategory(category: SqlCategory): SqlQuestion[] {
  return ALL_SQL_QUESTIONS.filter((q) => q.category === category);
}

export function getSqlExecutableQuestions(): SqlQuestion[] {
  return ALL_SQL_QUESTIONS.filter((q) => q.questionType === 'executable');
}

export function getSqlIncidentQuestions(): SqlQuestion[] {
  return ALL_SQL_QUESTIONS.filter((q) => q.questionType === 'incident');
}

export function getSqlTrackStats() {
  const categoryCounts: Record<string, number> = {};
  for (const q of ALL_SQL_QUESTIONS) {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  }

  return {
    total: ALL_SQL_QUESTIONS.length,
    tier1: TIER1_BEGINNER_QUESTIONS.length,
    tier2: TIER2_INTERMEDIATE_QUESTIONS.length,
    tier3: TIER3_ADVANCED_QUESTIONS.length,
    tier4: TIER4_SENIOR_QUESTIONS.length,
    executable: getSqlExecutableQuestions().length,
    incidents: getSqlIncidentQuestions().length,
    categories: categoryCounts
  };
}

