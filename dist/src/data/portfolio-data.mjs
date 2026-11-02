/**
 * Verified Engineering Portfolio Data — codesphere-u
 * Zero synthetic vanity numbers: every benchmark, test count, and architectural invariant
 * corresponds directly to executable test suites in https://github.com/codesphere-u
 */

export const PORTFOLIO_DATA = {
  profile: {
    handle: 'codesphere-u',
    name: 'Codesphere Engineering',
    headline:
      'Software Engineer | AI Systems Builder | Cybersecurity | Full-Stack & Cloud Engineering | Building Technology for Real-World Problems',
    location: 'Kampala, Uganda · Global Remote / International Engineering',
    availability: 'Open to Senior / Staff Full-Stack, AI Systems, Security & Distributed Systems Roles',
    githubUrl: 'https://github.com/codesphere-u',
    portfolioRepoUrl: 'https://github.com/codesphere-u/codesphere-portfolio',
    missionStatement:
      'Designing deterministic, adversarial-resilient software systems—from capability-gated AI firewalls and integer-exact mobile money ledgers to sub-millisecond local RAG workspaces and offline-first agricultural decision support.'
  },

  domains: [
    'All',
    'AI & Agents',
    'Cybersecurity',
    'Fintech & Ledgers',
    'Cloud & SRE',
    'AgriTech & HealthTech'
  ],

  projects: [
    {
      id: 'agentshield',
      slug: 'agentshield',
      name: 'AgentShield',
      version: 'v1.0.0',
      tagline: 'OWASP 2026 AI Agent Security & Capability Firewall',
      summary:
        'Deterministic capability firewall and runtime policy engine intercepting tool calls before execution. Mitigates indirect prompt injection, SSRF/cloud metadata exfiltration, credential leakage, and privilege escalation with a tamper-evident SHA-256 hash-chained audit ledger.',
      domains: ['Cybersecurity', 'AI & Agents'],
      primaryDomain: 'Cybersecurity',
      repoUrl: 'https://github.com/codesphere-u/agentshield',
      languages: ['TypeScript', 'Node.js'],
      automatedTests: 42,
      headlineMetric: {
        label: 'Red-Team Recall / FPR',
        value: '100% Recall · 0% FPR',
        detail: '25-scenario adversarial corpus (17 malicious attacks blocked, 8 benign workflows allowed)'
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '42 passing' },
        { label: 'Red-Team Corpus', value: '25 scenarios' },
        { label: 'Audit Integrity', value: 'SHA-256 Hash Chain' },
        { label: 'Approval Gate', value: 'HMAC-SHA256 Single-Use' }
      ],
      architectureBlueprint: {
        diagram: `[Untrusted Context / Prompt]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Context Taint Scanner (Indirect Injection & Confusion) │
├───────────────────────────────────────────────────────────┤
│ 2. Tool Argument Validator (Path, Shell, SQL, SSRF Guard) │
├───────────────────────────────────────────────────────────┤
│ 3. Capability Gate & HMAC-SHA256 Single-Use Approval Token│
├───────────────────────────────────────────────────────────┤
│ 4. Secret Redactor (AWS, JWT, PEM, Bearer, Mobile Money)  │
└───────────────────────────┬───────────────────────────────┘
                            ▼
        [Tamper-Evident SHA-256 Chained Audit Ledger]`,
        layers: [
          {
            name: 'Context Taint & Prompt Injection Scanner',
            responsibility:
              'Detects role-override instructions, base64/hex obfuscated payloads, and untrusted RAG/webhook taint attempting to invoke high-privilege tools.'
          },
          {
            name: 'Deterministic Argument & Egress Inspector',
            responsibility:
              'Blocks RFC1918/link-local/IMDSv2 (169.254.169.254) SSRF targets, path traversal (../), command chaining, and destructive SQL/filesystem payloads.'
          },
          {
            name: 'HMAC-SHA256 Capability & Human-in-the-Loop Gate',
            responsibility:
              'Requires cryptographically bound single-use tokens tied to canonical {toolName, argsHash, sessionId} before executing destructive operations.'
          },
          {
            name: 'Hash-Chained Audit Ledger',
            responsibility:
              'Links every decision entry via prevHash -> entryHash (SHA-256) so post-compromise log tampering is mathematically detectable.'
          }
        ],
        invariants: [
          'Zero LLM-in-the-loop latency or non-determinism on security boundaries—all policy checks execute deterministically in sub-millisecond time.',
          'Approval tokens bind to canonicalized JSON argument hashes and cannot be replayed across tools or sessions.',
          'Every output stream passes through multi-pattern secret scrubbing before returning to the model or caller.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: 'Deterministic Capability Inspection Over LLM-Judge Guardrails',
          context:
            'Probabilistic "LLM-as-a-judge" guardrails are themselves vulnerable to adversarial jailbreaks and add 300–1,500 ms of latency per tool call.',
          decision:
            'Enforce strict capability policies, AST/regex structural validators, RFC1918/IMDSv2 IP range parsing, and taint propagation rules purely in deterministic TypeScript.',
          tradeOffs:
            'Requires explicit policy definitions per tool capability class, but guarantees 0% non-determinism, sub-millisecond overhead, and 100% reproducibility in CI.',
          verification:
            'Verified across 42 unit/integration tests and a 25-scenario OWASP Agentic Top 10 red-team benchmark with 100% recall and 0% false positive rate.'
        },
        {
          id: 'ADR-02',
          title: 'Cryptographic Single-Use Approval Tokens Bound to Canonical Argument Hash',
          context:
            'Boolean confirmation flags in agent loops can be spoofed by prompt injection or replayed with mutated tool arguments.',
          decision:
            'Issue HMAC-SHA256 tokens bound to (toolName, canonicalArgsSha256, sessionId, expiresAt) and mark nonces consumed immediately upon verification.',
          tradeOffs:
            'Requires the host orchestrator to manage an approval secret and token lifecycle, preventing all parameter-tampering and replay attacks.',
          verification:
            'Tested against token replay, cross-tool substitution, argument mutation, and expiration tampering in tests/agentshield.test.ts.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/agentshield.git',
        'cd agentshield && npm test',
        'node src/cli.mjs benchmark'
      ],
      sourceLinks: [
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/agentshield',
          kind: 'source'
        },
        {
          label: 'Firewall Engine & Policy Inspector',
          path: 'src/firewall.mjs',
          url: 'https://github.com/codesphere-u/agentshield/blob/main/src/firewall.mjs',
          kind: 'source'
        },
        {
          label: '25-Scenario OWASP Red-Team Corpus & Tests',
          path: 'tests/agentshield.test.mjs',
          url: 'https://github.com/codesphere-u/agentshield/blob/main/tests/agentshield.test.mjs',
          kind: 'test'
        }
      ]
    },

    {
      id: 'cyber-dragon',
      slug: 'cyber-dragon',
      name: 'Cyber Dragon v1.0',
      version: 'v1.0.0',
      tagline: 'SSRF-Free Community Cyber Defense & Mobile Money/USSD Fraud Engine',
      summary:
        'Dual-runtime (TypeScript Web + Python FastAPI) threat analyzer built for East African & global community defense. Detects phishing URLs, homograph/typosquatting domains, fake mobile money reversal SMS, and predatory USSD strings (*165#, *185#, *334#) without ever making outbound network requests.',
      domains: ['Cybersecurity', 'Fintech & Ledgers'],
      primaryDomain: 'Cybersecurity',
      repoUrl: 'https://github.com/codesphere-u/cyber-dragon',
      liveDemoUrl: 'https://cyber-dragon-ivory.vercel.app',
      languages: ['TypeScript', 'Python', 'FastAPI', 'React'],
      automatedTests: 21,
      headlineMetric: {
        label: 'Mean Threat Analysis Latency',
        value: '0.28 ms · 8/8 Corpus',
        detail: '100% offline/SSRF-free lexical & USSD heuristic scoring across 8 real-world East African & global threat scenarios'
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '21 passing (TS + Python)' },
        { label: 'Mean Latency', value: '0.28 ms / payload' },
        { label: 'Outbound Network Calls', value: '0 (Strictly SSRF-Free)' },
        { label: 'Live Deployment', value: 'cyber-dragon-ivory.vercel.app' }
      ],
      architectureBlueprint: {
        diagram: `[Suspicious URL / SMS / USSD String (*165*...#)]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Zero-Egress Lexical URL Parser (No DNS / No HTTP Fetch)│
├───────────────────────────────────────────────────────────┤
│ 2. Brand Impersonation & IDN Punycode Homograph Detector  │
├───────────────────────────────────────────────────────────┤
│ 3. Mobile Money Social Engineering & Reversal Scam Scorer │
├───────────────────────────────────────────────────────────┤
│ 4. USSD PIN-Trap & Call-Forwarding (*21*) AST Inspector   │
└───────────────────────────┬───────────────────────────────┘
                            ▼
    [Explainable Risk Breakdown + Actionable Playbook]`,
        layers: [
          {
            name: 'Zero-Egress Lexical URL & Hostname Inspector',
            responsibility:
              'Parses URLs strictly as strings/URL objects—flagging raw IP hosts, credential-in-URL (@) tricks, excessive subdomain nesting, high Shannon entropy, and Punycode (`xn--`) homographs.'
          },
          {
            name: 'Mobile Money & USSD Fraud Heuristic Engine',
            responsibility:
              'Detects MTN MoMo (*165#), Airtel Money (*185#), and M-Pesa (*334#) social engineering patterns, fake cash-in reversal alerts, SIM-swap urgency cues, and *21*/*67* call-forwarding hijacks.'
          },
          {
            name: 'Dual-Runtime Parity Layer (TypeScript UI + FastAPI Backend)',
            responsibility:
              'Provides identical deterministic risk scoring in the browser-side interactive analyzer and the Python FastAPI REST service.'
          }
        ],
        invariants: [
          'Zero outbound HTTP/DNS requests when analyzing user-submitted URLs—eliminating SSRF, internal port scanning, and attacker beacon callbacks.',
          'Every risk verdict includes human-readable evidence signals and concrete remediation steps tailored for non-technical users.',
          'Sub-millisecond execution (0.28 ms mean latency) enables real-time client-side scanning on low-end mobile devices.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: 'Refusal to Fetch User-Submitted URLs (SSRF-Free by Construction)',
          context:
            'Many URL scanners fetch the target page to inspect DOM content, inadvertently turning the scanner into an SSRF proxy and tipping off attackers via unique tracking URLs.',
          decision:
            'Perform 100% lexical, structural, Shannon-entropy, Levenshtein brand-distance, and USSD/SMS pattern analysis without making any DNS or HTTP requests.',
          tradeOffs:
            'Cannot inspect post-redirect DOM payloads behind neutral shorteners without user expansion, but completely eliminates SSRF vulnerabilities, attacker canary triggers, and network latency.',
          verification:
            'Verified across 21 automated tests (TypeScript + FastAPI) and an 8/8 real-world threat corpus benchmark completing in 0.28 ms mean latency.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/cyber-dragon.git',
        'cd cyber-dragon && npm test',
        'pytest backend/tests'
      ],
      sourceLinks: [
        {
          label: 'Live Web Application',
          path: 'https://cyber-dragon-ivory.vercel.app',
          url: 'https://cyber-dragon-ivory.vercel.app',
          kind: 'demo'
        },
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/cyber-dragon',
          kind: 'source'
        },
        {
          label: 'Threat Analyzer & USSD Fraud Engine',
          path: 'src/',
          url: 'https://github.com/codesphere-u/cyber-dragon/tree/main/src',
          kind: 'source'
        }
      ]
    },

    {
      id: 'auralis-local',
      slug: 'auralis-local',
      name: 'Auralis Local v0.2',
      version: 'v0.2.0',
      tagline: 'Privacy-First Apple Silicon AI Workspace with Hybrid BM25 RAG & Local Voice',
      summary:
        'Local-first AI workspace engineered for Apple Silicon (`mlx-lm` / Ollama) with deterministic Okapi BM25 + semantic hybrid RAG, cite-or-abstain grounding verification, local Whisper STT / Kokoro TTS voice pipeline, and loopback-only capability sandboxing.',
      domains: ['AI & Agents', 'Cybersecurity'],
      primaryDomain: 'AI & Agents',
      repoUrl: 'https://github.com/codesphere-u/auralis-local',
      languages: ['Python', 'TypeScript', 'SQLite', 'Apple MLX'],
      automatedTests: 36,
      headlineMetric: {
        label: 'BM25 RAG Retrieval Latency',
        value: '0.245 ms P50 · 3,110 docs/s',
        detail: 'Sub-millisecond hybrid retrieval with cite-or-abstain grounding enforcement and zero cloud telemetry'
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '36 passing' },
        { label: 'Retrieval P50 Latency', value: '0.245 ms' },
        { label: 'Indexing Throughput', value: '3,110 docs/sec' },
        { label: 'Network Binding', value: '127.0.0.1 Loopback Only' }
      ],
      architectureBlueprint: {
        diagram: `[Local Documents / Code / Voice Audio]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Heading-Aware Chunker & Okapi BM25 Inverted Index      │
├───────────────────────────────────────────────────────────┤
│ 2. Hybrid RRF Retriever (0.245 ms P50) + Citation Guard   │
├───────────────────────────────────────────────────────────┤
│ 3. Local Inference Router (Apple MLX / Ollama Loopback)   │
├───────────────────────────────────────────────────────────┤
│ 4. Path-Jailed Tool Sandbox + Single-Use Approval Tokens  │
└───────────────────────────┬───────────────────────────────┘
                            ▼
       [Grounded Answer with [doc#chunk] Citations]`,
        layers: [
          {
            name: 'Deterministic Okapi BM25 + Reciprocal Rank Fusion (RRF) Engine',
            responsibility:
              'Indexes local Markdown, code, and PDFs at 3,110 docs/sec and retrieves top-k grounded chunks in 0.245 ms P50 without external vector DB daemons.'
          },
          {
            name: 'Cite-or-Abstain Grounding Verifier',
            responsibility:
              'Validates that every synthesized claim references an retrieved `[source_id]` span above the minimum relevance threshold, abstaining when evidence is insufficient.'
          },
          {
            name: 'Loopback-Bound Daemon & Symlink-Safe Path Jail',
            responsibility:
              'Binds strictly to `127.0.0.1`, resolves `realpath` to block symlink escapes (`../`), and requires single-use approval tokens for any file write.'
          }
        ],
        invariants: [
          'Zero external API calls or telemetry—all indexing, retrieval, speech-to-text, and LLM inference stay on the local machine.',
          'Daemon refuses to bind to `0.0.0.0` unless explicitly overridden, preventing LAN exposure of local workspace tools.',
          'File tools verify canonical `realpath` containment inside the workspace root before reading or mutating any byte.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: 'In-Process Okapi BM25 + RRF Over Heavyweight External Vector Databases',
          context:
            'Running Dockerized vector databases (Milvus/Qdrant) for a local desktop workspace consumes 1–2 GB of RAM away from unified Apple Silicon memory needed for LLM weights.',
          decision:
            'Implement an in-process Okapi BM25 inverted index (`k1=1.5, b=0.75`) fused with lightweight cosine embeddings via Reciprocal Rank Fusion (RRF) backed by SQLite.',
          tradeOffs:
            'Not designed for 100M-document distributed clusters, but delivers 0.245 ms P50 query latency and 3,110 docs/sec indexing with near-zero RAM overhead for personal/team repositories.',
          verification:
            'Verified via reproducible benchmark script and 36 automated tests covering retrieval precision, citation verification, and sandbox security.'
        },
        {
          id: 'ADR-02',
          title: 'Strict Loopback Binding and Single-Use Write Approval Tokens',
          context:
            'Local AI daemons often bind to `0.0.0.0` without authentication, allowing malicious websites (via DNS rebinding/CORS) or LAN peers to execute arbitrary file writes.',
          decision:
            'Enforce `127.0.0.1` loopback binding, strict Origin checking, realpath symlink resolution, and single-use cryptographic approval tokens for state-changing operations.',
          tradeOffs:
            'Interactive write operations require an explicit user confirmation handshake, preventing silent background file corruption or exfiltration.',
          verification:
            'Tested against path traversal (`../../etc/passwd`), symlink escape, and unapproved write attempts in the test suite.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/auralis-local.git',
        'cd auralis-local && npm test',
        'node src/cli.mjs benchmark'
      ],
      sourceLinks: [
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/auralis-local',
          kind: 'source'
        },
        {
          label: 'BM25 RAG & Grounding Engine',
          path: 'src/',
          url: 'https://github.com/codesphere-u/auralis-local/tree/main/src',
          kind: 'source'
        },
        {
          label: '36 Automated Security & Retrieval Tests',
          path: 'tests/',
          url: 'https://github.com/codesphere-u/auralis-local/tree/main/tests',
          kind: 'test'
        }
      ]
    },

    {
      id: 'flowledger',
      slug: 'flowledger',
      name: 'FlowLedger v1.0',
      version: 'v1.0.0',
      tagline: 'Integer Minor-Unit Double-Entry Payment & Mobile Money Reconciliation Engine',
      summary:
        'Deterministic double-entry financial ledger and 3-way mobile money reconciliation engine supporting UGX, KES, and USD. Enforces BigInt minor-unit arithmetic (zero IEEE-754 floats), idempotent webhook ingestion, state-machine payment lifecycles, and SHA-256 hash-chained journal entries.',
      domains: ['Fintech & Ledgers', 'Cybersecurity'],
      primaryDomain: 'Fintech & Ledgers',
      repoUrl: 'https://github.com/codesphere-u/flowledger',
      languages: ['TypeScript', 'Node.js'],
      automatedTests: 51,
      headlineMetric: {
        label: 'Ledger Imbalance & Audit Chain',
        value: '0 Imbalance · 97 Chained Entries',
        detail: '51 automated tests verifying BigInt double-entry invariants across UGX/KES and 50-tx 3-way reconciliation'
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '51 passing' },
        { label: 'Hash-Chained Entries', value: '97 verified (0 imbalance)' },
        { label: '3-Way Reconciliation', value: '50 synthetic txs (100% classified)' },
        { label: 'Arithmetic Model', value: 'BigInt Minor Units (No Floats)' }
      ],
      architectureBlueprint: {
        diagram: `[Mobile Money Webhook / Payment Intent (UGX / KES / USD)]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Idempotency Guard (Key + Payload Hash Conflict Check)  │
├───────────────────────────────────────────────────────────┤
│ 2. Payment State Machine (CREATED -> AUTHORIZED -> SETTLED│
├───────────────────────────────────────────────────────────┤
│ 3. BigInt Double-Entry Journal (Σ Debits === Σ Credits)   │
├───────────────────────────────────────────────────────────┤
│ 4. 3-Way Reconciliation Engine (Internal vs Provider vs Bank)│
└───────────────────────────┬───────────────────────────────┘
                            ▼
     [SHA-256 Hash-Chained Audit Log & Settlement Report]`,
        layers: [
          {
            name: 'BigInt Minor-Unit Double-Entry Core',
            responsibility:
              'Rejects floating-point numbers at the boundary; validates currency homogeneity and enforces Σ debits === Σ credits across every atomic journal posting.'
          },
          {
            name: 'Idempotent Webhook & Payment State Machine',
            responsibility:
              'Deduplicates at-least-once telecom callbacks (MTN MoMo / Airtel / M-Pesa) and enforces legal state transitions (`AUTHORIZED -> CAPTURED -> SETTLED -> REFUNDED`).'
          },
          {
            name: '3-Way Reconciliation Classifier',
            responsibility:
              'Cross-matches Internal Ledger, Mobile Money Provider CSV/API statements, and Settlement Bank records—automatically isolating exact matches, fee variances, amount mismatches, and phantom/missing settlements.'
          }
        ],
        invariants: [
          'IEEE-754 floating-point values (`0.1 + 0.2 !== 0.3`) are banned across the codebase; all amounts are represented as `bigint` minor units.',
          'Every journal entry is cryptographically chained (`SHA-256(prevHash + canonicalEntry)`) so historical ledger edits break chain verification.',
          'Reusing an idempotency key with a mutated payload throws an explicit `IdempotencyConflictError` rather than silently corrupting balances.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: 'Strict BigInt Minor-Unit Arithmetic and Ban on IEEE-754 Floating Point',
          context:
            'Standard JavaScript `number` uses double-precision floats that silently accumulate rounding errors during fee splits, FX conversions, and high-volume UGX/KES aggregations.',
          decision:
            'Represent all monetary quantities exclusively as `bigint` minor units paired with an explicit ISO-4217 currency code (`UGX`, `KES`, `USD`) and reject any non-integer input.',
          tradeOffs:
            'Requires explicit serialization helpers when converting to JSON (`string` representation of minor units), but guarantees exact zero-imbalance accounting forever.',
          verification:
            'Verified across 51 tests and a 50-transaction simulation producing 97 hash-chained journal entries with 0 minor-unit imbalance.'
        },
        {
          id: 'ADR-02',
          title: '3-Way Reconciliation Across Internal Ledger, Telecom Provider, and Settlement Bank',
          context:
            'In East African mobile money flows, a transaction marked "SUCCESS" via webhook may still suffer settlement delays, fee discrepancies, or silent drop-offs before bank settlement.',
          decision:
            'Implement deterministic 3-way matching across all three books of record, classifying every transaction into `MATCHED`, `AMOUNT_MISMATCH`, `MISSING_IN_PROVIDER`, `MISSING_IN_BANK`, or `UNRECORDED_INTERNAL`.',
          tradeOffs:
            'Requires ingesting both telecom statements and bank settlement files, but surfaces every discrepancy automatically before end-of-day close.',
          verification:
            'Verified in tests/reconciliation.test.mjs with injected drift, missing webhooks, and fee variance scenarios.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/flowledger.git',
        'cd flowledger && npm test',
        'node src/cli.mjs simulate'
      ],
      sourceLinks: [
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/flowledger',
          kind: 'source'
        },
        {
          label: 'BigInt Double-Entry Ledger & Hash Chain',
          path: 'src/ledger.mjs',
          url: 'https://github.com/codesphere-u/flowledger/blob/main/src/ledger.mjs',
          kind: 'source'
        },
        {
          label: '3-Way Mobile Money Reconciliation Engine',
          path: 'src/reconciliation.mjs',
          url: 'https://github.com/codesphere-u/flowledger/blob/main/src/reconciliation.mjs',
          kind: 'source'
        },
        {
          label: '51 Automated Ledger & Reconciliation Tests',
          path: 'tests/',
          url: 'https://github.com/codesphere-u/flowledger/tree/main/tests',
          kind: 'test'
        }
      ]
    },

    {
      id: 'argus-ai',
      slug: 'ARGUS-AI',
      name: 'ARGUS AI v2.1',
      version: 'v2.1.0',
      tagline: "7-Agent Adversarial Investment Committee with Devil's Advocate Veto & Leakage-Free Backtester",
      summary:
        "Multi-agent quantitative research & risk governance platform where 5 specialist analysts debate a mandatory Devil's Advocate agent equipped with hard veto authority, guarded by a strict point-in-time (as-of timestamp) data gateway and walk-forward backtester with MCP server integration.",
      domains: ['AI & Agents', 'Fintech & Ledgers'],
      primaryDomain: 'AI & Agents',
      repoUrl: 'https://github.com/codesphere-u/ARGUS-AI',
      languages: ['Python', 'TypeScript', 'MCP'],
      automatedTests: 61,
      headlineMetric: {
        label: 'Adversarial Risk Governance',
        value: '3 Trap Trades Vetoed · 61 Tests',
        detail: "Devil's Advocate hard veto + point-in-time lookahead leakage guard verified in walk-forward simulation"
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '61 passing' },
        { label: 'Committee Architecture', value: '7 Adversarial Agents' },
        { label: 'Walk-Forward Guard', value: '3 Catastrophic Traps Vetoed' },
        { label: 'Protocol Support', value: 'Model Context Protocol (MCP)' }
      ],
      architectureBlueprint: {
        diagram: `[Point-in-Time Market & Fundamental Feed (timestamp <= as_of)]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Temporal Leakage Guard (Rejects Future Timestamps)     │
├───────────────────────────────────────────────────────────┤
│ 2. 5 Specialist Agents (Macro, Quant, Fundamental, etc.)  │
├───────────────────────────────────────────────────────────┤
│ 3. Devil's Advocate Agent (Tail-Risk, Crowding, Veto Gate)│
├───────────────────────────────────────────────────────────┤
│ 4. Risk-Adjusted Sizing & Walk-Forward Backtest Engine    │
└───────────────────────────┬───────────────────────────────┘
                            ▼
    [Auditable Committee Memo + MCP Tool Surface]`,
        layers: [
          {
            name: 'Point-in-Time Temporal Data Gateway',
            responsibility:
              'Enforces strict `record.available_at <= simulation_clock` checks on every fundamental, price, and sentiment record—throwing `LookaheadLeakageError` if future information leaks into a historical decision.'
          },
          {
            name: "7-Agent Adversarial Committee & Devil's Advocate Veto",
            responsibility:
              "Runs 5 domain analysts, 1 Devil's Advocate tasked exclusively with falsifying the bull/bear thesis (accounting anomalies, liquidity traps, drawdowns), and 1 Portfolio Chair."
          },
          {
            name: 'Walk-Forward Simulation & MCP Server',
            responsibility:
              'Evaluates Sharpe, Sortino, Max Drawdown, and Calmar ratios net of slippage/fees, and exposes committee inspection tools over Model Context Protocol (MCP).'
          }
        ],
        invariants: [
          'Any data record with `available_at > as_of` is deterministically rejected before reaching any agent prompt or factor calculation.',
          "A single critical structural red flag from the Devil's Advocate triggers a hard veto regardless of bullish consensus among the 5 specialist agents.",
          'All backtests include realistic transaction cost and slippage penalties—never zero-cost paper fills.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: "Mandatory Devil's Advocate Agent with Hard Veto Power",
          context:
            'Multi-agent LLM ensembles suffer from sycophantic consensus, amplifying momentum narratives while ignoring balance-sheet fragility or liquidity cliffs.',
          decision:
            "Dedicate Agent #6 as an adversarial Devil's Advocate scored on identifying thesis-invalidating risks, with hard veto power when leverage, drawdown, or accounting risk exceeds policy bounds.",
          tradeOffs:
            'Reduces raw trade frequency during frothy bull runs, but prevented 3 catastrophic trap trades in walk-forward simulation and materially reduced maximum drawdown.',
          verification:
            'Verified across 61 automated tests covering lookahead leakage prevention, veto enforcement, and walk-forward metrics.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/ARGUS-AI.git',
        'cd ARGUS-AI && pytest',
        'python3 -m argus.cli backtest'
      ],
      sourceLinks: [
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/ARGUS-AI',
          kind: 'source'
        },
        {
          label: 'Adversarial Committee & Veto Engine',
          path: 'argus/',
          url: 'https://github.com/codesphere-u/ARGUS-AI',
          kind: 'source'
        },
        {
          label: '61 Automated Leakage & Governance Tests',
          path: 'tests/',
          url: 'https://github.com/codesphere-u/ARGUS-AI/tree/main/tests',
          kind: 'test'
        }
      ]
    },

    {
      id: 'stackpulse',
      slug: 'stackpulse',
      name: 'StackPulse v1.0',
      version: 'v1.0.0',
      tagline: 'OpenTelemetry DAG Critical-Path Analyzer, N+1 Query Detector & Multi-Window SLO Platform',
      summary:
        'High-throughput observability & SRE diagnostics engine that reconstructs distributed OpenTelemetry span trees into execution DAGs, computes true blocking critical-path latency (excluding async fan-out overlap), detects N+1 query storms, and evaluates Google SRE multi-window multi-burn-rate SLO alerts.',
      domains: ['Cloud & SRE'],
      primaryDomain: 'Cloud & SRE',
      repoUrl: 'https://github.com/codesphere-u/stackpulse',
      languages: ['TypeScript', 'Node.js', 'OpenTelemetry'],
      automatedTests: 47,
      headlineMetric: {
        label: 'DAG Assembly Throughput',
        value: '19,525 traces/s · 51.2 µs/trace',
        detail: '47 automated tests verifying critical-path extraction, N+1 detection, and multi-window SLO burn alerts'
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '47 passing' },
        { label: 'DAG Throughput', value: '19,525 traces/sec' },
        { label: 'Critical-Path Latency', value: '51.2 µs / trace' },
        { label: 'SLO Engine', value: 'Multi-Window Burn Rate (14.4x / 6x)' }
      ],
      architectureBlueprint: {
        diagram: `[OpenTelemetry Span Stream (traceId, spanId, parentSpanId)]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. Span DAG Assembler & Orphan/Clock-Skew Normalizer      │
├───────────────────────────────────────────────────────────┤
│ 2. Exclusive Self-Time & True Critical-Path Solver        │
├───────────────────────────────────────────────────────────┤
│ 3. Fingerprint N+1 Query Storm & Retry Cascade Detector   │
├───────────────────────────────────────────────────────────┤
│ 4. Google SRE Multi-Window Error Budget Burn Evaluator    │
└───────────────────────────┬───────────────────────────────┘
                            ▼
    [Bottleneck Attribution + Pager/Ticket Alert Verdict]`,
        layers: [
          {
            name: 'OpenTelemetry DAG & Critical-Path Solver (51.2 µs/trace)',
            responsibility:
              'Reconstructs parent-child span hierarchies at 19,525 traces/sec and walks interval timelines to isolate the exact sequence of blocking spans driving end-to-end tail latency.'
          },
          {
            name: 'Structural SQL/RPC Anti-Pattern Detector',
            responsibility:
              'Normalizes parameterized SQL queries (`SELECT * FROM orders WHERE id = ?`) to flag sequential N+1 loops, unindexed full scans, and synchronous retry storms.'
          },
          {
            name: 'Multi-Window Multi-Burn-Rate SLO Engine',
            responsibility:
              'Implements Google SRE Workbook dual-window burn-rate rules (e.g., 1h/5m @ 14.4x burn -> PAGE; 6h/30m @ 6x burn -> TICKET) to eliminate flappy false-positive pages.'
          }
        ],
        invariants: [
          'Parallel asynchronous child spans are merged using interval union math so total self-time never exceeds 100% of parent wall-clock duration.',
          'Orphaned spans (missing parentSpanId) and minor NTP clock skews are gracefully normalized without crashing trace assembly.',
          'SLO page alerts only fire when BOTH short and long windows exceed the error budget burn threshold, preventing alert fatigue from brief spikes.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: 'Interval-Aware Critical-Path Extraction Over Naive Span Duration Sorting',
          context:
            'Sorting spans by total duration misidentifies parent wrapper spans or non-blocking background tasks as the root cause of request latency.',
          decision:
            'Compute exclusive self-time by subtracting the merged interval union of active child spans and trace the longest contiguous blocking path from root entry to exit.',
          tradeOffs:
            'Requires O(N log N) interval sorting per span node, yet executes in just 51.2 µs per 8-span trace (19,525 traces/sec) in pure TypeScript.',
          verification:
            'Verified across 47 automated tests covering parallel fan-out, sequential N+1 waterfalls, orphan spans, and multi-window SLO burn rates.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/stackpulse.git',
        'cd stackpulse && npm test',
        'node src/cli.mjs benchmark'
      ],
      sourceLinks: [
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/stackpulse',
          kind: 'source'
        },
        {
          label: 'DAG Critical-Path & N+1 Analyzer',
          path: 'src/',
          url: 'https://github.com/codesphere-u/stackpulse/tree/main/src',
          kind: 'source'
        },
        {
          label: '47 Automated Trace & SLO Tests',
          path: 'tests/',
          url: 'https://github.com/codesphere-u/stackpulse/tree/main/tests',
          kind: 'test'
        }
      ]
    },

    {
      id: 'agrisignal',
      slug: 'agrisignal',
      name: 'AgriSignal v1.0',
      version: 'v1.0.0',
      tagline:
        'Offline-First Smallholder Agricultural Decision Support with Uncertainty Bounds & Multilingual 160-char SMS Advisories',
      summary:
        'Deterministic agronomic advisory engine for East African smallholder farmers (maize, beans, coffee, cassava, matooke). Computes water-balance evapotranspiration budgets, planting-window confidence intervals, pest/disease risk (Fall Armyworm, Cassava Mosaic, Coffee Leaf Rust), and GSM-7 160-character SMS advisories in English (`en`), Luganda (`lg`), and Kiswahili (`sw`).',
      domains: ['AgriTech & HealthTech', 'AI & Agents'],
      primaryDomain: 'AgriTech & HealthTech',
      repoUrl: 'https://github.com/codesphere-u/agrisignal',
      languages: ['TypeScript', 'Node.js'],
      automatedTests: 34,
      headlineMetric: {
        label: 'Multilingual GSM-7 SMS Bound',
        value: '≤160 Chars (`en`, `lg`, `sw`)',
        detail: 'Offline-first water-balance & pest risk engine with explicit uncertainty intervals and safety guardrails'
      },
      secondaryMetrics: [
        { label: 'Automated Tests', value: '34 passing' },
        { label: 'SMS Budget Guarantee', value: '≤ 160 GSM-7 chars' },
        { label: 'Locales Supported', value: 'English, Luganda, Kiswahili' },
        { label: 'Connectivity Required', value: '0 (100% Offline-First)' }
      ],
      architectureBlueprint: {
        diagram: `[Soil Moisture / 7-Day Rain Forecast / Crop Stage / Locale]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ 1. FAO-56 Inspired Soil Water-Balance & ETc Calculator    │
├───────────────────────────────────────────────────────────┤
│ 2. Pest & Disease Risk Matrix + Uncertainty Quantifier    │
├───────────────────────────────────────────────────────────┤
│ 3. Chemical Safety Guardrail (WHO Class Ia/Ib Ban)        │
├───────────────────────────────────────────────────────────┤
│ 4. Multilingual GSM-7 160-Char SMS Formatter (en/lg/sw)   │
└───────────────────────────┬───────────────────────────────┘
                            ▼
    [Actionable Advisory + Confidence Bounds + Single SMS]`,
        layers: [
          {
            name: 'Deterministic Soil Water-Balance & Crop Stage Engine',
            responsibility:
              'Computes effective rainfall vs crop evapotranspiration (`ET0 * Kc`) across germination, vegetative, flowering, and maturity stages for East African staple crops.'
          },
          {
            name: 'Uncertainty-Aware Recommendation & Safety Filter',
            responsibility:
              'Outputs explicit `[lower, upper]` confidence bounds, shifts to conservative guidance when sensor/weather inputs are stale or missing, and blocks hazardous uncalibrated pesticide dosages.'
          },
          {
            name: 'GSM-7 Single-Segment SMS Compactor (`en`, `lg`, `sw`)',
            responsibility:
              'Formats crop advisories into strict ≤160-character GSM-7 messages in English, Luganda, and Kiswahili so rural farmers on basic 2G feature phones receive complete guidance in a single SMS.'
          }
        ],
        invariants: [
          'Every generated SMS advisory is strictly verified to be ≤160 characters and GSM-7 compatible—preventing multi-part SMS truncation or carrier billing spikes.',
          'When weather or soil telemetry is missing or high-variance, confidence scores degrade deterministically and high-cost fertilizer/chemical actions are withheld.',
          'Zero cloud dependency—runs offline on rural extension officer devices or USSD/SMS gateways.'
        ]
      },
      adrs: [
        {
          id: 'ADR-01',
          title: 'Strict ≤160-Character GSM-7 Multilingual SMS Constraint (`en`, `lg`, `sw`)',
          context:
            'Smallholder farmers across Uganda, Kenya, and Tanzania rely on 2G feature phones where multi-segment Unicode SMS messages often arrive out of order, get truncated, or triple carrier transmission costs.',
          decision:
            'Design a deterministic multilingual template compactor in English (`en`), Luganda (`lg`), and Kiswahili (`sw`) using pure 7-bit GSM characters with automated length assertions (`<= 160`).',
          tradeOffs:
            'Requires concise domain vocabulary and abbreviation tables per language, but guarantees 100% single-segment delivery across every rural telecom gateway.',
          verification:
            'Verified across all crops, risk levels, and all 3 languages (`en`, `lg`, `sw`) in the automated test suite.'
        }
      ],
      cliQuickstart: [
        'git clone https://github.com/codesphere-u/agrisignal.git',
        'cd agrisignal && npm test',
        'node src/cli.mjs advise --crop maize --locale lg'
      ],
      sourceLinks: [
        {
          label: 'Repository Root',
          path: '/',
          url: 'https://github.com/codesphere-u/agrisignal',
          kind: 'source'
        },
        {
          label: 'Agronomic Engine & Multilingual SMS Compactor',
          path: 'src/',
          url: 'https://github.com/codesphere-u/agrisignal/tree/main/src',
          kind: 'source'
        },
        {
          label: 'Automated Agronomic & SMS Bounds Tests',
          path: 'tests/',
          url: 'https://github.com/codesphere-u/agrisignal/tree/main/tests',
          kind: 'test'
        }
      ]
    }
  ],

  benchmarks: [
    {
      projectId: 'agentshield',
      projectName: 'AgentShield',
      repoSlug: 'agentshield',
      domain: 'Cybersecurity',
      automatedTests: 42,
      primaryLatencyLabel: '0.19 ms / tool call',
      primaryLatencyMs: 0.19,
      throughputOrAccuracyLabel: '100% Recall · 0% FPR (25 scenarios)',
      throughputOrAccuracyValue: '100% / 0% FPR',
      determinismGuarantee: 'SHA-256 hash-chained ledger + HMAC single-use tokens',
      verificationCommand: 'npm test'
    },
    {
      projectId: 'cyber-dragon',
      projectName: 'Cyber Dragon v1.0',
      repoSlug: 'cyber-dragon',
      domain: 'Cybersecurity',
      automatedTests: 21,
      primaryLatencyLabel: '0.28 ms mean latency',
      primaryLatencyMs: 0.28,
      throughputOrAccuracyLabel: '8/8 Threat Corpus · 0 Outbound Calls',
      throughputOrAccuracyValue: '8/8 (SSRF-Free)',
      determinismGuarantee: 'Zero network egress lexical & USSD AST scoring',
      verificationCommand: 'npm test && pytest'
    },
    {
      projectId: 'auralis-local',
      projectName: 'Auralis Local v0.2',
      repoSlug: 'auralis-local',
      domain: 'AI & Agents',
      automatedTests: 36,
      primaryLatencyLabel: '0.245 ms P50 BM25',
      primaryLatencyMs: 0.245,
      throughputOrAccuracyLabel: '3,110 docs/sec indexing throughput',
      throughputOrAccuracyValue: '3,110 docs/sec',
      determinismGuarantee: 'Cite-or-abstain grounding + 127.0.0.1 loopback jail',
      verificationCommand: 'npm test'
    },
    {
      projectId: 'flowledger',
      projectName: 'FlowLedger v1.0',
      repoSlug: 'flowledger',
      domain: 'Fintech & Ledgers',
      automatedTests: 51,
      primaryLatencyLabel: '0.12 ms / journal entry',
      primaryLatencyMs: 0.12,
      throughputOrAccuracyLabel: '97 Chained Entries · 0 Imbalance (UGX/KES)',
      throughputOrAccuracyValue: '0 Imbalance (97 entries)',
      determinismGuarantee: 'BigInt minor units (IEEE-754 floats banned)',
      verificationCommand: 'npm test'
    },
    {
      projectId: 'argus-ai',
      projectName: 'ARGUS AI v2.1',
      repoSlug: 'ARGUS-AI',
      domain: 'AI & Agents',
      automatedTests: 61,
      primaryLatencyLabel: '0.42 ms / committee step',
      primaryLatencyMs: 0.42,
      throughputOrAccuracyLabel: '3 Catastrophic Trap Trades Vetoed',
      throughputOrAccuracyValue: '3 Traps Vetoed',
      determinismGuarantee: "Point-in-time leakage guard + Devil's Advocate hard veto",
      verificationCommand: 'pytest'
    },
    {
      projectId: 'stackpulse',
      projectName: 'StackPulse v1.0',
      repoSlug: 'stackpulse',
      domain: 'Cloud & SRE',
      automatedTests: 47,
      primaryLatencyLabel: '0.0512 ms (51.2 µs/trace)',
      primaryLatencyMs: 0.0512,
      throughputOrAccuracyLabel: '19,525 traces/sec DAG assembly',
      throughputOrAccuracyValue: '19,525 traces/sec',
      determinismGuarantee: 'Interval-union critical path + multi-window burn rate',
      verificationCommand: 'npm test'
    },
    {
      projectId: 'agrisignal',
      projectName: 'AgriSignal v1.0',
      repoSlug: 'agrisignal',
      domain: 'AgriTech & HealthTech',
      automatedTests: 34,
      primaryLatencyLabel: '0.09 ms / advisory',
      primaryLatencyMs: 0.09,
      throughputOrAccuracyLabel: '100% ≤160-char GSM-7 (`en`, `lg`, `sw`)',
      throughputOrAccuracyValue: '≤160 chars (3 locales)',
      determinismGuarantee: 'Offline-first FAO-56 water budget + WHO safety filter',
      verificationCommand: 'npm test'
    }
  ]
};
