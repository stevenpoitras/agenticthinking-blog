---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/ema-user-guide.html"
layout: post
title: "Ema Platform: A Complete Guide to Agentic AI Concepts"
tags:
  - blog
  - ema
  - agentic-ai
  - tutorial
  - guide
  - enterprise
---

A comprehensive guide to understanding Ema's Agentic AI platform—from core concepts and terminology to practical implementation patterns. Whether you're technical or business-focused, this guide will help you navigate the world of AI Employees.<!--more-->

## Quick Reference

### What is Ema?

**Ema** is a **Universal AI Employee** platform that creates autonomous AI agents capable of completing entire workflows—not just answering questions. Unlike chatbots or copilots, Ema's AI Employees can own tasks from start to finish.

### Core Technology Stack

| Component | Purpose |
|-----------|---------|
| **EmaFusion™** | Routes queries to optimal models from 100+ LLMs |
| **Generative Workflow Engine™ (GWE)** | Builds workflows from natural language |
| **Agent Mesh** | Network of specialized agents working together |
| **Actions/Connectors** | 200+ enterprise integrations (Salesforce, ServiceNow, Workday, etc.) |

### Key Concepts at a Glance

| Term | One-Line Definition |
|------|---------------------|
| **AI Employee** | A complete autonomous agent with a role, knowledge, and capabilities |
| **Workflow** | A sequence of agents/actions orchestrated to complete a task |
| **Agent** | A specialized capability (search, respond, classify, etc.) |
| **Action** | A discrete operation an agent can perform |
| **Trigger** | What initiates a workflow (chat, email, voice, scheduled, etc.) |
| **HITL** | Human-in-the-Loop approval/verification step |

### Quick Start Flow

```
1. Create AI Employee → Choose template (Chat, Email, Voice, Dashboard)
2. Configure Trigger → Define how work arrives  
3. Build Workflow → Add agents and connect them
4. Add Knowledge → Upload documents, connect integrations
5. Test → Use preview/playground
6. Deploy → Activate and monitor
```

## Core Concepts Deep Dive

### AI Employees

An **AI Employee** is a fully configured, deployable autonomous agent. Think of it as a digital team member with:

1. **Identity** — Name, description, icon
2. **Role** — What it does (HR support, customer service, document processing)
3. **Capabilities** — Workflow defining its behaviors
4. **Knowledge** — Documents and data it can access
5. **Integrations** — External systems it can interact with
6. **Access Controls** — Who can use/edit it

**Important distinction:** An AI Employee *contains* agents. Agents are the individual capabilities; AI Employees are the complete packages.

### Workflows & Agents

A workflow is a **directed acyclic graph (DAG)** where:
- **Nodes** are agents performing operations
- **Edges** define data flow between agents
- **Conditions** enable branching logic

#### Core Agent Types

**1. Trigger Agents** — Start the workflow when an event occurs (chat message, email, voice call, schedule)

**Trigger Output Details:**

| Output | Description |
|--------|-------------|
| `user_query` | The **last/most recent user question** only. Use this when you only need the current request without history context. |
| `chat_conversation` | The **complete conversation history** including all previous messages. Contains the full context of the interaction. |
| `additional_context` | **Integration-specific context** passed from upstream systems via API (Microsoft Teams, Slack, etc.). |

**Additional Context from Integrations:**

When integrated with upstream platforms, triggers may receive platform-specific information:

| Integration | Context May Include |
|-------------|---------------------|
| **Microsoft Teams** (Graph API) | User profile, team/channel info, tenant details |
| **Slack** | Workspace info, channel context, thread information |
| **Email** | Sender info, headers, attachments metadata |
| **Custom API** | Any context your integration passes through |

> ⚠️ **Critical: Workflow Execution Model**
>
> Each `user_query` **triggers a new workflow execution**. This means:
> - The workflow runs **once per user message**, not once per conversation
> - Each subsequent question invokes the workflow again
> - Design workflows to check context before performing actions (e.g., don't create duplicate tickets)
>
> **Anti-Pattern:**
> ```
> User: "Create a ticket for my laptop"  → Creates ticket ✓
> User: "Add my phone number to it"      → Creates ANOTHER ticket ✗
> ```
>
> **Correct Pattern:** Check `chat_conversation` to detect if a ticket was already created, then route to "update ticket" instead.

**Trigger Outputs vs Conversation Summarizer:**

| Approach | History Scope | Use Case |
|----------|---------------|----------|
| `chat_conversation` | **All history** | Need full context |
| `user_query` | **Last message only** | Simple queries |
| **Conversation Summarizer** | **Configurable** | Manage token limits |

> **Note:** You may still need Conversation Summarizer with `chat_conversation` because some agents require its output format, or to reduce conversation size for LLM context limits.

**2. Classification Agents** — Categorize inputs to route to appropriate handlers

**3. Search Agents** — Retrieve relevant information from knowledge bases

**4. Response Agents** — Generate answers using LLMs

**5. External Action Agents** — Call external APIs and tools

### Actions & Tools

Every action has:
- **Name** — Unique identifier
- **Namespace** — Category (actions.emainternal, tools.external, etc.)
- **Inputs** — Required and optional parameters
- **Outputs** — What the action produces

**Common actions include:**
- `search` — Retrieve documents from knowledge base
- `call_llm` — Generate a response using an LLM
- `send_email` — Dispatch email via integration
- `create_ticket` — Create ServiceNow/Zendesk ticket

### Human-in-the-Loop (HITL)

A workflow pattern where human approval is required before proceeding.

**When to use:**
- High-stakes decisions (financial approvals, legal actions)
- Sensitive operations (PII handling)
- Low-confidence situations
- Compliance requirements

| Scenario | HITL Recommended? | Rationale |
|----------|-------------------|-----------|
| Creating tickets | ✅ Yes | Verify details before submission |
| Querying information | ❌ No | Low risk, user can clarify |
| Sending emails | ✅ Yes | Prevent incorrect communications |
| Financial actions | ✅ Yes | Compliance and accuracy |
| Knowledge lookup | ❌ No | Read-only, reversible |

## Understanding the Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     EMA PLATFORM ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │   AI EMPLOYEE   │────▶│    WORKFLOW     │                    │
│  │   (Persona)     │     │                 │                    │
│  │                 │     │  ┌───────────┐  │                    │
│  │ • Name/Role     │     │  │  TRIGGER  │  │                    │
│  │ • Description   │     │  │(Chat/Email│  │                    │
│  │ • Status        │     │  │ /Voice)   │  │                    │
│  └─────────────────┘     │  └─────┬─────┘  │                    │
│                          │        │        │                    │
│                          │        ▼        │                    │
│                          │  ┌───────────┐  │  ┌──────────────┐  │
│                          │  │   AGENT   │──┼─▶│   ACTION     │  │
│                          │  │ (Node)    │  │  │              │  │
│                          │  │ • Type    │  │  │ • search     │  │
│                          │  │ • Inputs  │  │  │ • call_llm   │  │
│                          │  │ • Config  │  │  │ • send_email │  │
│                          │  └─────┬─────┘  │  └──────────────┘  │
│                          │        │        │                    │
│                          │        ▼        │                    │
│                          │  ┌───────────┐  │  ┌──────────────┐  │
│                          │  │  RESULTS  │──┼─▶│ CONNECTORS/  │  │
│                          │  └───────────┘  │  │    TOOLS     │  │
│                          │                 │  │ • Salesforce │  │
│                          └─────────────────┘  │ • ServiceNow │  │
│                                               └──────────────┘  │
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │   EMAFUSION™    │     │  KNOWLEDGE BASE │                    │
│  │ • Model routing │     │ • Documents     │                    │
│  │ • 100+ LLMs     │     │ • Integrations  │                    │
│  └─────────────────┘     └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## Common Confusions Clarified

### AI Employee vs Agent vs Agent Mesh

- **AI Employee:** The complete deployed instance (has role, workflow, knowledge)
- **Agent:** Individual skills/capabilities within a workflow
- **Agent Mesh:** The team collaboration pattern

**Analogy:**
- AI Employee = Complete employee with job description
- Agents = Individual skills they use
- Workflow = The process they follow
- Agent Mesh = How they collaborate

### Query vs Conversation

| Criteria | Use Query | Use Conversation |
|----------|-----------|------------------|
| **Interaction Type** | Single request | Multi-turn dialogue |
| **Context Needed** | No history required | History important |
| **Use Case** | Document processing, batch jobs | Chat, voice support |
| **Example** | "Process this invoice" | "What's my leave balance?" → "Apply for Monday" |

**Accessing Conversation Data in Workflows:**

- `{{trigger.user_query}}` — Returns only the **last/current user message**
- `{{trigger.chat_conversation}}` — Returns the **complete conversation history**
- **Conversation Summarizer agent** — Allows **configurable history depth**

## Practical Examples

### Example 1: Simple HR Policy Q&A Bot

**Workflow:**
```
[Chat Trigger]
      │
      ▼
[Conversation Summarizer] ─── Extracts user query and context
      │
      ▼
[Knowledge Search] ─── Searches uploaded policy documents
      │
      ▼
[Respond with Sources] ─── Generates answer with citations
```

**Configuration:**
- Upload: Employee Handbook PDF, Leave Policy, Benefits Guide
- Response instructions: Answer using only provided documents, cite sources

### Example 2: IT Support with Ticket Creation

**Workflow:**
```
[Chat Trigger]
      │
      ▼
[Intent Classifier] ───┬──── "Knowledge Question" ───▶ [Search] → [Respond]
                       │
                       ├──── "Ticket Request" ───▶ [Create Ticket] → [Confirm]
                       │
                       └──── "Unknown" ───▶ [Escalate]
```

**Intent Categories:**
- Knowledge Question: "How do I connect to VPN?"
- Ticket Request: "My laptop is broken"
- Status Check: "What's the status of my ticket?"

## Decision Tables

### When to Use What

| Need | Solution |
|------|----------|
| Answer employee questions from policy docs | Chat AI Employee with search + respond |
| Process incoming emails automatically | Email-triggered AI Employee with classification |
| Create IT tickets from chat | Chat AI Employee with external action to ServiceNow |
| Generate documents on demand | Document AI Employee with generate agent |
| Voice-based password reset | Voice AI Employee with verification workflow |

## Troubleshooting

### Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Not testing with edge cases | Unexpected failures | Test with empty, long, multilingual inputs |
| Overloading workflows | Slow execution, timeouts | Keep workflows focused |
| Missing HITL on sensitive actions | Unintended actions | Add HITL for external side effects |
| Vague agent instructions | Inconsistent responses | Be specific about tone, format, boundaries |

### Debugging Checklist

1. **Check Status** — Is the AI Employee active?
2. **Review Trigger** — Is the trigger correctly configured?
3. **Trace Execution** — Where does the workflow fail?
4. **Inspect Inputs** — Are inputs reaching agents correctly?
5. **Check Integrations** — Are connectors authenticated?
6. **Review Logs** — What errors appear?

## Resources

- **Developer Docs:** https://developer.ema.co/
- **Builder Docs:** https://builder.ema.co/
- **Website:** https://ema.co
- **Contact:** docs@ema.co

---

*This guide covers the fundamentals of Ema's platform. For the latest updates and detailed API references, visit the official documentation at [developer.ema.co](https://developer.ema.co)*<!--tomb-->

