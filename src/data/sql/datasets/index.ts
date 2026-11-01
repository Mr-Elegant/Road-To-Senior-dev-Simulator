import { SqlDataset, SqlDatasetId } from '@/types/sqlTrack';
import { ecommerceDataset } from './ecommerce';
import { loanManagementDataset } from './loanManagement';
import { saasAnalyticsDataset } from './saasAnalytics';

export const SQL_DATASETS: Record<SqlDatasetId, SqlDataset> = {
  ecommerce: ecommerceDataset,
  loan_management: loanManagementDataset,
  saas_analytics: saasAnalyticsDataset,
};

export const ALL_SQL_DATASETS: SqlDataset[] = [
  ecommerceDataset,
  loanManagementDataset,
  saasAnalyticsDataset,
];

export function getDatasetById(id: SqlDatasetId): SqlDataset {
  return SQL_DATASETS[id] || ecommerceDataset;
}

