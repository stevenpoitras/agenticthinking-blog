---
layout: post
title: "Building a Knowledge-First AI Builder with MCP"
date: 2026-01-06
tags:
  - blog
  - mcp
  - sdk
  - agentic-ai
  - ema
  - architecture
  - developer
  - cursor
---

In [Part 1](/blog/mcp-server-unified-sdk/), I built an MCP server that could sync AI Employees between environments. It worked. But there was a gap: the AI assistant could *move* personas, but it couldn't *build* them. This is the story of closing that gap by embedding domain expertise directly into MCP.<!--more-->

## The Plateau After Platform

The sync tools were genuinely useful. I could ask Cursor: "Sync the IT Support persona from demo to dev" and it would happen—fingerprint comparison, change detection, the works. The infrastructure was solid.

But then I tried: "Create a Voice AI for IT support that creates ServiceNow tickets."

The AI's response was... generic. It knew MCP tools existed. It knew Ema had "AI Employees." But it had no idea what agents were available, what a valid workflow looked like, or why certain patterns work better than others. It was like having a librarian who could shelve books but couldn't recommend one.

The problem wasn't capability—it was **knowledge**.

## What the AI Didn't Know

I started cataloging what was missing:

| Knowledge Type | What Was Hidden |
|---------------|-----------------|
| **Agent catalog** | 40+ agents across 15 categories, each with specific inputs, outputs, and rules |
| **Workflow patterns** | Common architectures (KB search, intent routing, HITL) that experienced builders reuse |
| **Type compatibility** | Which outputs can connect to which inputs—tribal knowledge encoded in validation errors |
| **Platform concepts** | What's an "AI Employee" vs "Persona"? What's "HITL"? What's a "Connector"? |
| **Anti-patterns** | "Every categorizer needs a Fallback"—lessons learned through painful debugging |
| **Qualifying questions** | What to ask before building—requirements that seem obvious after you've forgotten them |

This knowledge existed. It was in docs, in Slack threads, in the heads of experienced builders. But it wasn't **accessible to AI assistants** in a structured way.

## Why Not Just RAG?

The obvious solution: dump the docs into a vector store, let the model retrieve relevant chunks.

I tried it. The results were... fuzzy. RAG excels at finding *related information*, but building AI Employees requires *precise specifications*:

- "What are the exact input parameters for `external_action_caller`?" → RAG gives you paragraphs that mention the agent
- "Can I connect `search.search_results` to `call_llm.query`?" → RAG has no concept of type compatibility
- "What workflow pattern should I use for IT support with escalation?" → RAG returns docs about both IT support and escalation, unhelpfully merged

The insight: **structured knowledge beats fuzzy retrieval for builder guidance**.

I needed a knowledge layer that was:
- **Typed:** Agent inputs and outputs with explicit types
- **Queryable:** "List all agents in the 'search' category"
- **Composable:** "Suggest agents for this use case" using rules, not just similarity
- **Validatable:** "Check if this workflow prompt has common mistakes"

## Designing the Knowledge Module

I created `knowledge.ts`—a structured knowledge base for the Auto Builder:

```typescript
// Agent catalog with typed inputs/outputs
export const AGENT_CATALOG: AgentDefinition[] = [
  {
    name: "chat_categorizer",
    displayName: "Intent Classifier",
    category: "routing",
    description: "Classifies user intent and routes to appropriate handler",
    inputs: [
      { name: "conversation", type: "WELL_KNOWN_TYPE_CHAT_CONVERSATION", required: true }
    ],
    outputs: [
      { name: "category_*", type: "WELL_KNOWN_TYPE_TRIGGER_WHEN", description: "One output per category" }
    ],
    criticalRules: [
      "MUST have at least one outgoing edge",
      "MUST include a Fallback category",
      "Output format: category_<CategoryName>"
    ]
  },
  // ... 40+ more agents
];

// Workflow patterns as reusable templates
export const WORKFLOW_PATTERNS: WorkflowPattern[] = [
  {
    name: "kb-search",
    description: "Knowledge base search with source citations",
    nodes: ["chat_trigger", "conversation_summarizer", "search", "respond_with_sources"],
    connections: [
      { from: "chat_trigger.user_query", to: "conversation_summarizer.query" },
      { from: "conversation_summarizer.summarized_query", to: "search.query" },
      { from: "search.search_results", to: "respond_with_sources.search_results" }
    ],
    antiPatterns: ["Don't skip summarizer—raw user queries are often ambiguous"]
  },
  // ... intent-routing, hitl, tool-calling, etc.
];

// Platform terminology
export const PLATFORM_CONCEPTS: Record<string, ConceptDefinition> = {
  "AI Employee": {
    definition: "A configured persona that orchestrates workflows and conversations",
    aliases: ["Persona", "Agent"],
    clarification: "Not a single agent—an AI Employee contains a workflow of multiple agents"
  },
  "HITL": {
    definition: "Human-in-the-Loop: routing decisions or actions to human reviewers",
    criticalRule: "HITL nodes MUST have both success AND failure paths"
  },
  // ... 10+ concepts
};
```

The key architectural choice: **knowledge as code, not documents**. This made it:
- Version controlled
- Type-checked
- Testable
- Directly accessible to MCP tools

## The 16 New Tools

With the knowledge module in place, I exposed it through 16 new MCP tools:

### Discovery Tools
```javascript
// Browse available agents
list_auto_builder_agents({ category: "routing" })
// → Returns all routing agents with inputs, outputs, rules

// Get specific agent details
get_auto_builder_agent({ action_name: "external_action_caller" })
// → Returns full definition including critical rules

// Smart suggestions based on use case
suggest_agents_for_use_case({ use_case: "IT helpdesk that creates ServiceNow tickets" })
// → Returns recommended agents AND workflow pattern
```

### Template Tools
```javascript
// Get workflow pattern with nodes, connections, anti-patterns
get_workflow_pattern({ pattern_name: "tool-calling" })

// Get voice persona configuration template
get_voice_persona_template()
// → Returns welcomeMessage, identityAndPurpose, etc. structure
```

### Validation Tools
```javascript
// Validate workflow prompt for common mistakes
validate_workflow_prompt({ 
  prompt: "Create a chat AI that routes to Support or Sales" 
})
// → Warnings: ["No Fallback category detected", "Missing WORKFLOW_OUTPUT mapping"]

// Check type compatibility before connecting nodes
check_type_compatibility({ 
  source_type: "WELL_KNOWN_TYPE_SEARCH_RESULTS",
  target_type: "WELL_KNOWN_TYPE_STRING" 
})
// → { compatible: false, reason: "Type mismatch" }
```

### Guidance Tools
```javascript
// Get best practices by topic
get_auto_builder_guidance({ topic: "categorizer-routing" })
// → Rules, examples, common mistakes for categorizers

// Look up platform terminology
get_platform_concept({ term: "HITL" })
// → Definition, critical rules, related concepts

// Get debugging checklist
get_debug_checklist()
// → Step-by-step troubleshooting guide
```

The pattern: **tools that encode expertise, not just execute actions**.

## The Transformation

Before the knowledge expansion:

```
User: "Create a Voice AI for IT support with ServiceNow integration"

AI: "I can help you create an AI Employee. What configuration would you like?"
[Generic, unhelpful]
```

After:

```
User: "Create a Voice AI for IT support with ServiceNow integration"

AI: [Calls suggest_agents_for_use_case]
    [Calls get_workflow_pattern("tool-calling")]
    [Calls get_auto_builder_agent("external_action_caller")]
    [Calls get_voice_persona_template]
    [Calls validate_workflow_prompt]

"Based on your use case, I recommend the tool-calling pattern with these agents:
- chat_trigger → conversation_summarizer → chat_categorizer
- Routes: category_CreateTicket → external_action_caller (ServiceNow)
         category_CheckStatus → external_action_caller (ServiceNow)
         category_Fallback → respond (escalation message)

For Voice AI, you'll need to configure:
- welcomeMessage: 'Hi, this is IT Support...'
- takeActionInstructions: [Cases for ticket creation, status check]
- hangupInstructions: When to end call

[Generates complete workflow prompt with validation]
```

The AI now **thinks like an experienced builder** because it has access to the same knowledge.

## Cursor Rules: MCP in the IDE

The next evolution was making Cursor itself platform-aware. I created `.cursor/rules/platforms/ema-auto-builder/ema-auto-builder.mdc`:

```markdown
# Quick Reference: Ema Auto Builder Prompts

## 🔧 MCP TOOLS: Use Ema MCP for Live Data

| MCP Tool | When to Use |
|----------|-------------|
| `mcp_ema_get_qualifying_questions()` | **FIRST** — Get structured questions before asking user |
| `mcp_ema_suggest_agents_for_use_case(use_case)` | Match use case to recommended agents |
| `mcp_ema_get_workflow_pattern(pattern_name)` | Get template with nodes and connections |
| `mcp_ema_validate_workflow_prompt(prompt)` | **LAST** — Validate before outputting |

### MCP-First Generation Flow

1. mcp_ema_get_qualifying_questions() → Structure user questions
2. mcp_ema_suggest_agents_for_use_case() → Get recommended pattern
3. mcp_ema_get_workflow_pattern() → Get template
4. mcp_ema_get_auto_builder_agent() → Get each agent's details
5. mcp_ema_validate_workflow_prompt() → Validate before output
```

This creates a **protocol for AI-assisted building**:

1. **Don't guess—ask**: The qualifying questions tool ensures requirements gathering before generation
2. **Don't invent—reference**: Pattern tools provide validated templates instead of ad-hoc designs
3. **Don't hope—validate**: Validation tools catch mistakes before they become runtime errors

The Cursor rules file is essentially **MCP orchestration documentation**—teaching the IDE how to use platform capabilities.

## Validation as Encoded Expertise

The `validate_workflow_prompt` tool deserves special attention. It encodes lessons learned through debugging:

```typescript
function validateWorkflowPrompt(prompt: string): ValidationResult {
  const warnings: string[] = [];
  
  // Lesson: Forgetting Fallback is the #1 categorizer mistake
  if (prompt.includes("categorizer") && !prompt.toLowerCase().includes("fallback")) {
    warnings.push("No Fallback category detected—categorizers MUST have a Fallback");
  }
  
  // Lesson: HITL without both paths causes silent failures
  if (prompt.includes("human") || prompt.includes("approval") || prompt.includes("hitl")) {
    if (!prompt.includes("success") || !prompt.includes("failure") || !prompt.includes("reject")) {
      warnings.push("HITL detected but missing success/failure paths—both are required");
    }
  }
  
  // Lesson: Workflows without output mapping don't return results
  if (!prompt.toLowerCase().includes("workflow_output") && !prompt.includes("output")) {
    warnings.push("No explicit WORKFLOW_OUTPUT mapping—ensure all paths lead to output");
  }
  
  return { valid: warnings.length === 0, warnings };
}
```

Each validation rule represents **tribal knowledge made executable**:

| Rule | Lesson Source |
|------|---------------|
| "Categorizers need Fallback" | Dozens of "why isn't my AI responding?" debugging sessions |
| "HITL needs both paths" | Production incidents where rejected items disappeared |
| "Map to WORKFLOW_OUTPUT" | Hours wondering why workflows "worked" but returned nothing |

This is the real value: **mistakes we've made become mistakes the AI won't make**.

## Building the Builder with the Builder

There's a recursive satisfaction in using the knowledge-MCP to improve itself:

```
User: "Add a new agent to the knowledge catalog: 'ticket_summarizer'"

AI: [Calls get_auto_builder_agent to understand the pattern]
    [Calls list_auto_builder_agents to check for conflicts]
    [Calls check_type_compatibility to validate proposed types]
    
"I'll add ticket_summarizer to the catalog. Based on similar agents:
- Category: 'analysis'
- Inputs: ticket_data (WELL_KNOWN_TYPE_JSON)
- Outputs: summary (WELL_KNOWN_TYPE_STRING)
- Critical rules: [derived from pattern analysis]"
```

The knowledge base becomes **self-documenting infrastructure**.

## What I Learned

### 1. Knowledge Architecture Matters More Than Volume

I could have embedded 100 pages of docs. Instead, I curated:
- 40 agents with precise schemas
- 7 workflow patterns
- 10 platform concepts
- 20 qualifying questions

Less content, more structure, better results.

### 2. Validation Is the Highest-Leverage Knowledge

Every validation rule is a lesson learned. The `validate_workflow_prompt` tool probably saves more debugging time than all the agent documentation combined.

### 3. MCP Is a Teaching Interface

I started thinking of MCP as "API for models." I now think of it as **curriculum for AI assistants**. The tool descriptions, the structured outputs, the validation feedback—they're all teaching the model how to think about the domain.

### 4. IDE Integration Multiplies Value

The Cursor rules file transformed the knowledge base from "available if you ask" to "automatically applied." The MCP-first generation flow means the AI *starts* with platform knowledge instead of discovering it mid-task.

## The Current State

The Ema MCP server now has two layers:

| Layer | Purpose | Tools |
|-------|---------|-------|
| **Infrastructure** | Manage AI Employees across environments | list, sync, compare, fingerprint |
| **Knowledge** | Guide AI Employee creation | agents, patterns, validation, concepts |

The infrastructure layer answers: "What exists?"
The knowledge layer answers: "What should I build?"

Together, they create an AI assistant that can both operate and reason about the platform.

## If You're Building This

**Start with the knowledge gap.** What do experienced users know that new users (including AI) don't? That's your knowledge base.

**Structure beats volume.** A typed agent catalog with 40 entries beats 400 pages of docs in a vector store.

**Encode mistakes, not just successes.** Your validation rules should be your incident post-mortems.

**Make it recursive.** If your knowledge system can improve itself, you've built something durable.

**Integrate at the IDE level.** MCP tools are most powerful when the AI uses them automatically, not when users remember to ask.

---

*This post is Part 2 of a series on building with MCP. [Part 1](/blog/mcp-server-unified-sdk/) covers the infrastructure foundation: from scripts to unified SDK to MCP server.*<!--tomb-->

