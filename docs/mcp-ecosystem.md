# CodeSphere MCP Ecosystem & Autonomous Agent Architecture

The **CodeSphere Model Context Protocol (MCP) Ecosystem** provides four specialized, interoperable MCP servers built for production AI coding agents (Claude Code, Cursor, Windsurf, Devin-style test-repair loops). Each server adheres to the tripartite MCP specification (`tools`, `resources`, `prompts`) over **Streamable HTTP** and **Server-Sent Events (SSE)** hosted on Vercel Serverless.

```text
                                  +-------------------------------------------------------------+
                                  |                 Incoming User Engineering Goal              |
                                  |        "Fix idempotency bug in payment_ledger.py"           |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 v
                                  +-------------------------------------------------------------+
                                  | 1. SYNAPSE-ROUTER (Cost, Routing & Complexity Triage)      |
                                  |   * classify_task_complexity: Score AST & reasoning depth   |
                                  |   * route_agent_step: Select optimal model tier & budget     |
                                  |   * SimHash Semantic Cache: Instant $0.00 cached hits       |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 v
                                  +-------------------------------------------------------------+
                                  | 2. CORTEX-MCP (Bi-Temporal Memory & Working Context)        |
                                  |   * memory_compile_context: Fetch active facts & ADRs       |
                                  |   * Stale-Fact Suppression: Retired legacy assumptions      |
                                  |   * Provenance Citations: Cryptographic SHA-256 Merkle root |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 v
                                  +-------------------------------------------------------------+
                                  | 3. AGENTFLIGHT (Trajectory Recorder & Loop Breaker)         |
                                  |   * FlightRecorder: Canonical SHA-256 chained tape          |
                                  |   * TrajectoryCircuitBreaker: Loop & token cost trips       |
                                  |   * agentflight_lint_tools: Audit candidate tool schemas    |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 v
                                  +-------------------------------------------------------------+
                                  | 4. PATCHPILOT (Fault Localization & Anti-Reward Hacking)    |
                                  |   * localize_fault: Pinpoint suspect AST slice from trace   |
                                  |   * audit_unified_diff: Guard against RH001-RH008 cheats    |
                                  |   * verify_patch_integrity: Assert zero test tampering      |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 v
                                  +-------------------------------------------------------------+
                                  | 5. CORTEX-MCP (Continuous Learning & Memory Update)         |
                                  |   * memory_record_episode: Persist bug root cause & fix ADR |
                                  |   * memory_upsert_fact: Update active architectural state   |
                                  +-------------------------------------------------------------+
```

---

## The Four MCP Servers

### 1. `cortex-mcp` — Bi-Temporal Working Memory & Context Compiler
* **Production Endpoint**: `https://cortex-mcp-steel.vercel.app/mcp`
* **Interactive Portal**: [`https://cortex-mcp-steel.vercel.app/`](https://cortex-mcp-steel.vercel.app/)
* **Problem**: Multi-session agent amnesia and stale context pollution in `CLAUDE.md` / `.cursorrules`.
* **Solution**: Bi-temporal knowledge graph with automatic conflict detection, singular fact supersession, Okapi BM25 + 2-hop graph spreading activation context compilation, and contradiction auditing.
* **Capabilities**: 7 Tools, 3 Resources (`cortex://graph/summary`, `cortex://graph/integrity`, `cortex://episodes/recent`), 2 Prompts (`architecture-briefing`, `bug-investigation-context`).

### 2. `agentflight` — Black-Box Flight Recorder & Tool-Smell Linter
* **Production Endpoint**: `https://agentflight-tau.vercel.app/mcp`
* **Interactive Portal**: [`https://agentflight-tau.vercel.app/`](https://agentflight-tau.vercel.app/)
* **Problem**: Expensive, non-deterministic agent debugging in CI and "tool smell" schema anti-patterns causing agent hallucination.
* **Solution**: Tamper-evident SHA-256 chained trajectory cassettes replaying in `<0.02ms` with `$0.00` token spend, differential regression detection, real-time circuit breakers, and a deterministic 10-rule static schema ergonomics linter (`TS001`–`TS010`).
* **Capabilities**: 4 Tools, 2 Resources (`agentflight://rules/catalog`, `agentflight://metrics/summary`), 2 Prompts (`lint-tool-definitions`, `review-agent-trajectory`).

### 3. `synapse-router` — Multi-Model Router & Semantic Cache Gateway
* **Production Endpoint**: `https://synapse-router.vercel.app/mcp`
* **Interactive Portal**: [`https://synapse-router.vercel.app/`](https://synapse-router.vercel.app/)
* **Problem**: Wasting 75–90% of token budgets by routing trivial steps to frontier reasoning models, and failing on single-provider rate limits.
* **Solution**: Pareto utility routing across model tiers (`FAST_LOCAL`, `BALANCED`, `FRONTIER_REASONING`), 64-bit SimHash semantic caching, confidence-gated cascade escalation, 3-state circuit breakers, and sliding-window token/USD budget enforcement.
* **Capabilities**: 6 Tools, 2 Resources (`synapse://endpoints/catalog`, `synapse://health/summary`), 2 Prompts (`route-task-advisor`, `budget-allocation-planner`).

### 4. `patchpilot` — Autonomous Code Repair Engine & Anti-Reward-Hacking Verifier
* **Production Endpoint**: `https://patchpilot-eta.vercel.app/mcp`
* **Interactive Portal**: [`https://patchpilot-eta.vercel.app/`](https://patchpilot-eta.vercel.app/)
* **Problem**: Context-window flooding during fault localization and coding agents cheating tests (reward hacking by deleting assertions, skipping tests, or swallowing exceptions).
* **Solution**: Stack-trace + AST call-graph fault localization extracting minimal AST slices, and deterministic AST verification enforcing 8 anti-reward-hacking rules (`RH001`–`RH008`).
* **Capabilities**: 5 Tools, 2 Resources (`patchpilot://rules/catalog`, `patchpilot://stats/overview`), 2 Prompts (`diagnose-and-repair`, `audit-git-diff`).

---

## 1-Click Claude Code Configuration

To connect all four servers in Claude Code simultaneously:

```bash
# Add Cortex MCP
claude mcp add --transport http cortex-mcp https://cortex-mcp-steel.vercel.app/mcp

# Add AgentFlight
claude mcp add --transport http agentflight https://agentflight-tau.vercel.app/mcp

# Add Synapse Router
claude mcp add --transport http synapse-router https://synapse-router.vercel.app/mcp

# Add PatchPilot
claude mcp add --transport http patchpilot https://patchpilot-eta.vercel.app/mcp
```

Or configure via `claude_desktop_config.json` / `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cortex-mcp": {
      "type": "http",
      "url": "https://cortex-mcp-steel.vercel.app/mcp"
    },
    "agentflight": {
      "type": "http",
      "url": "https://agentflight-tau.vercel.app/mcp"
    },
    "synapse-router": {
      "type": "http",
      "url": "https://synapse-router.vercel.app/mcp"
    },
    "patchpilot": {
      "type": "http",
      "url": "https://patchpilot-eta.vercel.app/mcp"
    }
  }
}
```
