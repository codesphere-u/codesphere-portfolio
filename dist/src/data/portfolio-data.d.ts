export type DomainCategory =
  | 'All'
  | 'AI & Agents'
  | 'Cybersecurity'
  | 'Fintech & Ledgers'
  | 'Cloud & SRE'
  | 'AgriTech & HealthTech';

export interface ArchitectureDecisionRecord {
  id: string;
  title: string;
  context: string;
  decision: string;
  tradeOffs: string;
  verification: string;
}

export interface SourceLink {
  label: string;
  path: string;
  url: string;
  kind: 'source' | 'test' | 'docs' | 'demo';
}

export interface FlagshipProject {
  id: string;
  slug: string;
  name: string;
  version: string;
  tagline: string;
  summary: string;
  domains: Exclude<DomainCategory, 'All'>[];
  primaryDomain: Exclude<DomainCategory, 'All'>;
  repoUrl: string;
  liveDemoUrl?: string;
  languages: string[];
  automatedTests: number;
  headlineMetric: {
    label: string;
    value: string;
    detail: string;
  };
  secondaryMetrics: Array<{
    label: string;
    value: string;
  }>;
  architectureBlueprint: {
    diagram: string;
    layers: Array<{
      name: string;
      responsibility: string;
    }>;
    invariants: string[];
  };
  adrs: ArchitectureDecisionRecord[];
  cliQuickstart: string[];
  sourceLinks: SourceLink[];
}

export interface BenchmarkRow {
  projectId: string;
  projectName: string;
  repoSlug: string;
  domain: Exclude<DomainCategory, 'All'>;
  automatedTests: number;
  primaryLatencyLabel: string;
  primaryLatencyMs: number;
  throughputOrAccuracyLabel: string;
  throughputOrAccuracyValue: string;
  determinismGuarantee: string;
  verificationCommand: string;
}

export interface PortfolioData {
  profile: {
    handle: string;
    name: string;
    headline: string;
    location: string;
    availability: string;
    githubUrl: string;
    portfolioRepoUrl: string;
    missionStatement: string;
  };
  domains: DomainCategory[];
  projects: FlagshipProject[];
  benchmarks: BenchmarkRow[];
}

export declare const PORTFOLIO_DATA: PortfolioData;
