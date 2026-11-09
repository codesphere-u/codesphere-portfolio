import { PORTFOLIO_DATA } from '../src/data/portfolio-data.mjs';

const { profile, experience, projects } = PORTFOLIO_DATA;
const role = id => experience.find(item => item.id === id);
const project = id => projects.find(item => item.id === id);

export const CV = {
  name: profile.name,
  alias: profile.shortName,
  title: 'Software engineer & technical founder',
  location: 'Kampala, Uganda',
  summary: 'Engineering leadership across real-time marketplaces, mobile-money fraud defense, and AI infrastructure. Hands-on work spans product architecture, application security, and tools that make AI agent behavior reproducible and auditable.',
  links: [
    { label: 'LinkedIn', display: 'linkedin.com/in/the4codex', url: profile.linkedinUrl },
    { label: 'GitHub', display: 'github.com/codesphere-u', url: profile.githubUrl },
    { label: 'Codesphere', display: 'codesphereug.com', url: profile.companyWebsiteUrl }
  ],
  experience: [
    {
      organization: profile.companyName,
      title: role('codesphere-innovations').role,
      period: 'Current',
      highlights: [
        'Set technology direction and lead product architecture, engineering delivery, and security standards.',
        'Design web, mobile, and cloud systems across applied AI, business workflows, and custom software.'
      ],
      links: [
        { label: 'Codesphere company profile', url: profile.companyWebsiteUrl + '/about' },
        { label: 'Codesphere project portfolio', url: profile.companyWebsiteUrl + '/work' }
      ]
    },
    {
      organization: role('funa-gigs-jaminsa').organization,
      title: 'Founder & Project Lead, Funa Gigs',
      period: 'Current',
      highlights: [
        'Lead engineering for a Ugandan services marketplace available on Android and the web.',
        'Oversee location-aware Instant Hire, in-app coordination, and payment release after job approval, with MTN and Airtel Money withdrawals.'
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
        'Directed technical strategy, architecture, and engineering delivery. Defined API standards, guided code reviews, and established release workflows.'
      ]
    },
    {
      organization: role('4codex-technologies').organization,
      title: role('4codex-technologies').role,
      period: 'Earlier venture',
      highlights: [
        'Built business applications and automated workflows. Delivered application security hardening and technical consulting.'
      ]
    }
  ],
  projects: [
    {
      id: 'cyber-dragon',
      area: 'Defensive security',
      detail: 'Built a workbench that explains signs of mobile-money fraud, USSD traps, and deceptive URLs without fetching submitted links.'
    },
    {
      id: 'agentflight',
      area: 'AI reliability',
      detail: 'Built deterministic replay for AI tool calls. It reuses recorded responses and reports when inputs diverge from a saved run.'
    },
    {
      id: 'agentshield',
      area: 'AI security',
      detail: 'Built a runtime firewall for AI agents and MCP tools with capability policies, outbound data checks, and a tamper-evident audit trail.'
    },
    {
      id: 'flowledger',
      area: 'Financial infrastructure',
      detail: 'Built a Python engine that models payment retries and out-of-order webhooks while enforcing balanced double-entry journal entries.'
    },
    {
      id: 'stackpulse',
      area: 'Cloud observability',
      detail: 'Built a trace analysis toolkit for following requests across services and locating failure paths with an instrumented simulator.'
    }
  ].map(item => ({ ...item, name: project(item.id).name, repo: project(item.id).repoUrl })),
  skills: [
    { label: 'Languages & frameworks', detail: 'Python, TypeScript, Dart, SQL, FastAPI, React, Next.js, Flutter' },
    { label: 'Data & delivery', detail: 'PostgreSQL, SQLite, Docker, OpenTelemetry, GitHub Actions' },
    { label: 'Systems design', detail: 'API architecture, application security, agent replay, payment reconciliation' }
  ],
  education: {
    institution: profile.education.institution,
    location: profile.education.location,
    detail: 'University studies alongside independent work building software for local businesses.'
  }
};

export const cvPdf = 'src/media/akandwanaho-ivan-cv.pdf';
