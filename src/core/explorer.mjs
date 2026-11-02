import { PORTFOLIO_DATA } from '../data/portfolio-data.mjs';

/**
 * Filter flagship projects by domain category and optional search query.
 * @param {object} options
 * @param {string} [options.domain='All']
 * @param {string} [options.query='']
 * @param {Array} [options.projects=PORTFOLIO_DATA.projects]
 */
export function filterProjects({
  domain = 'All',
  query = '',
  projects = PORTFOLIO_DATA.projects
} = {}) {
  const normalizedDomain = (domain || 'All').trim();
  const normalizedQuery = (query || '').trim().toLowerCase();

  return projects.filter((project) => {
    const matchesDomain =
      normalizedDomain === 'All' ||
      project.primaryDomain === normalizedDomain ||
      project.domains.includes(normalizedDomain);

    if (!matchesDomain) return false;
    if (!normalizedQuery) return true;

    const searchableFields = [
      project.name,
      project.slug,
      project.tagline,
      project.summary,
      project.primaryDomain,
      ...project.domains,
      ...project.languages,
      project.headlineMetric.label,
      project.headlineMetric.value,
      project.headlineMetric.detail,
      ...project.adrs.map((adr) => `${adr.title} ${adr.decision} ${adr.tradeOffs}`)
    ]
      .join(' ')
      .toLowerCase();

    return searchableFields.includes(normalizedQuery);
  });
}

/**
 * Get a single flagship project by id or slug.
 * @param {string} idOrSlug
 * @param {Array} [projects=PORTFOLIO_DATA.projects]
 */
export function getProjectById(idOrSlug, projects = PORTFOLIO_DATA.projects) {
  if (!idOrSlug) return null;
  const target = idOrSlug.trim().toLowerCase();
  return (
    projects.find(
      (p) => p.id.toLowerCase() === target || p.slug.toLowerCase() === target
    ) || null
  );
}

/**
 * Compute aggregate verified portfolio statistics across all flagship repositories.
 * @param {object} [data=PORTFOLIO_DATA]
 */
export function computePortfolioSummary(data = PORTFOLIO_DATA) {
  const totalProjects = data.projects.length;
  const primaryFlagshipsCount = data.projects.filter(
    (p) => p.isPrimaryFlagship
  ).length;
  const totalBroaderProjects = Array.isArray(data.broaderProjects)
    ? data.broaderProjects.length
    : 0;
  const totalAutomatedTests = data.projects.reduce(
    (sum, project) => sum + project.automatedTests,
    0
  );
  const totalAdrs = data.projects.reduce(
    (sum, project) => sum + project.adrs.length,
    0
  );
  const domainsCovered = data.domains.filter((d) => d !== 'All').length;

  const domainCounts = {};
  for (const domain of data.domains) {
    domainCounts[domain] =
      domain === 'All'
        ? totalProjects
        : filterProjects({ domain, projects: data.projects }).length;
  }

  const maxTestsInRepo = Math.max(
    ...data.projects.map((p) => p.automatedTests),
    1
  );
  const maxLatencyMs = Math.max(
    ...data.benchmarks.map((b) => b.primaryLatencyMs),
    0.001
  );

  return {
    totalProjects,
    primaryFlagshipsCount,
    totalBroaderProjects,
    totalAutomatedTests,
    totalAdrs,
    domainsCovered,
    domainCounts,
    maxTestsInRepo,
    maxLatencyMs
  };
}

/**
 * Sort benchmark rows by a chosen key.
 * @param {Array} [benchmarks=PORTFOLIO_DATA.benchmarks]
 * @param {'tests-desc' | 'latency-asc' | 'name-asc'} [sortBy='tests-desc']
 */
export function sortBenchmarks(
  benchmarks = PORTFOLIO_DATA.benchmarks,
  sortBy = 'tests-desc'
) {
  const copy = [...benchmarks];
  switch (sortBy) {
    case 'latency-asc':
      return copy.sort((a, b) => a.primaryLatencyMs - b.primaryLatencyMs);
    case 'name-asc':
      return copy.sort((a, b) => a.projectName.localeCompare(b.projectName));
    case 'tests-desc':
    default:
      return copy.sort((a, b) => b.automatedTests - a.automatedTests);
  }
}

/**
 * Validate structural integrity, executive identity rules, and verified metrics of PORTFOLIO_DATA.
 * @param {object} [data=PORTFOLIO_DATA]
 */
export function validatePortfolioIntegrity(data = PORTFOLIO_DATA) {
  const errors = [];

  if (data?.profile?.name !== 'Akandwanaho Ivan Alvin') {
    errors.push('Profile name must be Akandwanaho Ivan Alvin');
  }

  if (!data?.profile?.githubUrl?.startsWith('https://github.com/codesphere-u')) {
    errors.push('Profile githubUrl must point to https://github.com/codesphere-u');
  }

  if (data?.profile?.companyWebsiteUrl !== 'https://www.codesphereug.com') {
    errors.push('Profile companyWebsiteUrl must point to https://www.codesphereug.com');
  }

  if (data?.profile?.linkedinUrl !== 'https://www.linkedin.com/in/the4codex') {
    errors.push('Profile linkedinUrl must point to https://www.linkedin.com/in/the4codex');
  }

  const serialized = JSON.stringify(data);
  if (/makerere/i.test(serialized)) {
    errors.push('Strict accuracy rule violation: Makerere must never appear in portfolio data');
  }
  if (/whitehathackerpr/i.test(serialized)) {
    errors.push('Strict accuracy rule violation: dead link whitehathackerpr must not appear');
  }
  if (!/ISBAT University/i.test(data?.profile?.education?.institution || '')) {
    errors.push('Profile education must reference ISBAT University');
  }

  const requiredSlugs = [
    'cyber-dragon',
    'auralis-local',
    'agentshield',
    'ARGUS-AI',
    'flowledger',
    'stackpulse',
    'agrisignal',
    'Clinical-Virtual-Health-Platform'
  ];

  for (const slug of requiredSlugs) {
    const found = data.projects.find((p) => p.slug === slug);
    if (!found) {
      errors.push(`Missing required flagship system slug: ${slug}`);
      continue;
    }
    if (found.repoUrl !== `https://github.com/codesphere-u/${slug}`) {
      errors.push(`Invalid repoUrl for ${slug}: ${found.repoUrl}`);
    }
    if (typeof found.automatedTests !== 'number' || found.automatedTests <= 0) {
      errors.push(`Invalid automatedTests count for ${slug}`);
    }
    if (!Array.isArray(found.adrs) || found.adrs.length === 0) {
      errors.push(`Project ${slug} must include at least one ADR`);
    }
    if (!Array.isArray(found.cliQuickstart) || found.cliQuickstart.length === 0) {
      errors.push(`Project ${slug} must include CLI quickstart commands`);
    }
  }

  if (!Array.isArray(data.experience) || data.experience.length < 4) {
    errors.push('Portfolio must include all 4 verified leadership & career roles');
  }

  if (!Array.isArray(data.journey) || data.journey.length !== 7) {
    errors.push('Portfolio must include the 7-stage thematic engineering journey');
  }

  if (!Array.isArray(data.broaderProjects) || data.broaderProjects.length < 6) {
    errors.push('Portfolio must include the broader product & commercial engineering archive');
  }

  const totalTests = data.projects.reduce((acc, p) => acc + p.automatedTests, 0);
  if (totalTests < 260) {
    errors.push(`Expected 260+ automated tests across portfolio, found ${totalTests}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    totalTests
  };
}
