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
  isPrimaryFlagship?: boolean;
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

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  status: string;
  isCurrent: boolean;
  location: string;
  websiteUrl?: string;
  ownershipNote?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface JourneyStage {
  stageNumber: number;
  theme: string;
  title: string;
  description: string;
}

export interface BroaderProject {
  id: string;
  name: string;
  category: string;
  organization?: string;
  status: string;
  summary: string;
  highlights: string[];
  technologies: string[];
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
    shortName: string;
    headline: string;
    subtitle: string;
    tagline: string;
    location: string;
    availability: string;
    companyName: string;
    companyWebsiteUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    liveDemoUrl: string;
    portfolioRepoUrl: string;
    missionStatement: string;
    aboutParagraphs: string[];
    education: {
      institution: string;
      location: string;
      summary: string;
    };
  };
  domains: DomainCategory[];
  experience: ExperienceItem[];
  journey: JourneyStage[];
  projects: FlagshipProject[];
  broaderProjects: BroaderProject[];
  benchmarks: BenchmarkRow[];
}

export declare const PORTFOLIO_DATA: PortfolioData;
