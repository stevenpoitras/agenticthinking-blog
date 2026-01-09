---
layout: post
title: "The MCP Mental Model"
date: 2026-01-08
tags:
  - blog
  - mcp
  - agentic-ai
  - architecture
  - developer
  - sdk
---

This post is the **conceptual foundation** for the MCP series. If you want the mental model and decision framework, start here. If you want implementation stories, read [MCP in Practice: From Scripts to Platform](/blog/mcp-server-unified-sdk/) (Part 1) and [MCP in Practice: Knowledge-First Builder](/blog/mcp-knowledge-first-builder/) (Part 2).<!--more-->

**Thesis:** MCP (Model Context Protocol) is an interface layer that makes system capabilities legible to AI assistants. It doesn't make models smarter—it makes your system's boundaries, definitions, and actions explicit. Understanding MCP's primitives and when to use each is the difference between a coherent integration and a fragile one.

---

## MCP as an Enabling Layer

MCP emerged from a practical problem: AI assistants need context, and that context was being copy-pasted, embedded in prompts, or reinvented per-integration. MCP provides a structured interface where capabilities can be defined once and consumed by any compatible client.

**Critical framing:** MCP is infrastructure, not intelligence. It doesn't replace reasoning—it feeds it. The model still plans, synthesizes, and decides. MCP gives it access to facts, actions, and boundaries.

## What MCP Is—And Is Not

MCP is a protocol for exposing structured capabilities to AI assistants. A server defines tools (actions), resources (static context), and prompts (templates). Clients connect and discover what's available.

**MCP is not RAG.** RAG retrieves unstructured text based on similarity. MCP exposes structured capabilities with explicit interfaces.

**MCP is not embeddings-only.** Embeddings power semantic search. MCP defines *exactly* what's available and how to use it.

**MCP is not hardcoded prompt context.** You could embed knowledge directly in prompts. MCP makes that knowledge queryable and updateable without prompt surgery.

**MCP is not tool calling alone.** Tool calling is one primitive. MCP adds resources, prompts, and a discovery mechanism—a complete capability layer.

> **MCP is infrastructure for context.** It makes capabilities explicit, bounded, and reusable.

## MCP Core Primitives

### Tools

**What it is:** A function with typed inputs and outputs that performs an action or retrieves information.

**What problem it solves:** Without tools, models can only generate text. Tools give them agency.

```javascript
{
  name: "sync_persona",
  description: "Sync an AI Employee from source to target environment.",
  inputSchema: {
    properties: {
      name: { type: "string" },
      target_env: { type: "string" },
      dry_run: { type: "boolean" }
    },
    required: ["name", "target_env"]
  }
}
```

**When to use:** Actions with side effects, queries against live systems, operations requiring parameters.

**When NOT to use:** Static documentation (use resources), predefined flows (use prompts), latency-sensitive operations.

**Realistic example:** An AI debugging a sync failure calls `compare_ai_employees({ persona_id_1: "abc", persona_id_2: "xyz" })` to see exactly which fields differ—structured diff output instead of parsing logs.

---

### Resources

**What it is:** Static or semi-static content—documentation, configuration, reference data.

**What problem it solves:** Embedding all context in prompts doesn't scale. Resources let models pull context on demand.

```javascript
{
  uri: "ema://schemas/workflow-definition",
  name: "Workflow Schema",
  mimeType: "application/json"
}
```

**When to use:** Reference docs, stable configuration, glossaries, schemas.

**When NOT to use:** Frequently-changing data, parameterized queries, computed content.

**Realistic example:** Before generating a workflow, the model fetches the workflow schema to understand valid node types—no prompt changes required when the schema evolves.

---

### Prompts

**What it is:** Predefined interaction templates that guide common usage patterns.

**What problem it solves:** Without prompts, every invocation starts from scratch. Prompts codify expert knowledge into reusable patterns.

```javascript
{
  name: "create-ai-employee",
  arguments: [
    { name: "use_case", required: true },
    { name: "trigger_type", required: true }
  ]
}
```

**When to use:** Multi-step workflows with predictable structure, onboarding flows, complex operations with guardrails.

**When NOT to use:** One-off queries, highly variable interactions, simple tool invocations.

**Realistic example:** A "create-ai-employee" prompt guides the builder through qualifying questions, agent selection, workflow patterns, and validation—ensuring the model doesn't skip requirements gathering.

## How MCP Is Used in Practice

### During Agent Execution

MCP fits into agent loops as the knowledge and action layer:

```
User Request → Agent Reasoning → MCP Discovery → Tool Invocation → Response Synthesis
                     ↑                                    ↓
                     └────────── Context from Resources ──┘
```

### Querying for Definitions

When a model encounters ambiguous terminology, MCP provides authoritative definitions:

```javascript
get_platform_concept({ term: "AI Employee" })
// → { definition: "A configured persona...", aliases: ["Persona"] }
```

### Grounding Actions Before Execution

Before invoking a tool, the model can validate:

```javascript
check_type_compatibility({ source: "SEARCH_RESULTS", target: "STRING" })
// → { compatible: false, reason: "Use respond_with_sources instead" }
```

Errors caught before execution, not after.

## When MCP Is the Right Abstraction

| Use MCP When... | Don't Use MCP When... |
|-----------------|----------------------|
| Multiple consumers need shared capabilities | Single consumer, single integration |
| Definitions must stay consistent across clients | Context is purely local |
| You need explicit capability boundaries | You're optimizing for raw latency |
| Tool behavior should be self-documenting | The operation is trivially simple |
| Context changes faster than prompts can update | Context is stable and fits in prompts |

### Signals You Should Use MCP

- You're copy-pasting context into multiple prompts
- Different team members have different "versions" of how tools work
- AI assistants are guessing at system behavior instead of knowing it

### Common Anti-Patterns

- **Putting everything in MCP:** Not all context needs protocol overhead.
- **Using resources for dynamic data:** If it changes per-request, it's a tool.
- **Skipping tool descriptions:** Sparse descriptions → confused models.
- **Treating MCP as the reasoning layer:** MCP provides facts. The model reasons.

## MCP + Reasoning: The Boundary

**MCP provides:** Facts, definitions, constraints, actions, references.

**LLM reasoning provides:** Synthesis, judgment, planning, decision-making.

These are different layers. Mixing them causes problems. When facts live in reasoning, the model hallucinates definitions. When reasoning lives in MCP, tools become unpredictable.

**The healthy separation:**
- MCP tool: `get_agent_inputs({ agent: "chat_categorizer" })` → returns explicit schema
- Model reasoning: "Given these inputs, I need to connect the trigger's output to the categorizer's input"

MCP improves reliability (facts are facts) without reducing flexibility (the model still reasons).

## Relationship to the Series

This post explains *what MCP is* and *when to use it*. The companion posts show it in action:

- [MCP in Practice: From Scripts to Platform](/blog/mcp-server-unified-sdk/) — The journey from script sprawl to unified SDK to MCP server
- [MCP in Practice: Knowledge-First Builder](/blog/mcp-knowledge-first-builder/) — Extending MCP with domain expertise for intelligent building

The key insight: MCP is a tool earned through scale. If you have one script for one use case, you don't need MCP. When you have multiple consumers, evolving definitions, and AI assistants that need to understand your system—that's when MCP pays off.

Don't start with MCP. Earn it.

## Common Misconceptions

**"MCP is just RAG"** — No. RAG retrieves similar text. MCP exposes structured, typed capabilities.

**"MCP replaces prompts"** — No. MCP complements prompts. Prompts guide behavior; MCP provides facts and actions.

**"MCP makes models smarter"** — No. MCP makes your system legible. The model's reasoning is unchanged—it just has better inputs.

**"Put everything in MCP"** — No. Static context that fits in prompts can stay there. Use MCP for dynamic capabilities and shared definitions.

## What to Do Next

**If you're building agents today:**
- Identify where you're copy-pasting context between prompts
- List the tools your agents need (actions + queries)
- Define your capability boundary: what's inside vs. outside

**If you're feeling prompt sprawl:**
- Consider which definitions should be queryable, not embedded
- Look for tribal knowledge that should be explicit

**If you're struggling with grounding:**
- Start with a glossary resource—terms and their meanings
- Add validation tools that catch errors before execution
- Build discovery tools so models can ask "what can I do?"

---

*This post is the conceptual foundation for the MCP series. [Part 1](/blog/mcp-server-unified-sdk/) shows the implementation journey, and [Part 2](/blog/mcp-knowledge-first-builder/) shows how to extend MCP with domain expertise.*<!--tomb-->

