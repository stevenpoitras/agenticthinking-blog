---
layout: post
title: "MCP in Practice: From Scripts to Platform"
date: 2026-01-06
tags:
  - blog
  - mcp
  - sdk
  - agentic-ai
  - ema
  - architecture
  - developer
---

It started with a simple request: "Can you sync my AI Employee from demo to dev?" What followed was a journey from one-off scripts to a unified SDK and MCP server—and lessons about when context becomes the bottleneck.<!--more-->

## The Original Problem: Starting with a Point Use Case

Ema's platform has a concept called "AI Employees"—configurable personas that orchestrate workflows, actions, and conversational agents. Each AI Employee lives in an environment: demo for experimentation, dev for integration testing, staging for pre-prod, production for real users. The problem was that creating an AI Employee in demo and then recreating it identically in dev was a manual, error-prone process—copy fields, hope you didn't miss one, manually track which version was current.

I started where most engineers start: a script. Fetch the persona from demo, push it to dev, done. But "done" lasted about a day.

The first script became three scripts. Then I needed change detection. Then someone asked why their workflow actions weren't syncing. Then someone else needed to sync only certain personas. The "quick script" was now a tangle of one-off API calls, environment-specific credentials scattered across terminals, and behavior that varied depending on who ran it and when.

What I had wasn't a tooling problem. It was a **context and structure problem**. The knowledge of "what is this AI Employee, what's its canonical state, and what does it mean to be in sync" was trapped in script logic and tribal knowledge. Every time I wanted a new capability—list synced personas, compare fingerprints across envs, check sync status—I was reinventing the wheel.

## Discovering the Need for MCP

The breakthrough came when I started working inside AI-assisted IDEs like Cursor. I was asking the AI to help me debug sync issues, but it had no idea what an "AI Employee" was, what environments existed, or what "sync status" meant. I found myself pasting the same context snippets over and over: "Here's what environments we have. Here's how personas are structured. Here's how sync tags work."

That's when I realized: the problem wasn't just about me running scripts. It was about making this knowledge **accessible to any consumer**—including AI models, CLI tools, services, and future teammates. I needed:

- **Context reuse:** Define "what is a persona" once, share it everywhere
- **Shared definitions:** Consistent tool interfaces, not bespoke scripts
- **Consistent access:** Same capabilities whether accessed from a model, a CLI, or a scheduler

MCP—the Model Context Protocol—offered exactly this. Unlike embedding logic directly into prompts or building one-off integrations, MCP provides a structured interface layer where capabilities (tools), context (resources), and instructions (prompts) can be defined once and consumed by any compatible client.

The question shifted from "how do I write another script" to **"how do I define the capabilities of this system in a way that's reusable?"**

## MCP in Brief

MCP provides three primitives: **Tools** (actions with typed inputs/outputs), **Resources** (static context), and **Prompts** (interaction templates). For a complete mental model of MCP's primitives and when to use each, see [The MCP Mental Model](/blog/mcp-mental-model/).

What matters for this story: MCP gave me a way to define capabilities once and share them everywhere. The protocol forces you to draw clear boundaries—what's accessible to the model versus what stays hidden as implementation details. In my system, the boundary includes environment names, persona metadata, and sync operations. It excludes raw API responses, bearer tokens, and database internals.

> **Lesson:** Drawing this boundary well is half the work. Too porous and you leak complexity; too restrictive and the model can't do useful work.

## From Point Solution to Platform

By week three of script iteration, I had:

- Duplicate API-calling logic across sync, list, and compare scripts
- Inconsistent environment handling (some scripts used env vars, others hardcoded)
- Config spread across YAML, JSON, and inline code
- Hard-to-debug sync failures because logging was ad-hoc

The pain points crystallized:

| Problem | Symptom |
|---------|---------|
| **Duplicated logic** | Every script reimplemented "connect to environment with auth" |
| **Inconsistent behavior** | Sync behavior varied based on which script version you ran |
| **Hard to reason about** | "What happens if the target persona doesn't exist?" had three different answers |

I was building a sprawl, not a system. The shift toward a unified SDK became inevitable.

## Building the Unified SDK

The SDK became the canonical layer between raw API calls and everything else. It consists of:

### EmaClient

The API wrapper. It handles:

- **Auth:** Bearer token injection
- **Retry logic:** Exponential backoff
- **Endpoint abstraction:** The actual API uses inconsistent naming; the client normalizes it
- **Sync metadata extraction:** Parsing sync tags from descriptions

```javascript
// Before: scattered fetch calls with duplicated auth
const resp = await fetch(url, { 
  headers: { Authorization: `Bearer ${token}` }
});

// After: unified client
const client = new EmaClient({ name: "demo", baseUrl, bearerToken });
const personas = await client.getPersonasForTenant();
```

### Config Layer

Three-tier configuration with clear precedence:

1. **ema.config.yaml** — environment definitions (baseUrl, token env vars, master flag)
2. **.ema.yaml** — sync behavior (dry_run, sync_status) with per-env and per-persona overrides
3. **Runtime parameters** — highest precedence

This separation means environment definitions are shared (team config), but sync behavior can be personalized (.ema.yaml can be gitignored for personal preferences).

### SyncSDK

Coordinates sync operations:

- **Fingerprint computation:** Deterministic hash of persona config for change detection
- **Mapping management:** Tracking source→target persona relationships
- **State persistence:** SQLite for durability across runs

**What the SDK deliberately does NOT abstract:**

- MCP-specific protocol handling (that stays in the MCP server layer)
- UI or presentation logic
- Prompt construction or model interaction

The SDK is backend infrastructure. MCP sits on top, translating between model requests and SDK capabilities.

## Building the MCP Server on Top of the SDK

With the SDK in place, the MCP server becomes surprisingly thin. Here's how it's structured:

### Tool Definitions

Each tool is defined with a name, description, and input schema:

```javascript
{
  name: "sync_persona",
  description: "Sync a specific AI Employee by name from source to target environment. Works without config file—uses sync tags to track state.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The name of the AI Employee to sync" },
      source_env: { type: "string", description: "Source environment (e.g., 'demo')" },
      target_env: { type: "string", description: "Target environment (e.g., 'dev')" },
      dry_run: { type: "boolean", description: "Simulate without making changes" },
    },
    required: ["name", "target_env"],
  },
}
```

### Tool Handlers

Handlers map tool invocations to SDK calls:

```javascript
sync_persona: async (args) => {
  const behavior = resolveSyncBehavior({
    personaName: args.name,
    targetEnv: args.target_env,
    overrides: { dry_run: args.dry_run },
  });
  
  const result = await directSyncPersona({
    name: args.name,
    sourceEnv: args.source_env ?? getDefaultEnvName(),
    targetEnv: args.target_env,
    dryRun: behavior.dry_run,
  });
  
  return { ...result, resolved_behavior: behavior };
}
```

### Environment Abstraction

The server auto-detects available environments from config or env vars. Tools accept an optional `env` parameter to target specific environments, with sensible defaults.

### Request/Response Flow

```
Model → MCP Client → stdio → MCP Server → Tool Handler → SDK → API
                                                      ↓
                                              JSON Response
                                                      ↓
Model ← MCP Client ← stdio ← MCP Server ← Tool Result
```

The server is stateless per-request. State lives in the SQLite database managed by the SDK.

### Fingerprinting for Sync

Every persona gets a fingerprint—a SHA256 hash of its canonical configuration:

```javascript
const canonical = {
  name: p.name,
  description: cleanDescription,
  proto_config: cleanedConfig,
  welcome_messages: p.welcome_messages,
  workflow_def: p.workflow_def,
  // Excluded: id, status (computed/env-specific)
};
return crypto.createHash("sha256")
  .update(stableStringify(canonical))
  .digest("hex");
```

Syncs only occur when fingerprints differ—no-change syncs are skipped automatically.

## Why MCP Was Right for This

MCP was the right choice because I had multiple consumers (AI assistants, future CLI, potential webhook-triggered syncs) and I wanted capability definitions to be the source of truth. For a complete decision framework on when MCP is worth the overhead—and when it isn't—see [The MCP Mental Model](/blog/mcp-mental-model/).

## What Changed After MCP

**Faster iteration:** Adding a new capability means defining one tool + one handler. The protocol machinery is already there.

**Clearer mental model:** Instead of "which script does what," I have a single list of tools with self-describing interfaces. I can ask the AI "what tools are available?" and get a useful answer.

**Easier onboarding:** New teammates can ask an AI assistant "how do I sync a persona?" and get correct guidance because the AI has access to the actual tool definitions.

**Fewer "prompt mysteries":** When the AI invokes `sync_persona`, I know exactly what will happen. The behavior is defined in code, not implicit in prompt engineering.

## Lessons Learned

> **Mistake:** I initially embedded sync metadata in a `proto_config._ema_sync` field, then discovered that field had schema validation that rejected arbitrary keys. I had to migrate to description-embedded sync tags.

**Lesson:** Understand your storage constraints before designing your metadata strategy.

> **Mistake:** I tried to make the MCP server work with both "config-based sync" (full YAML config) and "config-less sync" (just env vars + sync tags). The two modes had subtle behavioral differences that caused confusion.

**Lesson:** Fewer modes with clear boundaries beats multiple modes with overlapping behavior.

> **Surprise:** The hierarchical config resolution (defaults → targets[env] → personas[name] → runtime) was more valuable than I expected. It let me set sane defaults while allowing per-persona exceptions without code changes.

## MCP as a Thinking Tool

Building the MCP server wasn't just infrastructure work. It was an exercise in **clarifying what this system actually does**.

The process forced me to answer:

- **What is context?** (Environment definitions, persona metadata, sync state)
- **What is capability?** (Sync, list, compare, search, fingerprint)
- **What belongs where?** (Auth in the SDK, protocol handling in the server, behavior config in YAML)

MCP isn't magic. It doesn't make models smarter. What it does is make your system's capabilities **legible**—to models, to tools, to humans.

If you're building AI-integrated systems, I'd encourage you to think about MCP not as "that protocol for AI assistants" but as an **architectural forcing function**. The act of defining your tools, resources, and context boundaries will clarify your system's design in ways that pay off regardless of whether an AI ever calls them.

## If You're Building This Today: A Quick Checklist

- [ ] Define your SDK first—MCP should be a thin layer on top
- [ ] Keep tool descriptions rich—they're documentation for models and humans
- [ ] Use environment abstraction—hardcoded URLs are a liability
- [ ] Implement fingerprinting for change detection—"sync everything every time" doesn't scale
- [ ] Separate "what environments exist" from "how sync behaves"—those are different concerns
- [ ] Test with actual AI assistants early—you'll discover ambiguities in your tool descriptions

---

*The Ema MCP Toolkit is used internally to manage AI Employee synchronization across environments. The code examples in this post are drawn from the actual implementation.*

---

## What's Next: From Sync to Builder

This post covered the infrastructure foundation—how MCP provides a structured interface layer for AI assistants to interact with platform capabilities. But there's a gap between **knowing what exists** and **knowing how to build**.

In [Part 2: Building a Knowledge-First AI Builder with MCP](/blog/mcp-knowledge-first-builder/), I explore how we evolved from sync tools to an intelligent builder assistant by embedding domain expertise directly into MCP:

- **Agent catalogs:** 40+ agents with inputs, outputs, and critical rules
- **Workflow patterns:** Common architectures as reusable templates
- **Validation as knowledge:** Encoding tribal wisdom ("every categorizer needs a Fallback") into executable checks
- **IDE integration:** Making Cursor platform-aware through MCP-backed rules

The insight: MCP isn't just for actions—it's for expertise.<!--tomb-->

