import { PORTFOLIO_DATA } from '../data/portfolio-data.mjs';

/**
 * Pure domain logic for The Builder's Journey portfolio:
 * - Project filtering & search across AI, Cybersecurity, Backend, Fintech, Cloud, Full-Stack
 * - Controlled Engineering Terminal command interpreter (sandboxed, never executes OS shell)
 * - Knowledge Map node lookup
 * - Portfolio integrity validation
 */

export function getProjectById(idOrSlug, projects = PORTFOLIO_DATA.projects) {
  if (!Array.isArray(projects)) return null;
  return (
    projects.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
  );
}

export function filterProjects(
  projectsOrOptions = PORTFOLIO_DATA.projects,
  selectedDomain = 'All',
  searchQuery = ''
) {
  let projects = projectsOrOptions;
  let domainArg = selectedDomain;
  let queryArg = searchQuery;

  if (
    projectsOrOptions &&
    !Array.isArray(projectsOrOptions) &&
    typeof projectsOrOptions === 'object'
  ) {
    projects = projectsOrOptions.projects || PORTFOLIO_DATA.projects;
    domainArg = projectsOrOptions.domain ?? 'All';
    queryArg = projectsOrOptions.query ?? '';
  }

  const normalizedDomain = (domainArg || 'All').trim();
  const normalizedQuery = (queryArg || '').trim().toLowerCase();

  return projects.filter((project) => {
    const matchesDomain =
      normalizedDomain === 'All' ||
      project.primaryDomain === normalizedDomain ||
      (Array.isArray(project.domains) && project.domains.includes(normalizedDomain));

    if (!matchesDomain) return false;
    if (!normalizedQuery) return true;

    const searchableParts = [
      project.name,
      project.slug,
      project.tagline,
      project.summary,
      project.problemStatement,
      project.primaryDomain,
      ...(project.domains || []),
      ...(project.languages || []),
      ...(project.technicalChallenges || []),
      ...(project.securityConsiderations || []),
      project.headlineMetric?.label,
      project.headlineMetric?.value,
      ...(project.adrs || []).flatMap((adr) => [
        adr.id,
        adr.title,
        adr.context,
        adr.decision,
        adr.tradeOffs
      ])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableParts.includes(normalizedQuery);
  });
}

export function sortBenchmarks(benchmarks, sortBy = 'tests-desc') {
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

export function getKnowledgeNodeById(knowledgeMap, nodeId) {
  if (!Array.isArray(knowledgeMap) || knowledgeMap.length === 0) return null;
  return knowledgeMap.find((n) => n.id === nodeId) || knowledgeMap[0];
}

export function executeTerminalCommand(rawInput, data) {
  const cleaned = String(rawInput ?? '').trim();
  const token = cleaned.split(/\s+/)[0]?.toLowerCase() || 'help';

  if (token === 'clear' || token === 'cls') {
    return {
      command: cleaned || 'clear',
      status: 'clear',
      title: 'Terminal Cleared',
      lines: [],
      targetSectionId: null
    };
  }

  if (token === 'help' || token === '?') {
    return {
      command: cleaned || 'help',
      status: 'ok',
      title: 'CODESPhere Controlled Engineering Terminal — Available Commands',
      lines: [
        '  help      → List supported portfolio inspection commands',
        '  about     → Display biography, education (ISBAT University) & leadership roles',
        '  journey   → Inspect the 6 interactive chapters of The Builder’s Journey (#journey)',
        '  projects  → List all 8 verified GitHub engineering repositories (#projects)',
        '  skills    → Inspect the 8-node Engineering Knowledge Map (#mindmap)',
        '  github    → Show verified GitHub profile & flagship repository URLs',
        '  contact   → Display verified professional & company contact channels (#contact)',
        '  clear     → Clear terminal output buffer',
        '  [Note]    → Sandboxed UI interface only; OS shell execution is disabled by design.'
      ],
      targetSectionId: null
    };
  }

  if (token === 'about' || token === 'whoami') {
    return {
      command: cleaned,
      status: 'ok',
      title: `${data.profile.name} (${data.profile.shortName}) — Identity & Leadership`,
      lines: [
        `  Name         : ${data.profile.name}`,
        `  Positioning  : ${data.profile.headline}`,
        `  Current Role : ${data.profile.subtitle} (${data.profile.companyWebsiteUrl})`,
        `  Product Lead : Founder & Project Lead — Funa Gigs (Jaminsa Ventures Limited)`,
        `  Former Role  : CTO & Head of Engineering — Waanverse Labs Inc. (until March 2025)`,
        `  Early Venture: Founder — 4codex Technologies`,
        `  Education    : ${data.profile.education.institution} (${data.profile.education.location})`,
        `  Mission      : "${data.profile.tagline}"`
      ],
      targetSectionId: 'journey'
    };
  }

  if (token === 'journey' || token === 'chapters') {
    return {
      command: cleaned,
      status: 'ok',
      title: 'The Builder’s Journey — 6 Interactive Chapters',
      lines: data.journey.map(
        (ch) => `  [${ch.chapterCode}] ${ch.theme.padEnd(32)} → ${ch.subtitle}`
      ),
      targetSectionId: 'journey'
    };
  }

  if (token === 'projects' || token === 'repos') {
    return {
      command: cleaned,
      status: 'ok',
      title: `Verified Engineering Repositories (${data.projects.length} Public Systems)`,
      lines: data.projects.map(
        (p) =>
          `  • ${p.name.padEnd(34)} [${p.primaryDomain.padEnd(13)}] ${String(p.automatedTests).padStart(2)} tests → ${p.repoUrl}`
      ),
      targetSectionId: 'projects'
    };
  }

  if (token === 'skills' || token === 'mind' || token === 'stack') {
    return {
      command: cleaned,
      status: 'ok',
      title: 'Engineering Knowledge Map — 8 Core Specialty Nodes',
      lines: data.knowledgeMap.map(
        (n) => `  ◆ ${n.label.padEnd(22)} (${n.shortCode}) : ${n.technologies.slice(0, 5).join(', ')}`
      ),
      targetSectionId: 'mindmap'
    };
  }

  if (token === 'github' || token === 'oss') {
    return {
      command: cleaned,
      status: 'ok',
      title: 'Verified GitHub Presence & Open-Source Flagships',
      lines: [
        `  GitHub Profile  : ${data.profile.githubUrl}`,
        `  Profile README  : ${data.profile.githubUrl}/codesphere-u`,
        `  Portfolio Repo  : ${data.profile.portfolioRepoUrl}`,
        `  Live Cyber Lab  : ${data.profile.liveDemoUrl}`,
        ...data.projects.slice(0, 6).map((p) => `  Flagship Repo   : ${p.repoUrl}`)
      ],
      targetSectionId: 'projects'
    };
  }

  if (token === 'contact' || token === 'links') {
    return {
      command: cleaned,
      status: 'ok',
      title: 'Verified Professional & Contact Channels',
      lines: [
        `  Company Website : ${data.profile.companyWebsiteUrl} (${data.profile.companyName})`,
        `  LinkedIn        : ${data.profile.linkedinUrl}`,
        `  GitHub          : ${data.profile.githubUrl}`,
        `  Location        : ${data.profile.location}`,
        `  Availability    : ${data.profile.availability}`
      ],
      targetSectionId: 'contact'
    };
  }

  return {
    command: cleaned,
    status: 'unknown',
    title: `Unrecognized Command: "${cleaned}"`,
    lines: [
      '  This is a controlled portfolio inspection terminal (no OS shell commands are executed).',
      '  Type "help" or click one of the command chips above: help, about, journey, projects, skills, github, contact.'
    ],
    targetSectionId: null
  };
}

export function computePortfolioSummary(data) {
  const projects = data.projects || [];
  const totalTests = projects.reduce((sum, p) => sum + (Number(p.automatedTests) || 0), 0);
  const totalAdrs = projects.reduce((sum, p) => sum + (p.adrs ? p.adrs.length : 0), 0);
  const primaryFlagships = projects.filter((p) => p.isPrimaryFlagship).length;
  const domainCounts = {};

  for (const domain of data.domains || []) {
    if (domain === 'All') {
      domainCounts[domain] = projects.length;
    } else {
      domainCounts[domain] = projects.filter(
        (p) => p.primaryDomain === domain || (p.domains && p.domains.includes(domain))
      ).length;
    }
  }

  return {
    totalProjects: projects.length,
    primaryFlagships,
    primaryFlagshipsCount: primaryFlagships,
    totalBroaderProjects: (data.broaderProjects || []).length,
    totalExperienceRoles: (data.experience || []).length,
    totalJourneyStages: (data.journey || []).length,
    totalKnowledgeNodes: (data.knowledgeMap || []).length,
    totalPhilosophyPrinciples: (data.philosophy || []).length,
    totalAutomatedTests: totalTests,
    totalAdrs,
    domainCounts
  };
}

export function validatePortfolioIntegrity(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Portfolio data root is missing.'], totalTests: 0 };
  }

  if (data.profile?.name !== 'Akandwanaho Ivan') {
    errors.push('Profile name must be Akandwanaho Ivan.');
  }
  if (data.profile?.displayNameUpper !== 'AKANDWANAHO IVAN') {
    errors.push('Hero displayNameUpper must be AKANDWANAHO IVAN.');
  }
  if (data.profile?.heroEditorialHeadline !== 'Engineering what comes next.') {
    errors.push('Hero editorial headline must be "Engineering what comes next."');
  }
  if (data.profile?.education?.institution !== 'ISBAT University') {
    errors.push('Education institution must be ISBAT University.');
  }
  if (data.profile?.companyWebsiteUrl !== 'https://www.codesphereug.com') {
    errors.push('Company website URL must be https://www.codesphereug.com.');
  }
  if (data.profile?.linkedinUrl !== 'https://www.linkedin.com/in/the4codex') {
    errors.push('LinkedIn URL must be https://www.linkedin.com/in/the4codex.');
  }

  const serialized = JSON.stringify(data);
  if (/makerere/i.test(serialized)) {
    errors.push('Accuracy violation: Makerere University must never appear in portfolio data.');
  }
  if (/whitehathackerpr/i.test(serialized)) {
    errors.push('Broken 404 handle whitehathackerpr must not be linked.');
  }
  if (/news2/i.test(serialized)) {
    errors.push('Accuracy violation: Unverified NEWS2 claim must not appear in portfolio data.');
  }

  if (!Array.isArray(data.journey) || data.journey.length !== 6) {
    errors.push('Experience 02 (My Journey) must have exactly 6 interactive chapters.');
  } else {
    for (const ch of data.journey) {
      if (!ch.challenge || !ch.responsibility || !ch.learned || !ch.shapedNext || !ch.technologies?.length) {
        errors.push(`Journey chapter ${ch.chapterCode} is missing required documentary fields.`);
      }
    }
  }

  if (!Array.isArray(data.knowledgeMap) || data.knowledgeMap.length !== 8) {
    errors.push('Experience 04 (Knowledge Map) must contain all 8 specialty nodes.');
  }

  if (!Array.isArray(data.philosophy) || data.philosophy.length !== 5) {
    errors.push('Experience 06 (Engineering Philosophy) must contain all 5 core principles.');
  }

  if (!Array.isArray(data.projects) || data.projects.length < 8) {
    errors.push('Expected at least 8 verified open-source projects.');
  } else {
    for (const project of data.projects) {
      if (!project.repoUrl?.startsWith('https://github.com/codesphere-u/')) {
        errors.push(`Project ${project.id} has invalid repoUrl: ${project.repoUrl}`);
      }
      if (!project.problemStatement || !project.technicalChallenges?.length || !project.securityConsiderations?.length) {
        errors.push(`Project ${project.id} is missing problemStatement, technicalChallenges, or securityConsiderations.`);
      }
    }
  }

  const totalTests = (data.projects || []).reduce(
    (sum, p) => sum + (Number(p.automatedTests) || 0),
    0
  );

  return {
    valid: errors.length === 0,
    errors,
    totalTests
  };
}
