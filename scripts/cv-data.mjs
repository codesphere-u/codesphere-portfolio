import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';

const { profile, experience, projects } = PORTFOLIO_DATA;
const role = id => experience.find(item => item.id === id);
const project = id => projects.find(item => item.id === id);
const codesphereBio = profile.companyWebsiteUrl + '/leadership/akandwanaho-ivan';

export const CV = {
  name: profile.name,
  alias: profile.shortName,
  title: 'Software Engineer & Technical Founder',
  location: 'Kampala, Uganda',
  summary: 'Founder and engineering leader with hands-on work in real-time marketplaces, mobile-money fraud defense, and AI infrastructure. Leads Codesphere Innovations and product engineering for Funa Gigs under Jaminsa Ventures Limited.',
  links: [
    { label: 'LinkedIn', display: 'linkedin.com/in/the4codex', url: profile.linkedinUrl },
    { label: 'GitHub', display: 'github.com/codesphere-u', url: profile.githubUrl },
    { label: 'Codesphere profile', display: 'codesphereug.com', url: codesphereBio }
  ],
  experience: [
    {
      organization: profile.companyName,
      title: 'CEO & Co-Founder',
      period: 'Current',
      highlights: [
        'Set technology direction, lead product architecture and engineering delivery, and define application security standards.',
        'Design web, mobile, and cloud systems for custom software, workflow automation, and applied AI.',
        'Build Hinzia, an agricultural platform connecting farmers, buyers, and suppliers with trading and farm-record tools.'
      ],
      links: [
        { label: 'Codesphere leadership profile', url: codesphereBio },
        { label: 'Hinzia on Google Play', url: 'https://play.google.com/store/apps/details?id=codesphere.labs.hinzia' },
        { label: 'Codesphere project portfolio', url: profile.companyWebsiteUrl + '/work' }
      ]
    },
    {
      organization: role('funa-gigs-jaminsa').organization,
      title: 'Founder & Project Lead, Funa Gigs',
      period: 'Current',
      highlights: [
        'Lead engineering for a Ugandan services marketplace available on Android and the web.',
        'Develop location-aware Instant Hire, in-app messaging, job coordination, and identity verification.',
        'Design payment flows that release funds after job approval, with withdrawals through MTN and Airtel Money.'
      ],
      links: [
        { label: 'Funa Gigs case study', url: './work/funa-gigs.html' },
        { label: 'Funa Gigs product site', url: 'https://www.funagigs.com/' }
      ]
    },
    {
      organization: role('waanverse-labs').organization,
      title: 'CTO & Head of Engineering',
      period: 'Until March 2025',
      highlights: [
        'Directed technical strategy and delivery, including service boundaries and API contracts.',
        'Guided code reviews and release workflows, mentored developers, and coordinated implementation with product stakeholders.'
      ]
    },
    {
      organization: role('4codex-technologies').organization,
      title: role('4codex-technologies').role,
      period: 'Earlier venture',
      highlights: [
        'Translated local business requirements into web applications, management systems, and automated workflows.',
        'Delivered application security hardening and technical consulting, including stronger authentication and API boundaries.'
      ]
    }
  ],
  projects: [
    {
      id: 'cyber-dragon',
      area: 'Defensive security',
      detail: 'Built a workbench that explains mobile-money fraud indicators, USSD traps, and deceptive URLs without fetching submitted links.',
      evidence: 'The scoring engine separates five risk categories and explains which signals contributed to each advisory result.'
    },
    {
      id: 'agentflight',
      area: 'AI reliability',
      detail: 'Built deterministic replay for AI agent tool calls, using recorded responses to reproduce a run without repeating live requests.',
      evidence: 'A saved 15-minute tool query replays successfully. Changing the window to 30 minutes produces a structural mismatch.'
    },
    {
      id: 'agentshield',
      area: 'AI security',
      detail: 'Built a runtime firewall for AI agents and Model Context Protocol (MCP) tools with capability policies and outbound data checks.',
      evidence: 'A tool call that tries to traverse outside its workspace is blocked before execution. A hash-chained audit trail records decisions.'
    },
    {
      id: 'flowledger',
      area: 'Financial infrastructure',
      detail: 'Built a Python engine that models payment retries and out-of-order webhooks while enforcing balanced double-entry journal entries.',
      evidence: 'An identical retry reuses the original result. The same idempotency key with a changed payload raises a conflict.'
    },
    {
      id: 'stackpulse',
      area: 'Cloud observability',
      detail: 'Built an OpenTelemetry-compatible toolkit for analyzing distributed traces and diagnosing service reliability problems.',
      evidence: 'Reconstructs the critical path from out-of-order spans and correlates trace bottlenecks with logs and error-budget alerts.'
    },
    {
      id: 'auralis-local',
      area: 'Local AI',
      detail: 'Built an assistant that runs inference through a local Ollama service and searches documents stored on the same machine.',
      evidence: 'Combines keyword and exact-phrase retrieval, then cites the specific file and line range behind a result.'
    }
  ].map(item => ({ ...item, name: project(item.id).name, repo: project(item.id).repoUrl })),
  skills: [
    { label: 'Product & platform', detail: 'Python, TypeScript, Dart, SQL, FastAPI, React, Next.js, Flutter' },
    { label: 'Data & delivery', detail: 'PostgreSQL, SQLite, Docker, OpenTelemetry, GitHub Actions' },
    { label: 'Architecture & security', detail: 'API contracts, role-based access, agent replay, payment reconciliation' }
  ],
  education: {
    institution: profile.education.institution,
    location: profile.education.location,
    detail: 'University studies alongside independent work building operational software for local businesses.',
    training: 'Ethical hacking certificates',
    earlyWork: 'Started programming at 13 in Mbarara. Early work included Haxcon VPN and Haxcon Droid VPN, projects that explored internet access in Uganda.',
    links: [{ label: 'Read the Codesphere biography', url: codesphereBio }]
  }
};

export const cvPdf = 'src/media/akandwanaho-ivan-cv.pdf';
