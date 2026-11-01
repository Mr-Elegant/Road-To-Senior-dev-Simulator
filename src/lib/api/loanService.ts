import {
  LoanApplication,
  LoanFilters,
  LoanStatus,
  PaginatedResponse,
  DashboardStats,
  SortConfig,
  SimulationConfig,
} from '@/types/loan';
import { queryApplications, computeDashboardStats, updateLoanStatusInDatabase, getLiveApplications } from '@/data/mockLoans';

export class LoanApiService {
  private simulationConfig: SimulationConfig = {
    latencyMs: 300,
    failureRate: 0,
    simulateRaceCondition: false,
    simulateNetworkDrop: false,
  };

  public setSimulationConfig(config: Partial<SimulationConfig>): void {
    this.simulationConfig = { ...this.simulationConfig, ...config };
  }

  public getSimulationConfig(): SimulationConfig {
    return { ...this.simulationConfig };
  }

  /**
   * Helper to simulate network latency and random failure injection
   */
  private async applySimulation(customLatency?: number, signal?: AbortSignal): Promise<void> {
    const latency = typeof customLatency === 'number' ? customLatency : this.simulationConfig.latencyMs;

    if (latency > 0) {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve();
        }, latency);

        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('Request aborted by caller');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    }

    if (signal?.aborted) {
      const err = new Error('Request aborted by caller');
      err.name = 'AbortError';
      throw err;
    }

    // Check for simulated network failure
    if (this.simulationConfig.simulateNetworkDrop) {
      throw new Error('Network unreachable: Simulated offline connection drop.');
    }

    if (this.simulationConfig.failureRate > 0 && Math.random() < this.simulationConfig.failureRate) {
      throw new Error('HTTP 500 Internal Server Error: Simulated backend service failure.');
    }
  }

  /**
   * Fetch paginated and filtered loan applications
   */
  public async getApplications(
    params: {
      filters?: Partial<LoanFilters>;
      sort?: SortConfig;
      page?: number;
      limit?: number;
      customLatency?: number;
    } = {},
    options: { signal?: AbortSignal } = {}
  ): Promise<PaginatedResponse<LoanApplication>> {
    await this.applySimulation(params.customLatency, options.signal);

    const { items, totalCount, totalPages } = queryApplications(
      params.filters,
      params.sort || { field: 'applicationDate', order: 'desc' },
      params.page || 1,
      params.limit || 10
    );

    return {
      items,
      totalCount,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages,
      requestId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
  }

  /**
   * Fetch a single loan application by ID
   */
  public async getApplicationById(id: string, options: { signal?: AbortSignal } = {}): Promise<LoanApplication> {
    await this.applySimulation(undefined, options.signal);

    const all = getLiveApplications();
    const found = all.find((app) => app.id === id);

    if (!found) {
      throw new Error(`Loan application with ID "${id}" was not found (HTTP 404).`);
    }

    return { ...found };
  }

  /**
   * Update the status of a loan application
   */
  public async updateStatus(
    id: string,
    newStatus: LoanStatus,
    officerName: string = 'Current Employee',
    note?: string,
    options: { signal?: AbortSignal; forceFail?: boolean } = {}
  ): Promise<LoanApplication> {
    await this.applySimulation(undefined, options.signal);

    if (options.forceFail) {
      throw new Error('Credit Committee policy violation: Application cannot be approved with open risk findings (HTTP 422).');
    }

    const updated = updateLoanStatusInDatabase(id, newStatus, officerName, note);
    if (!updated) {
      throw new Error(`Failed to update: Application "${id}" does not exist.`);
    }

    return updated;
  }

  /**
   * Fetch aggregated dashboard statistics
   */
  public async getDashboardStats(options: { signal?: AbortSignal } = {}): Promise<DashboardStats> {
    await this.applySimulation(undefined, options.signal);
    return computeDashboardStats();
  }
}

export const loanApiService = new LoanApiService();

