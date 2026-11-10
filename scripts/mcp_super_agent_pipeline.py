#!/usr/bin/env python3
"""CodeSphere MCP Super-Agent Pipeline Demonstration.

Demonstrates end-to-end autonomous agent orchestration across all 4 production MCP servers:
1. synapse-router: Task complexity classification & cost-aware routing
2. cortex-mcp: Bi-temporal memory retrieval & context compilation
3. agentflight: Tool definition ergonomics linting & circuit-breaker checks
4. patchpilot: AST unified diff auditing & anti-reward-hacking verification
5. cortex-mcp: Continuous learning episode recording
"""

from __future__ import annotations

import json
import sys
import time
import urllib.request

ENDPOINTS = {
    "cortex": "https://cortex-mcp-steel.vercel.app/mcp",
    "agentflight": "https://agentflight-tau.vercel.app/mcp",
    "synapse": "https://synapse-router.vercel.app/mcp",
    "patchpilot": "https://patchpilot-eta.vercel.app/mcp",
}


def call_mcp(server_key: str, method: str, params: dict | None = None) -> dict:
    url = ENDPOINTS[server_key]
    payload = {"jsonrpc": "2.0", "id": int(time.time() * 1000) % 100000, "method": method}
    if params is not None:
        payload["params"] = params
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=15) as resp:
        duration_ms = (time.perf_counter() - t0) * 1000
        res = json.loads(resp.read().decode("utf-8"))
        if "error" in res:
            raise RuntimeError(f"[{server_key}] {method} failed: {res['error']}")
        return res.get("result", {}), duration_ms


def main() -> int:
    print("=" * 80)
    print(" 🚀 CODESPHERE MCP SUPER-AGENT ORCHESTRATION PIPELINE")
    print("    Targeting 4 Live Vercel Production Serverless Gateways")
    print("=" * 80)

    task_prompt = "Fix payment_ledger idempotency invariant and transaction isolation level"
    print(f"\n[Task Goal]: \"{task_prompt}\"")

    # Step 1: Synapse Router
    print("\n--- [Step 1: synapse-router] Complexity Classification & Routing ---")
    res, lat = call_mcp("synapse", "tools/call", {
        "name": "classify_task_complexity",
        "arguments": {"prompt": task_prompt}
    })
    print(f"  ✓ Complexity Analysis ({lat:.1f} ms):")
    res_text = res.get("content", [{}])[0].get("text", "{}")
    c_info = json.loads(res_text)
    print(f"    - Complexity Score: {c_info.get('complexity_score')} (tokens: {c_info.get('estimated_input_tokens')})")
    print(f"    - Recommended Tier: {c_info.get('recommended_tier')}")

    # Step 2: Cortex MCP
    print("\n--- [Step 2: cortex-mcp] Bi-Temporal Working Memory Retrieval ---")
    res, lat = call_mcp("cortex", "tools/call", {
        "name": "memory_compile_context",
        "arguments": {"query": "payment_ledger idempotency invariant isolation_level", "max_tokens": 600}
    })
    res_text = res.get("content", [{}])[0].get("text", "{}")
    m_info = json.loads(res_text) if res_text.startswith("{") else {"markdown": res_text}
    print(f"  ✓ Compiled Active Context ({lat:.1f} ms):")
    print(f"    - Active Token Budget: {m_info.get('token_count', 'OK')} tokens")
    print(f"    - Stale Facts Suppressed: {m_info.get('stale_facts_suppressed', 0)}")

    # Step 3: AgentFlight
    print("\n--- [Step 3: agentflight] Tool Definition Ergonomics Linting ---")
    candidate_tools = [
        {"name": "patch_ledger", "description": "Applies a balance mutation to the payment ledger.", "inputSchema": {"type": "object", "properties": {"mutation_json": {"type": "string", "description": "Valid ledger balance mutation."}}, "required": ["mutation_json"]}}
    ]
    res, lat = call_mcp("agentflight", "tools/call", {
        "name": "agentflight_lint_tools",
        "arguments": {"tools_json": json.dumps(candidate_tools)}
    })
    res_text = res.get("content", [{}])[0].get("text", "{}")
    af_info = json.loads(res_text)
    print(f"  ✓ Schema Ergonomics Gate ({lat:.1f} ms):")
    print(f"    - Ergonomics Score: {af_info.get('ergonomics_score')}/100 (Grade: {af_info.get('grade')})")
    print(f"    - Findings: {af_info.get('error_count')} errors, {af_info.get('warning_count')} warnings")

    # Step 4: PatchPilot
    print("\n--- [Step 4: patchpilot] AST Anti-Reward-Hacking Code Audit ---")
    candidate_diff = """--- a/src/payments/ledger.py
+++ b/src/payments/ledger.py
@@ -10,3 +10,4 @@
 def mutate_ledger(entry, idempotency_key):
+    assert idempotency_key is not None, "Idempotency key required"
     return db.execute_isolated(entry)
"""
    res, lat = call_mcp("patchpilot", "tools/call", {
        "name": "audit_unified_diff",
        "arguments": {"unified_diff": candidate_diff}
    })
    res_text = res.get("content", [{}])[0].get("text", "{}")
    pp_info = json.loads(res_text)
    print(f"  ✓ Anti-Reward-Hacking Audit ({lat:.1f} ms):")
    print(f"    - Approved: {pp_info.get('approved')}")
    print(f"    - Risk Score: {pp_info.get('risk_score')} (0.0 = zero anti-patterns)")
    print(f"    - SHA-256 Diff ID: {pp_info.get('sha256_diff_id', '')[:16]}...")

    # Step 5: Cortex Memory Episode
    print("\n--- [Step 5: cortex-mcp] Continuous Learning Episode Record ---")
    res, lat = call_mcp("cortex", "tools/call", {
        "name": "memory_record_episode",
        "arguments": {
            "title": "Enforced strict idempotency key assertion on ledger mutation",
            "category": "adr",
            "content": "All mutations to payment_ledger now require a non-null idempotency_key.",
            "files_touched": ["src/payments/ledger.py"],
            "entities_mentioned": ["payment_ledger"]
        }
    })
    res_text = res.get("content", [{}])[0].get("text", "{}")
    ep_info = json.loads(res_text)
    print(f"  ✓ Recorded Episode in Bi-Temporal Graph ({lat:.1f} ms):")
    print(f"    - Episode ID: {ep_info.get('episode', {}).get('id')}")
    print(f"    - SHA-256 Digest: {ep_info.get('episode', {}).get('sha256', '')[:16]}...")

    # Verification Resource Read
    print("\n--- [Final Verification: Resources Inspection] ---")
    res_cortex, lat1 = call_mcp("cortex", "resources/read", {"uri": "cortex://graph/summary"})
    res_patch, lat2 = call_mcp("patchpilot", "resources/read", {"uri": "patchpilot://rules/catalog"})
    print(f"  ✓ cortex://graph/summary ({lat1:.1f} ms): {res_cortex['contents'][0]['text'][:80]}...")
    print(f"  ✓ patchpilot://rules/catalog ({lat2:.1f} ms): {res_patch['contents'][0]['text'][:80]}...")

    print("\n" + "=" * 80)
    print(" 🎉 ALL 4 MCP SERVERS SUCCESSFULLY ORCHESTRATED IN A SINGLE PIPELINE!")
    print("=" * 80)
    return 0


if __name__ == "__main__":
    sys.exit(main())
