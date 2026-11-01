import { LoanApplication, DashboardStats, LoanFilters, SortConfig } from '@/types/loan';

export const initialLoanApplications: LoanApplication[] = [
  {
    id: 'LN-2026-0101',
    applicantName: 'Aarav Sharma',
    applicantEmail: 'aarav.sharma@enterprise-tech.io',
    applicantPhone: '+91 98765 43210',
    loanAmount: 850000,
    currency: 'INR',
    applicationDate: '2026-10-30T10:15:00.000Z',
    loanType: 'Business',
    status: 'PENDING',
    creditScore: 742,
    annualIncome: 2400000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 24.5,
    riskRating: 'LOW',
    purpose: 'Working capital expansion for B2B SaaS logistics operations',
    assignedOfficer: 'Priya Iyer',
    notes: ['Audited GST returns verified for FY24-25', 'Requires board resolution check'],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-10-30T10:15:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
        note: 'Submitted via Enterprise Web Portal with audited financials',
      },
      {
        id: 'tl-2',
        timestamp: '2026-10-30T11:00:00.000Z',
        action: 'Credit Bureau Pull',
        actor: 'Underwriting Automation',
        note: 'CIBIL score 742 returned. 0 defaults in 36 months.',
      },
    ],
  },
  {
    id: 'LN-2026-0102',
    applicantName: 'Sophia Chen',
    applicantEmail: 'sophia.chen@apexglobal.com',
    applicantPhone: '+1 415 555 0192',
    loanAmount: 120000,
    currency: 'USD',
    applicationDate: '2026-10-29T14:22:00.000Z',
    loanType: 'Mortgage',
    status: 'APPROVED',
    creditScore: 785,
    annualIncome: 195000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 18.2,
    riskRating: 'LOW',
    purpose: 'Residential property refinancing in Austin, TX',
    assignedOfficer: 'Marcus Vance',
    notes: ['Title insurance verified', 'Appraisal came in at $480,000'],
    timeline: [
      {
        id: 'tl-3',
        timestamp: '2026-10-29T14:22:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-4',
        timestamp: '2026-10-30T09:15:00.000Z',
        action: 'Underwriter Review Completed',
        actor: 'Marcus Vance',
        note: 'All income verifications cleared. Loan-to-value at 25%.',
      },
      {
        id: 'tl-5',
        timestamp: '2026-10-30T16:45:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'Credit Committee',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'APPROVED',
      },
    ],
  },
  {
    id: 'LN-2026-0103',
    applicantName: 'Vikramaditya Verma',
    applicantEmail: 'vikram.verma@quickhaul.in',
    applicantPhone: '+91 98230 11223',
    loanAmount: 4500000,
    currency: 'INR',
    applicationDate: '2026-10-28T09:30:00.000Z',
    loanType: 'Vehicle',
    status: 'UNDER_REVIEW',
    creditScore: 688,
    annualIncome: 1800000,
    employmentStatus: 'Self-employed',
    debtToIncomeRatio: 38.0,
    riskRating: 'MEDIUM',
    purpose: 'Fleet financing for 5 electric commercial cargo vans',
    assignedOfficer: 'Ananya Deshmukh',
    notes: ['Requires battery warranty collateral verification'],
    timeline: [
      {
        id: 'tl-6',
        timestamp: '2026-10-28T09:30:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-7',
        timestamp: '2026-10-29T11:20:00.000Z',
        action: 'Status Changed to UNDER_REVIEW',
        actor: 'Ananya Deshmukh',
        statusFrom: 'PENDING',
        statusTo: 'UNDER_REVIEW',
        note: 'Assigned to asset verification team',
      },
    ],
  },
  {
    id: 'LN-2026-0104',
    applicantName: 'Elena Rostova',
    applicantEmail: 'elena.rostova@designworks.io',
    applicantPhone: '+1 212 555 8891',
    loanAmount: 45000,
    currency: 'USD',
    applicationDate: '2026-10-27T16:10:00.000Z',
    loanType: 'Personal',
    status: 'REJECTED',
    creditScore: 592,
    annualIncome: 62000,
    employmentStatus: 'Contract',
    debtToIncomeRatio: 52.4,
    riskRating: 'HIGH',
    purpose: 'Debt consolidation of revolving credit lines',
    assignedOfficer: 'David Miller',
    notes: ['Debt-to-income exceeds 45% threshold policy limit', '2 recent 60-day delinquencies'],
    timeline: [
      {
        id: 'tl-8',
        timestamp: '2026-10-27T16:10:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-9',
        timestamp: '2026-10-28T10:00:00.000Z',
        action: 'Automated Risk Screen Failed',
        actor: 'Risk Engine',
        note: 'DTI 52.4% > allowable 45%. Credit score < 620 threshold.',
      },
      {
        id: 'tl-10',
        timestamp: '2026-10-28T14:30:00.000Z',
        action: 'Status Changed to REJECTED',
        actor: 'David Miller',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'REJECTED',
        note: 'Adverse action notice dispatched via secure email.',
      },
    ],
  },
  {
    id: 'LN-2026-0105',
    applicantName: 'Rohan Kulkarni',
    applicantEmail: 'rohan.kulkarni@meditech.org',
    applicantPhone: '+91 97654 32109',
    loanAmount: 2200000,
    currency: 'INR',
    applicationDate: '2026-10-27T11:45:00.000Z',
    loanType: 'Business',
    status: 'APPROVED',
    creditScore: 765,
    annualIncome: 3600000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 21.0,
    riskRating: 'LOW',
    purpose: 'Diagnostic imaging equipment lease buy-out',
    assignedOfficer: 'Priya Iyer',
    notes: ['Equipment valuation certified by accredited appraiser'],
    timeline: [
      {
        id: 'tl-11',
        timestamp: '2026-10-27T11:45:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-12',
        timestamp: '2026-10-29T15:10:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'Priya Iyer',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'APPROVED',
        note: 'Disbursement authorized pending sanction letter sign-off',
      },
    ],
  },
  {
    id: 'LN-2026-0106',
    applicantName: 'Michael Chang',
    applicantEmail: 'mchang@neurocloud.ai',
    applicantPhone: '+1 650 555 4390',
    loanAmount: 250000,
    currency: 'USD',
    applicationDate: '2026-10-26T18:00:00.000Z',
    loanType: 'Business',
    status: 'PENDING',
    creditScore: 710,
    annualIncome: 310000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 29.2,
    riskRating: 'MEDIUM',
    purpose: 'GPU compute infrastructure cluster expansion',
    assignedOfficer: 'Marcus Vance',
    notes: ['Awaiting cloud service provider contract verification'],
    timeline: [
      {
        id: 'tl-13',
        timestamp: '2026-10-26T18:00:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
    ],
  },
  {
    id: 'LN-2026-0107',
    applicantName: 'Fatima Al-Mansoor',
    applicantEmail: 'fatima.mansoor@creativespark.ae',
    applicantPhone: '+971 50 123 4567',
    loanAmount: 75000,
    currency: 'USD',
    applicationDate: '2026-10-25T13:20:00.000Z',
    loanType: 'Education',
    status: 'APPROVED',
    creditScore: 758,
    annualIncome: 140000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 19.8,
    riskRating: 'LOW',
    purpose: 'Executive MBA tuition financing at INSEAD',
    assignedOfficer: 'David Miller',
    notes: ['Employer sponsorship letter on file for 50% reimbursement'],
    timeline: [
      {
        id: 'tl-14',
        timestamp: '2026-10-25T13:20:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-15',
        timestamp: '2026-10-27T10:00:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'David Miller',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'APPROVED',
      },
    ],
  },
  {
    id: 'LN-2026-0108',
    applicantName: 'Kavita Nair',
    applicantEmail: 'kavita.nair@greengrid.in',
    applicantPhone: '+91 99887 66554',
    loanAmount: 1500000,
    currency: 'INR',
    applicationDate: '2026-10-25T08:10:00.000Z',
    loanType: 'Business',
    status: 'UNDER_REVIEW',
    creditScore: 720,
    annualIncome: 1900000,
    employmentStatus: 'Self-employed',
    debtToIncomeRatio: 27.4,
    riskRating: 'LOW',
    purpose: 'Rooftop solar distributed micro-grid installation contracts',
    assignedOfficer: 'Ananya Deshmukh',
    notes: ['Discom power purchase agreements submitted for review'],
    timeline: [
      {
        id: 'tl-16',
        timestamp: '2026-10-25T08:10:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-17',
        timestamp: '2026-10-26T14:00:00.000Z',
        action: 'Status Changed to UNDER_REVIEW',
        actor: 'Ananya Deshmukh',
        statusFrom: 'PENDING',
        statusTo: 'UNDER_REVIEW',
      },
    ],
  },
  {
    id: 'LN-2026-0109',
    applicantName: 'James Wilson',
    applicantEmail: 'jwilson@premierlogistics.com',
    applicantPhone: '+1 312 555 7761',
    loanAmount: 180000,
    currency: 'USD',
    applicationDate: '2026-10-24T17:40:00.000Z',
    loanType: 'Vehicle',
    status: 'REJECTED',
    creditScore: 610,
    annualIncome: 110000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 47.9,
    riskRating: 'HIGH',
    purpose: 'Heavy commercial prime mover purchase',
    assignedOfficer: 'Marcus Vance',
    notes: ['Past 12 months show 3 bounced vendor payments', 'DTI exceeds underwriting threshold'],
    timeline: [
      {
        id: 'tl-18',
        timestamp: '2026-10-24T17:40:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-19',
        timestamp: '2026-10-26T09:30:00.000Z',
        action: 'Status Changed to REJECTED',
        actor: 'Marcus Vance',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'REJECTED',
      },
    ],
  },
  {
    id: 'LN-2026-0110',
    applicantName: 'Siddharth Sen',
    applicantEmail: 'siddharth.sen@cloudmatrix.co',
    applicantPhone: '+91 98450 99887',
    loanAmount: 1200000,
    currency: 'INR',
    applicationDate: '2026-10-23T12:00:00.000Z',
    loanType: 'Personal',
    status: 'APPROVED',
    creditScore: 792,
    annualIncome: 2800000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 15.6,
    riskRating: 'LOW',
    purpose: 'Home renovation and architectural interior modernization',
    assignedOfficer: 'Priya Iyer',
    notes: ['Instant pre-approved customer segment', 'Salary slip e-verified'],
    timeline: [
      {
        id: 'tl-20',
        timestamp: '2026-10-23T12:00:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-21',
        timestamp: '2026-10-23T14:15:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'Priya Iyer',
        statusFrom: 'PENDING',
        statusTo: 'APPROVED',
      },
    ],
  },
  {
    id: 'LN-2026-0111',
    applicantName: 'Claire Dupond',
    applicantEmail: 'claire.dupond@biomarkers.fr',
    applicantPhone: '+33 6 12 34 56 78',
    loanAmount: 95000,
    currency: 'USD',
    applicationDate: '2026-10-22T15:20:00.000Z',
    loanType: 'Business',
    status: 'PENDING',
    creditScore: 735,
    annualIncome: 160000,
    employmentStatus: 'Self-employed',
    debtToIncomeRatio: 26.8,
    riskRating: 'LOW',
    purpose: 'Clinical trial patient recruitment lab equipment',
    assignedOfficer: 'David Miller',
    notes: ['Ethics committee approval documentation pending'],
    timeline: [
      {
        id: 'tl-22',
        timestamp: '2026-10-22T15:20:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
    ],
  },
  {
    id: 'LN-2026-0112',
    applicantName: 'Manish Patel',
    applicantEmail: 'manish.patel@surattextiles.in',
    applicantPhone: '+91 98980 44332',
    loanAmount: 6000000,
    currency: 'INR',
    applicationDate: '2026-10-21T09:10:00.000Z',
    loanType: 'Business',
    status: 'APPROVED',
    creditScore: 770,
    annualIncome: 8500000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 22.3,
    riskRating: 'LOW',
    purpose: 'High-speed automated jacquard weaving loom line expansion',
    assignedOfficer: 'Ananya Deshmukh',
    notes: ['Factory property collateralized with clear title search'],
    timeline: [
      {
        id: 'tl-23',
        timestamp: '2026-10-21T09:10:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-24',
        timestamp: '2026-10-24T16:00:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'Ananya Deshmukh',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'APPROVED',
      },
    ],
  },
  {
    id: 'LN-2026-0113',
    applicantName: 'Tariq Hassan',
    applicantEmail: 'tariq.hassan@fintechflow.com',
    applicantPhone: '+1 718 555 3341',
    loanAmount: 50000,
    currency: 'USD',
    applicationDate: '2026-10-20T10:30:00.000Z',
    loanType: 'Personal',
    status: 'UNDER_REVIEW',
    creditScore: 695,
    annualIncome: 125000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 33.5,
    riskRating: 'MEDIUM',
    purpose: 'Emergency medical bridge financing',
    assignedOfficer: 'Marcus Vance',
    notes: ['Hospital estimate received; checking insurance coverage'],
    timeline: [
      {
        id: 'tl-25',
        timestamp: '2026-10-20T10:30:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-26',
        timestamp: '2026-10-21T09:00:00.000Z',
        action: 'Status Changed to UNDER_REVIEW',
        actor: 'Marcus Vance',
        statusFrom: 'PENDING',
        statusTo: 'UNDER_REVIEW',
      },
    ],
  },
  {
    id: 'LN-2026-0114',
    applicantName: 'Neha Aggarwal',
    applicantEmail: 'neha.aggarwal@edulearn.org',
    applicantPhone: '+91 97110 55443',
    loanAmount: 900000,
    currency: 'INR',
    applicationDate: '2026-10-19T14:15:00.000Z',
    loanType: 'Education',
    status: 'PENDING',
    creditScore: 715,
    annualIncome: 1400000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 28.0,
    riskRating: 'LOW',
    purpose: 'Higher secondary school robotics lab curriculum program',
    assignedOfficer: 'Priya Iyer',
    notes: ['School accreditation verified'],
    timeline: [
      {
        id: 'tl-27',
        timestamp: '2026-10-19T14:15:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
    ],
  },
  {
    id: 'LN-2026-0115',
    applicantName: 'Lucas Morales',
    applicantEmail: 'lucas.morales@cyberops.net',
    applicantPhone: '+1 305 555 8123',
    loanAmount: 320000,
    currency: 'USD',
    applicationDate: '2026-10-18T16:50:00.000Z',
    loanType: 'Mortgage',
    status: 'PENDING',
    creditScore: 750,
    annualIncome: 240000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 23.4,
    riskRating: 'LOW',
    purpose: 'Commercial condominium unit purchase in Brickell, Miami',
    assignedOfficer: 'David Miller',
    notes: ['HOA financial health reserve study verified'],
    timeline: [
      {
        id: 'tl-28',
        timestamp: '2026-10-18T16:50:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
    ],
  },
  {
    id: 'LN-2026-0116',
    applicantName: 'Deepak Joshi',
    applicantEmail: 'deepak.joshi@puneagri.in',
    applicantPhone: '+91 98220 77665',
    loanAmount: 1800000,
    currency: 'INR',
    applicationDate: '2026-10-17T11:00:00.000Z',
    loanType: 'Vehicle',
    status: 'APPROVED',
    creditScore: 730,
    annualIncome: 2200000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 25.1,
    riskRating: 'LOW',
    purpose: 'Cold-storage refrigerated milk transport tanker',
    assignedOfficer: 'Ananya Deshmukh',
    notes: ['Dairy cooperative delivery contract confirmed'],
    timeline: [
      {
        id: 'tl-29',
        timestamp: '2026-10-17T11:00:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-30',
        timestamp: '2026-10-19T10:30:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'Ananya Deshmukh',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'APPROVED',
      },
    ],
  },
  {
    id: 'LN-2026-0117',
    applicantName: 'Rachel Green',
    applicantEmail: 'rachel.green@manhattanretail.com',
    applicantPhone: '+1 212 555 1928',
    loanAmount: 65000,
    currency: 'USD',
    applicationDate: '2026-10-16T15:30:00.000Z',
    loanType: 'Personal',
    status: 'REJECTED',
    creditScore: 580,
    annualIncome: 70000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 54.1,
    riskRating: 'HIGH',
    purpose: 'Boutique apparel inventory pre-order',
    assignedOfficer: 'Marcus Vance',
    notes: ['Severely impaired credit history; multiple recent inquiries'],
    timeline: [
      {
        id: 'tl-31',
        timestamp: '2026-10-16T15:30:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-32',
        timestamp: '2026-10-17T13:00:00.000Z',
        action: 'Status Changed to REJECTED',
        actor: 'Marcus Vance',
        statusFrom: 'PENDING',
        statusTo: 'REJECTED',
      },
    ],
  },
  {
    id: 'LN-2026-0118',
    applicantName: 'Harpreet Singh',
    applicantEmail: 'harpreet.singh@amritsargrains.in',
    applicantPhone: '+91 98140 22334',
    loanAmount: 3500000,
    currency: 'INR',
    applicationDate: '2026-10-15T09:45:00.000Z',
    loanType: 'Business',
    status: 'APPROVED',
    creditScore: 780,
    annualIncome: 5000000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 17.5,
    riskRating: 'LOW',
    purpose: 'Automated grain sorting and moisture testing silos',
    assignedOfficer: 'Priya Iyer',
    notes: ['Primary hypothecation on storage assets confirmed'],
    timeline: [
      {
        id: 'tl-33',
        timestamp: '2026-10-15T09:45:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-34',
        timestamp: '2026-10-18T12:00:00.000Z',
        action: 'Status Changed to APPROVED',
        actor: 'Priya Iyer',
        statusFrom: 'UNDER_REVIEW',
        statusTo: 'APPROVED',
      },
    ],
  },
  {
    id: 'LN-2026-0119',
    applicantName: 'Carlos Santoro',
    applicantEmail: 'carlos.santoro@iberiafinance.es',
    applicantPhone: '+34 600 112 233',
    loanAmount: 110000,
    currency: 'USD',
    applicationDate: '2026-10-14T11:20:00.000Z',
    loanType: 'Mortgage',
    status: 'UNDER_REVIEW',
    creditScore: 705,
    annualIncome: 145000,
    employmentStatus: 'Full-time',
    debtToIncomeRatio: 31.2,
    riskRating: 'MEDIUM',
    purpose: 'Secondary vacation rental property acquisition',
    assignedOfficer: 'David Miller',
    notes: ['Projected rental yield calculations under review'],
    timeline: [
      {
        id: 'tl-35',
        timestamp: '2026-10-14T11:20:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
      {
        id: 'tl-36',
        timestamp: '2026-10-16T14:30:00.000Z',
        action: 'Status Changed to UNDER_REVIEW',
        actor: 'David Miller',
        statusFrom: 'PENDING',
        statusTo: 'UNDER_REVIEW',
      },
    ],
  },
  {
    id: 'LN-2026-0120',
    applicantName: 'Sunita Rao',
    applicantEmail: 'sunita.rao@blrbiotech.in',
    applicantPhone: '+91 99000 88776',
    loanAmount: 2800000,
    currency: 'INR',
    applicationDate: '2026-10-13T16:15:00.000Z',
    loanType: 'Business',
    status: 'PENDING',
    creditScore: 748,
    annualIncome: 3900000,
    employmentStatus: 'Business Owner',
    debtToIncomeRatio: 22.8,
    riskRating: 'LOW',
    purpose: 'Biosafety Level-2 containment facility retrofitting',
    assignedOfficer: 'Ananya Deshmukh',
    notes: ['Regulatory clearances from DBT submitted'],
    timeline: [
      {
        id: 'tl-37',
        timestamp: '2026-10-13T16:15:00.000Z',
        action: 'Application Submitted',
        actor: 'Applicant',
      },
    ],
  },
];

// In-memory data store for live simulation
let liveLoanDatabase: LoanApplication[] = JSON.parse(JSON.stringify(initialLoanApplications));

export function getLiveApplications(): LoanApplication[] {
  return liveLoanDatabase;
}

export function resetLiveApplications(): void {
  liveLoanDatabase = JSON.parse(JSON.stringify(initialLoanApplications));
}

export function queryApplications(
  filters: Partial<LoanFilters> = {},
  sort: SortConfig = { field: 'applicationDate', order: 'desc' },
  page: number = 1,
  limit: number = 10
): { items: LoanApplication[]; totalCount: number; totalPages: number } {
  let filtered = [...liveLoanDatabase];

  // 1. Search Query
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (app) =>
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.applicantEmail.toLowerCase().includes(q) ||
        app.purpose.toLowerCase().includes(q)
    );
  }

  // 2. Status Filter
  if (filters.status && filters.status !== 'ALL') {
    filtered = filtered.filter((app) => app.status === filters.status);
  }

  // 3. Loan Type Filter
  if (filters.loanType && filters.loanType !== 'ALL') {
    filtered = filtered.filter((app) => app.loanType === filters.loanType);
  }

  // 4. Risk Rating Filter
  if (filters.riskRating && filters.riskRating !== 'ALL') {
    filtered = filtered.filter((app) => app.riskRating === filters.riskRating);
  }

  // 5. Min / Max Amount
  if (typeof filters.minAmount === 'number') {
    filtered = filtered.filter((app) => app.loanAmount >= (filters.minAmount as number));
  }
  if (typeof filters.maxAmount === 'number') {
    filtered = filtered.filter((app) => app.loanAmount <= (filters.maxAmount as number));
  }

  // 6. Sorting
  filtered.sort((a, b) => {
    let aVal: any = a[sort.field];
    let bVal: any = b[sort.field];

    if (sort.field === 'applicationDate') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
    if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return { items, totalCount, totalPages };
}

export function computeDashboardStats(): DashboardStats {
  const all = liveLoanDatabase;
  const totalApplications = all.length;
  let pendingApplications = 0;
  let underReviewApplications = 0;
  let approvedApplications = 0;
  let rejectedApplications = 0;
  let totalLoanAmount = 0;
  let approvedLoanAmount = 0;
  let pendingLoanAmount = 0;
  let totalCreditScore = 0;

  for (const app of all) {
    totalLoanAmount += app.loanAmount;
    totalCreditScore += app.creditScore;

    switch (app.status) {
      case 'PENDING':
        pendingApplications++;
        pendingLoanAmount += app.loanAmount;
        break;
      case 'UNDER_REVIEW':
        underReviewApplications++;
        pendingLoanAmount += app.loanAmount;
        break;
      case 'APPROVED':
        approvedApplications++;
        approvedLoanAmount += app.loanAmount;
        break;
      case 'REJECTED':
        rejectedApplications++;
        break;
    }
  }

  const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;
  const avgCreditScore = totalApplications > 0 ? Math.round(totalCreditScore / totalApplications) : 0;

  return {
    totalApplications,
    pendingApplications,
    underReviewApplications,
    approvedApplications,
    rejectedApplications,
    totalLoanAmount,
    approvedLoanAmount,
    pendingLoanAmount,
    approvalRate: Number(approvalRate.toFixed(1)),
    avgCreditScore,
  };
}

export function updateLoanStatusInDatabase(
  id: string,
  newStatus: LoanApplication['status'],
  officerName: string = 'Current Employee',
  note?: string
): LoanApplication | null {
  const index = liveLoanDatabase.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const existing = liveLoanDatabase[index];
  const oldStatus = existing.status;

  const updated: LoanApplication = {
    ...existing,
    status: newStatus,
    lastModified: new Date().toISOString(),
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: `Status Changed to ${newStatus}`,
        actor: officerName,
        statusFrom: oldStatus,
        statusTo: newStatus,
        note: note || `Application status changed from ${oldStatus} to ${newStatus}`,
      },
      ...existing.timeline,
    ],
  };

  liveLoanDatabase[index] = updated;
  return updated;
}

