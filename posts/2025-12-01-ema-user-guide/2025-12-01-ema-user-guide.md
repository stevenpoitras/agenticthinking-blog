---
layout: post
title: "Ema Platform: A Complete Guide to Agentic AI Concepts"
date: 2025-12-01
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

---

## Glossary

### Action

**Definition:** A discrete operation performed by an agent—the smallest unit of work in a workflow.

**Aliases/Related Terms:**
- Tool (often used interchangeably)
- Step (workflow context)
- Connector operation (when involving integrations)

**Where It Appears:** Workflow Builder UI, API action definitions, execution logs

**Example Actions:**
- `search` — Retrieve documents from knowledge base
- `call_llm` — Generate a response using an LLM
- `send_email` — Dispatch email via integration
- `create_ticket` — Create ServiceNow/Zendesk ticket

### Agent

**Definition:** A specialized AI capability that performs a specific function within a workflow. Agents are the building blocks that compose AI Employee behaviors.

**Aliases/Related Terms:**
- Node (workflow visualization context)
- Workflow step
- NOT the same as "AI Employee"

**Common Agent Types:**

| Agent Type | Purpose |
|------------|---------|
| `chat_categorizer` | Classifies user intent |
| `search` | Retrieves relevant documents |
| `respond_with_sources` | Generates answer with citations |
| `external_action_caller` | Invokes external APIs/tools |
| `call_llm` | Custom LLM response generation |
| `generate_document` | Creates Word/PDF documents |

**Where It Appears:** Workflow Builder canvas, Agent library, Execution traces

### Agent Mesh

**Definition:** The network of specialized agents that collaborate to complete complex tasks. Instead of a single monolithic AI, Ema uses multiple specialized agents working together.

**How It Works:**
1. User request arrives at trigger
2. Orchestration layer routes to appropriate agents
3. Agents may call other agents or external tools
4. Results flow back and are synthesized
5. Final response delivered

**Why It Matters:** Better accuracy, specialization, auditability, and fault isolation than single-agent approaches.

### AI Employee

**Definition:** A complete, configured instance of an autonomous AI agent with:
- A defined role and purpose
- A workflow (series of agents)
- Access to specific knowledge/documents
- Configured integrations and permissions
- A trigger type (how it receives work)

**Aliases/Related Terms:**
- Persona (internal API term)
- Bot/Assistant (casual usage—but less accurate)

**NOT the same as:**
- Agent (an AI Employee *contains* agents)
- Action (actions are what agents perform)

**Where It Appears:** 
- Ema Builder UI: "AI Employees" menu
- API: `persona` endpoints
- Workspace dashboard

### Agentic AI

**Definition:** AI systems that autonomously plan, reason, and execute multi-step tasks—completing workflows from start to finish rather than just assisting.

**Evolution Context:**

| Generation | Type | Capability |
|------------|------|------------|
| Gen 1 | Rule-based systems | Follow scripts |
| Gen 2 | Chatbots | Answer FAQs |
| Gen 3 | Copilots | Assist humans |
| Gen 4 | **Agentic AI** | Complete workflows autonomously |

**Key Differentiators:**
- **Goal-oriented:** Works toward outcomes, not just responses
- **Autonomous:** Makes decisions without constant human input
- **Tool-using:** Interacts with external systems
- **Accountable:** Traceable and auditable actions

### Connector

**Definition:** A pre-built integration that enables agents to interact with external enterprise systems.

**Aliases/Related Terms:**
- Integration
- Tool (when used as an action)
- External action

**Examples:**
- ServiceNow connector → Create/update tickets
- Salesforce connector → Query/update CRM records
- Workday connector → Access HR data
- Email connector → Send/receive emails

**Where Configured:** Builder UI → Integrations section, or via API

### Conversation

**Definition:** A multi-turn interaction session between a user and an AI Employee, maintaining context across messages.

**Key Characteristics:**
- Persists context across multiple messages
- Tracked by `conversation_id`
- Contains history of user messages and AI responses
- Used for chat and voice-based AI Employees

**Accessing Conversation Data in Workflows:**
- `{{trigger.user_query}}` — Returns only the **last/current user message**
- `{{trigger.chat_conversation}}` — Returns the **complete conversation history** (all messages)
- **Conversation Summarizer agent** — Allows **configurable history depth** (specify how many turns to include)

### EmaFusion™

**Definition:** Ema's proprietary model orchestration technology that combines 100+ LLMs to route queries to the optimal model(s) for each task.

**How It Works:**
1. Incoming query is analyzed
2. EmaFusion determines which model(s) are best suited
3. Query is routed to selected model(s)
4. Results may be synthesized from multiple models
5. Best answer returned

**Benefits:**
- Higher accuracy than single-model approaches
- Cost optimization (use expensive models only when needed)
- Reduced hallucinations through consensus
- Automatic model updates without workflow changes

**Configuration:** In Builder UI, select "EmaFusion™ Model" widget or limit to specific models.

### Generative Workflow Engine™ (GWE)

**Definition:** The core engine that enables building AI workflows using natural language instructions—no coding required.

**Key Capabilities:**
- Natural language workflow definition
- Visual workflow builder
- Automatic agent orchestration
- Execution and monitoring

**Where It Appears:** Builder UI (workflow canvas), API (workflow definitions)

### Human-in-the-Loop (HITL)

**Definition:** A workflow pattern where human approval or verification is required before proceeding with an action.

**When to Use:**
- High-stakes decisions (financial approvals, legal actions)
- Sensitive operations (PII handling, terminations)
- Low-confidence situations
- Compliance requirements

**Configuration:**

```yaml
humanInteractionConfig:
  alwaysPauseForHumanInteraction: true
  shouldVerifyParamsPreExecution: true
  message: "Please review and confirm"
  confirmationButtonName: "Approve"
  cancelButtonName: "Reject"
  hiddenParams: ["internal_id"]
  paramEditingDisabled: false
```

**Where It Appears:** Agent configuration in Builder, execution flow in runtime

### Knowledge Base

**Definition:** The collection of documents, policies, and data sources an AI Employee can search and reference.

**Supported Sources:**
- Local file uploads (PDF, DOCX, TXT, etc.)
- Connected integrations (Google Drive, SharePoint, Confluence)
- Structured databases
- Web content

**Features:**
- Vector search (semantic similarity)
- Keyword search
- Automatic chunking and embedding
- Source citation in responses

### Query

**Definition:** A single, stateless request to an AI system—does not maintain conversation context.

**Key Characteristics:**
- One-shot interaction
- No history awareness
- Typically used for API calls or single-turn interactions
- Lower overhead than conversations

### Task

**Definition:** A unit of work to be completed by an AI Employee, triggered by an event and executed through a workflow.

**Lifecycle:**
1. **Triggered** — Event arrives (chat message, email, schedule)
2. **Queued** — Task enters processing queue
3. **Executing** — Workflow runs through agents
4. **Awaiting** — Paused for HITL or external response
5. **Completed** — Successfully finished
6. **Failed** — Error occurred

**Where It Appears:** Execution logs, task dashboard, API responses

### Trigger

**Definition:** The event or condition that initiates an AI Employee's workflow.

**Trigger Types:**

| Type | ID | Description |
|------|----|----|
| Chat | 1, 4 | Web chat widget interaction |
| Email | 2 | Incoming email to monitored inbox |
| Ticket | 3 | ServiceNow/Zendesk ticket event |
| Voice | 1 | Phone/voice interaction |
| Schedule | 5 | Time-based automation |
| Dashboard | 2 | Manual dashboard trigger |
| API | - | Programmatic invocation |

### Tool

**Definition:** An external capability that agents can invoke to perform specific operations.

**Aliases/Related Terms:**
- Action (internal context)
- Connector (when referring to integration)
- External action

**Tool Categories:**
- **Internal tools:** Search, respond, classify
- **External tools:** Third-party API calls, integrations
- **Custom tools:** User-defined API endpoints

### Workflow

**Definition:** A directed graph of agents and their connections that defines how an AI Employee processes work from trigger to response.

**Components:**
1. **Trigger node** — Entry point
2. **Agent nodes** — Processing steps
3. **Conditional branches** — Decision points
4. **Result nodes** — Output definitions

**Example Structure:**

```
Trigger → Categorizer → [Branch by Intent]
                              ├─→ Search → Respond (FAQ)
                              ├─→ External Tool → Respond (Action)
                              └─→ Escalate (Unknown)
```

---

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
│  │ • Access Level  │     │  └─────┬─────┘  │                    │
│  └─────────────────┘     │        │        │                    │
│                          │        ▼        │                    │
│                          │  ┌───────────┐  │  ┌──────────────┐  │
│                          │  │   AGENT   │──┼─▶│   ACTION     │  │
│                          │  │ (Node)    │  │  │              │  │
│                          │  │           │  │  │ • search     │  │
│                          │  │ • Type    │  │  │ • call_llm   │  │
│                          │  │ • Inputs  │  │  │ • send_email │  │
│                          │  │ • Config  │  │  │ • api_call   │  │
│                          │  └─────┬─────┘  │  └──────────────┘  │
│                          │        │        │                    │
│                          │        ▼        │                    │
│                          │  ┌───────────┐  │  ┌──────────────┐  │
│                          │  │  RESULTS  │──┼─▶│ CONNECTORS/  │  │
│                          │  │           │  │  │    TOOLS     │  │
│                          │  └───────────┘  │  │              │  │
│                          │                 │  │ • Salesforce │  │
│                          └─────────────────┘  │ • ServiceNow │  │
│                                               │ • Workday    │  │
│                                               └──────────────┘  │
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │   EMAFUSION™    │     │  KNOWLEDGE BASE │                    │
│  │                 │     │                 │                    │
│  │ • Model routing │     │ • Documents     │                    │
│  │ • 100+ LLMs     │     │ • Integrations  │                    │
│  │ • Optimization  │     │ • Tags/Filters  │                    │
│  └─────────────────┘     └─────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

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

#### How AI Employees Execute

```
┌─────────────────────────────────────────────────────────────┐
│                    AI EMPLOYEE EXECUTION                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   1. TRIGGER RECEIVED                                        │
│      └─▶ Chat message / Email / Voice call / Schedule        │
│                                                              │
│   2. WORKFLOW INITIATED                                      │
│      └─▶ Trigger node activates                              │
│                                                              │
│   3. AGENT SEQUENCE EXECUTES                                 │
│      └─▶ Each agent processes inputs, produces outputs       │
│      └─▶ Conditional routing based on agent outputs          │
│                                                              │
│   4. EXTERNAL CALLS (if needed)                              │
│      └─▶ API calls to connectors                             │
│      └─▶ HITL pauses if configured                           │
│                                                              │
│   5. RESULTS DELIVERED                                       │
│      └─▶ Response to user / Document created / Action taken  │
│                                                              │
│   6. LOGGING & ANALYTICS                                     │
│      └─▶ Execution trace captured                            │
│      └─▶ Metrics updated                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Configuration Locations

| Setting | Builder UI | API |
|---------|------------|-----|
| Name/Description | AI Employee Settings | `persona.name`, `persona.description` |
| Status (Active/Inactive) | Toggle in header | `enabled_by_user` |
| Workflow | Workflow Builder canvas | `workflow_def` |
| Knowledge | File Upload widgets | `proto_config.widgets` |
| Integrations | Integrations panel | Connector configurations |
| EmaFusion Model | Model selector widget | `fusionModel` config |

#### Debugging AI Employees

1. **Execution Traces** — View step-by-step agent execution
2. **Logs** — Detailed input/output for each node
3. **Preview Mode** — Test without affecting production
4. **Playground** — Interactive testing environment

---

### Workflows & Agents

A workflow is a **directed acyclic graph (DAG)** where:
- **Nodes** are agents performing operations
- **Edges** define data flow between agents
- **Conditions** enable branching logic

#### Core Agent Types

##### 1. Trigger Agents

Start the workflow when an event occurs.

```yaml
# Chat Trigger Example
name: "trigger"
action: "triggers.emainternal.chat_trigger"
outputs:
  - chat_conversation  # Full conversation history
  - user_query         # Latest user message
```

**Trigger Output Details:**

| Output | Description |
|--------|-------------|
| `user_query` | The **last/most recent user question** only. Use this when you only need the current request without history context. |
| `chat_conversation` | The **complete conversation history** including all previous messages. Contains the full context of the interaction. |
| `additional_context` | **Integration-specific context** passed from upstream systems via API. Available when integrated with platforms like Microsoft Teams (via Graph API), Slack, or other enterprise systems. |

**Additional Context from Integrations:**

When the AI Employee is integrated with upstream platforms, the trigger may receive `additional_context` containing platform-specific information:

| Integration | Context May Include |
|-------------|---------------------|
| **Microsoft Teams** (Graph API) | User profile, team/channel info, tenant details, message metadata |
| **Slack** | Workspace info, channel context, user details, thread information |
| **Email** | Sender info, headers, attachments metadata, thread references |
| **Custom API** | Any context your integration passes through |

This additional context enables richer personalization and routing decisions based on where and how the user is interacting with the AI Employee.

> ⚠️ **Critical: Workflow Execution Model**
> 
> Each `user_query` (user message) **triggers a new workflow execution**. This means:
> - The workflow runs **once per user message**, not once per conversation
> - Each subsequent question is its own `user_query` that invokes the workflow again
> - `chat_conversation` accumulates across executions, but each execution starts fresh
> 
> **Design Implications:**
> - **Avoid duplicate actions:** If a user asks a follow-up question, the workflow runs again. Design your workflow to check context before performing actions (e.g., don't create a new ticket if one was just created in the previous turn)
> - **Use conversation history for context:** Check `chat_conversation` to understand what actions were already taken in previous turns
> - **Conditional logic:** Use `runIf` conditions to skip redundant operations based on conversation state
> 
> **Example Anti-Pattern:**
> ```
> User: "Create a ticket for my laptop issue"  → Workflow creates ticket ✓
> User: "Add my phone number to it"            → Workflow runs again - might create ANOTHER ticket ✗
> ```
> 
> **Correct Pattern:**
> ```
> Use chat_conversation to detect if a ticket was already created in this conversation,
> then route to "update ticket" instead of "create ticket"
> ```

**Trigger Outputs vs Conversation Summarizer:**

Both `chat_conversation` and the **Conversation Summarizer** agent provide conversation context, but with key differences:

| Approach | History Scope | Use Case |
|----------|---------------|----------|
| `{{trigger.chat_conversation}}` | **All history** — complete conversation from start | When you need full context and don't want to lose any information |
| `{{trigger.user_query}}` | **Last message only** — just the current question | Simple queries where history doesn't matter |
| **Conversation Summarizer** agent | **Configurable** — specify how many turns/how far back | When you need to limit context window or summarize long conversations |

**When to Use Each:**

- **Use `user_query`** for single-turn interactions or when previous context isn't needed
- **Use `chat_conversation`** when you need complete history and context window size isn't a concern
- **Use Conversation Summarizer** when:
  - Conversations are long and you need to manage token limits
  - You want to control exactly how many turns of history to include
  - You need a condensed summary rather than raw message history

> **Note:** You may still need to use **Conversation Summarizer in conjunction with `chat_conversation`**. Some downstream agents specifically require the Conversation Summarizer's output format. Additionally, even when using `chat_conversation`, you may need to add a Conversation Summarizer to reduce conversation size due to LLM context window limits on long conversations.

##### 2. Classification Agents

Categorize inputs to route to appropriate handlers.

```yaml
# Intent Classifier Example
name: "chat_categorizer"
action: "actions.emainternal.chat_categorizer"
inputs:
  conversation: "{{trigger.chat_conversation}}"
typeArguments:
  categories:
    - name: "Fallback"
      description: "General policy questions"
      examples: ["What are the benefits?", "Tell me about leave policy"]
    - name: "Leave Management"
      description: "Leave requests and balance"
      examples: ["Apply for vacation", "Check my leave balance"]
    - name: "IT Tickets"
      description: "Technical support requests"
      examples: ["Create a ticket", "I can't login"]
```

##### 3. Search Agents

Retrieve relevant information from knowledge bases.

```yaml
# Knowledge Base Search Example
name: "search"
action: "actions.emainternal.search"
inputs:
  query: "{{categorizer.summarized_conversation}}"
  datastore_configs: ["policy_documents"]
  page_size: 15
  max_sources: 15
outputs:
  - search_results
```

##### 4. Response Agents

Generate answers using LLMs.

```yaml
# Response Generation Example
name: "respond_with_sources"
action: "actions.emainternal.respond_with_sources"
inputs:
  query: "{{search.query}}"
  search_results: "{{search.search_results}}"
  user_instructions: |
    You are an HR assistant. Answer questions using only
    the provided documents. Cite your sources.
  model_config:
    selectedModels: ["gpt-4o"]
```

##### 5. External Action Agents

Call external APIs and tools.

```yaml
# External API Call Example
name: "external_action_caller"
action: "actions.emainternal.external_action_caller"
tools:
  - action: "tools.external.servicenow_Create_Ticket"
    inputs:
      ShortDescription: "{{llm_inferred}}"
      Description: "{{llm_inferred}}"
      UserId: "user@company.com"
    humanInteractionConfig:
      alwaysPauseForHumanInteraction: true
      message: "Please confirm ticket creation"
```

#### Conditional Execution

Agents can have `runIf` conditions:

```yaml
runIf:
  lhs: "{{categorizer.category}}"
  operator: EQUALS  # 1 = EQUALS
  rhs: "Leave Management"
```

---

### Actions & Tools

#### Action Anatomy

Every action has:

| Component | Description |
|-----------|-------------|
| **Name** | Unique identifier |
| **Namespace** | Category (actions.emainternal, tools.external, etc.) |
| **Version** | API version (v0, v1, etc.) |
| **Inputs** | Required and optional parameters |
| **Outputs** | What the action produces |

#### Tool Invocation Flow

```
┌───────────────────────────────────────────────────────────────┐
│                    TOOL INVOCATION FLOW                        │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Agent receives inputs                                      │
│     └─▶ Query, context, configuration                          │
│                                                                │
│  2. LLM analyzes which tool(s) to call                         │
│     └─▶ Based on query intent and available tools              │
│                                                                │
│  3. LLM extracts/infers parameters                             │
│     └─▶ From conversation context or hardcoded values          │
│                                                                │
│  4. HITL check (if configured)                                 │
│     └─▶ Present parameters for human approval                  │
│     └─▶ Wait for confirmation/cancellation                     │
│                                                                │
│  5. Tool executed                                              │
│     └─▶ API call made with extracted parameters                │
│                                                                │
│  6. Results processed                                          │
│     └─▶ Response formatted and returned to workflow            │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

#### Connector Categories

| Category | Examples |
|----------|----------|
| **ITSM** | ServiceNow, Zendesk, Jira |
| **CRM** | Salesforce, HubSpot |
| **HR** | Workday, BambooHR, ADP |
| **Communication** | Email, Slack, Teams |
| **Documents** | Google Drive, SharePoint, Box |
| **Custom APIs** | Any REST API endpoint |

---

### Human-in-the-Loop (HITL)

#### When to Use HITL

| Scenario | HITL Recommended? | Rationale |
|----------|-------------------|-----------|
| Creating tickets | ✅ Yes | Verify details before submission |
| Querying information | ❌ No | Low risk, user can clarify |
| Sending emails | ✅ Yes | Prevent incorrect communications |
| Financial actions | ✅ Yes | Compliance and accuracy |
| Document generation | ⚠️ Sometimes | Depends on sensitivity |
| Knowledge lookup | ❌ No | Read-only, reversible |

#### Configuration Options

```yaml
humanInteractionConfig:
  alwaysPauseForHumanInteraction: true   # Always require approval
  shouldVerifyParamsPreExecution: true   # Show params before executing
  message: "Please review and confirm"   # Custom message
  confirmationButtonName: "Approve"      # Custom button text
  cancelButtonName: "Reject"             # Custom cancel text
  hiddenParams: ["internal_id"]          # Hide sensitive params
  paramEditingDisabled: false            # Allow param editing
```

---

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

### Action vs Tool vs Step

- **Action:** Platform's term for discrete operation
- **Tool:** External action (API call, connector)
- **Step:** Workflow position (visual/sequential context)

All three can refer to the same thing depending on context!

### Query vs Conversation

| Criteria | Use Query | Use Conversation |
|----------|-----------|------------------|
| **Interaction Type** | Single request | Multi-turn dialogue |
| **Context Needed** | No history required | History important |
| **API Pattern** | Stateless call | Session-based |
| **Use Case** | Document processing, batch jobs | Chat, voice support |
| **Overhead** | Lower | Higher (state management) |
| **Example** | "Process this invoice" | "What's my leave balance?" → "Apply for next Monday" |

#### Conversation Example

```json
{
  "conversation_id": "conv_abc123",
  "messages": [
    {"role": "user", "content": "What's my leave balance?"},
    {"role": "assistant", "content": "You have 12 days of PTO remaining."},
    {"role": "user", "content": "I'd like to take next Monday off"},
    {"role": "assistant", "content": "I'll submit a leave request for Monday. Please confirm."}
  ]
}
```

#### Query Example

```json
{
  "query": "Extract invoice number and total from attached PDF",
  "attachments": ["invoice_2024_001.pdf"]
}
```

---

## Decision Tables

### Actions vs Conversational Orchestration

| Scenario | Approach | Why |
|----------|----------|-----|
| **User asks a question** | Conversational | Need to understand intent, search knowledge |
| **Automated document processing** | Actions pipeline | No user interaction, deterministic flow |
| **IT ticket creation** | Conversational → Action | Gather info conversationally, then act |
| **Scheduled report generation** | Actions pipeline | No user in loop |
| **Complex multi-system workflow** | Action orchestration | Predictable, auditable execution |
| **Ambiguous user request** | Conversational | Need clarification |

### When to Use What

| Need | Solution |
|------|----------|
| Answer employee questions from policy docs | Chat AI Employee with search + respond agents |
| Process incoming emails automatically | Email-triggered AI Employee with classification + routing |
| Create IT tickets from chat | Chat AI Employee with external_action_caller to ServiceNow |
| Generate documents on demand | Document AI Employee with generate_document agent |
| Voice-based password reset | Voice AI Employee with verification workflow |
| Scheduled data extraction | Dashboard AI Employee with schedule trigger |

---

## End-to-End Examples

### Example 1: Simple HR Policy Q&A Bot

**Objective:** Answer employee questions about company policies.

#### 1. Create AI Employee
- Template: Chat AI Employee
- Name: "HR Policy Assistant"
- Trigger: Chat

#### 2. Configure Workflow

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

#### 3. Add Knowledge
- Upload: Employee Handbook PDF, Leave Policy DOCX, Benefits Guide PDF
- Enable tagging by location/department if needed

#### 4. Configure Response Agent

```yaml
user_instructions: |
  You are an HR assistant for ACME Inc.
  Answer questions using ONLY the provided documents.
  Always cite your sources.
  If you don't know the answer, say so and suggest contacting HR.
  Keep responses concise but complete.
```

#### 5. Test & Deploy
- Use preview mode with sample questions
- Verify source citations are correct
- Activate when satisfied

---

### Example 2: Enterprise IT Support with Ticket Creation

**Objective:** Triage IT requests, answer from knowledge base or create ServiceNow tickets.

#### 1. Create AI Employee
- Template: Chat AI Employee
- Name: "IT Support Assistant"
- Trigger: Chat (embed in intranet)

#### 2. Configure Workflow

```
[Chat Trigger]
      │
      ▼
[Intent Classifier] ───┬──── "Knowledge Question" ───▶ [Search] → [Respond]
                       │
                       ├──── "Ticket Request" ───▶ [Create Ticket] → [Confirm]
                       │
                       └──── "Unknown" ───▶ [Escalate/Create Ticket]
```

#### 3. Configure Intent Categories

```yaml
categories:
  - name: "Knowledge Question"
    description: "Questions about IT policies, how-to guides"
    examples:
      - "How do I connect to VPN?"
      - "What's the password policy?"
  
  - name: "Ticket Request"
    description: "Request for IT help or action"
    examples:
      - "My laptop is broken"
      - "I need software installed"
      - "I can't access the shared drive"
  
  - name: "Status Check"
    description: "Check on existing tickets"
    examples:
      - "What's the status of my ticket?"
      - "Has my request been resolved?"
```

#### 4. Configure ServiceNow Integration

```yaml
tools:
  - action: "tools.external.servicenow_Create_Ticket"
    inputs:
      ShortDescription: "{{llm_inferred}}"
      Description: "{{llm_inferred}}"
      Urgency: "{{llm_inferred}}"
      Impact: "{{llm_inferred}}"
      UserId: "{{user.email}}"
    humanInteractionConfig:
      alwaysPauseForHumanInteraction: true
      message: "Please confirm ticket details before submission"
```

#### 5. Test Scenarios
- "How do I reset my password?" → Should answer from KB
- "My laptop screen is cracked" → Should create ticket (with approval)
- "Check ticket INC0012345" → Should lookup and return status

---

### Example 3: Voice Password Reset

**Objective:** Enable employees to reset passwords via phone with identity verification.

#### 1. Create AI Employee
- Template: Voice AI Employee
- Name: "Password Reset Assistant"
- Trigger: Voice/Phone

#### 2. Configure Workflow

```
[Voice Trigger]
      │
      ▼
[Greeting Agent] ─── "Hi, I'm the IT assistant. I can help reset your password."
      │
      ▼
[Identity Verification 1] ─── "What's your employee ID?"
      │
      ▼
[Identity Verification 2] ─── "What are the last 4 digits of your SSN?"
      │
      ▼
[Verification Check] ───┬──── Success ───▶ [Send Reset Link] → [Confirm]
                        │
                        └──── Failure ───▶ [Transfer to Human Agent]
```

#### 3. Configure Voice Settings
- Voice: Select appropriate TTS voice
- Conversational style: Professional, clear, helpful
- Error handling: Graceful transfer to human on failures

---

## Troubleshooting & Gotchas

### Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| **Not testing with edge cases** | Unexpected failures in production | Test with empty inputs, long inputs, multilingual |
| **Overloading workflows** | Slow execution, timeouts | Keep workflows focused; split complex ones |
| **Missing HITL on sensitive actions** | Unintended actions taken | Add HITL for any action with external side effects |
| **Vague agent instructions** | Inconsistent responses | Be specific about tone, format, boundaries |
| **Not citing sources** | Trust issues | Enable `use_citation_based_filtering` |
| **Ignoring confidence scores** | Bad answers served confidently | Implement confidence thresholds |

### Debugging Checklist

When an AI Employee isn't working correctly:

1. **Check Status** — Is the AI Employee active/ready?
2. **Review Trigger** — Is the trigger correctly configured?
3. **Trace Execution** — Where does the workflow fail?
4. **Inspect Inputs** — Are inputs reaching agents correctly?
5. **Check Integrations** — Are connectors authenticated?
6. **Review Logs** — What errors appear?
7. **Test Isolation** — Does the agent work in isolation?

### Known Limitations

| Limitation | Workaround |
|------------|------------|
| **Long document processing** | Split into chunks, use async processing |
| **Real-time data needs** | Use external action callers with live APIs |
| **Complex calculations** | Use code execution tools or external services |
| **Multi-language in single workflow** | Detect language early, route appropriately |

### Error Handling Patterns

```yaml
# Graceful degradation example
runIf:
  condition: "{{search.search_results.length}} > 0"
  onTrue: "respond_with_sources"
  onFalse: "fallback_response"

# Fallback configuration
fallback_response:
  action: "call_llm"
  inputs:
    instructions: |
      The knowledge base doesn't have relevant information.
      Apologize and offer to create a ticket for human follow-up.
```

---

## Version & Documentation References

### Documentation URLs

| Resource | URL | Notes |
|----------|-----|-------|
| **Developer Docs** | https://developer.ema.co/ | API reference, SDK guides |
| **Builder Docs** | https://builder.ema.co/ | UI guides, tutorials |
| **Ema Website** | https://ema.co | Product overview, use cases |

### API Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Demo** | https://api.demo.ema.co | Testing, demos |
| **Dev** | https://api.dev.ema.co | Development |
| **Production** | https://api.ema.co | Live deployments |

### Version Information

- **Guide Version:** 1.0
- **Platform Version:** As of January 2026
- **Last Reviewed:** January 6, 2026

---

## Appendix: Template IDs Reference

Common template IDs observed in the platform:

| Template ID | Type |
|-------------|------|
| `00000000-0000-0000-0000-000000000001` | Basic Chat |
| `00000000-0000-0000-0000-000000000007` | Conversational Chat |
| `00000000-0000-0000-0000-00000000000a` | Email/Dashboard |
| `00000000-0000-0000-0000-00000000000b` | Document Writer |
| `00000000-0000-0000-0000-00000000000e` | Ticket Handler |
| `00000000-0000-0000-0000-000000000014` | Auto Builder |
| `00000000-0000-0000-0000-00000000001e` | Voice AI Employee |
| `10d38c96-e4fb-4aa6-9586-aad0bfbc2f0d` | Dashboard Workflow |

---

*This guide covers the fundamentals of Ema's platform. For the latest updates and detailed API references, visit the official documentation at [developer.ema.co](https://developer.ema.co)*<!--tomb-->
