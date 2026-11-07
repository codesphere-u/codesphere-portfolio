export type DomainCategory =
  | 'All'
  | 'AI'
  | 'Cybersecurity'
  | 'Backend'
  | 'Fintech'
  | 'Cloud'
  | 'Full-Stack';

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
  visualMotif:
    | 'shield'
    | 'waveform'
    | 'committee'
    | 'firewall'
    | 'graph'
    | 'cassette'
    | 'ast'
    | 'router'
    | 'ledger'
    | 'trace'
    | 'agro'
    | 'clinical';
  accentColor: string;
  tagline: string;
  summary: string;
  problemStatement: string;
  technicalChallenges: string[];
  securityConsiderations: string[];
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

export interface JourneyChapter {
  stageNumber: number;
  chapterCode: string;
  theme: string;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  responsibility: string;
  technologies: string[];
  learned: string;
  shapedNext: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  shortCode: string;
  category: string;
  x: number;
  y: number;
  accentColor: string;
  summary: string;
  capabilities: string[];
  technologies: string[];
  relatedProjectIds: string[];
  relatedCommercialNames: string[];
  connectedNodeIds: string[];
}

export interface PhilosophyPrinciple {
  id: string;
  number: string;
  statement: string;
  elaboration: string;
  proofPoint: string;
  relatedProjectSlug: string;
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
    displayNameUpper: string;
    shortName: string;
    heroEditorialHeadline: string;
    heroSpecialties: string[];
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
  designSystem: {
    colors: {
      midnightNavy: string;
      deepSurface: string;
      electricCyan: string;
      engineeringBlue: string;
      achievementGold: string;
      primaryText: string;
      secondaryText: string;
    };
    fonts: {
      heading: string;
      body: string;
      mono: string;
    };
  };
  domains: DomainCategory[];
  experience: ExperienceItem[];
  journey: JourneyChapter[];
  knowledgeMap: KnowledgeNode[];
  philosophy: PhilosophyPrinciple[];
  projects: FlagshipProject[];
  broaderProjects: BroaderProject[];
  benchmarks: BenchmarkRow[];
}

export declare const PORTFOLIO_DATA: PortfolioData;
