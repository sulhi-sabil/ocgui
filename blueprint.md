# Project Blueprint: OpenCode Desktop Control Center

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Market & User Intelligence](#2-market--user-intelligence)
  - [Target Personas](#target-personas)
  - [Pain Points Validated by OpenCode Ecosystem](#pain-points-validated-by-opencode-ecosystem)
  - [Competitive Landscape](#competitive-landscape)
- [3. Product Specifications](#3-product-specifications)
  - [Core Features (V1 MVP)](#core-features-v1-mvp)
  - [Secondary Features (Post-V1)](#secondary-features-post-v1)
- [4. Technical Architecture](#4-technical-architecture)
  - [Frontend/UI Framework](#frontendui-framework)
  - [Backend/CLI Integration Layer (Rust in Tauri)](#backendcli-integration-layer-rust-in-tauri)
  - [Infrastructure & Deployment](#infrastructure--deployment)
  - [Data Strategy](#data-strategy)
- [5. Strategic Growth](#5-strategic-growth)
  - [Key Performance Indicators (KPIs)](#key-performance-indicators-kpis)
  - [Go-to-Market Strategy](#go-to-market-strategy)
  - [Revenue Model (Future Consideration—NOT V1)](#revenue-model-future-considerationnot-v1)
- [6. User Experience Design Principles](#6-user-experience-design-principles)
  - [Design Philosophy: "CLI-Native, GUI-Augmented"](#design-philosophy-cli-native-gui-augmented)
  - [Interaction Patterns](#interaction-patterns)
- [7. Success Criteria & MVP Boundary](#7-success-criteria--mvp-boundary)
  - [V1 Scope (Included)](#v1-scope-included)
  - [V1 Exclusions (Future Roadmap)](#v1-exclusions-future-roadmap)
  - [Launch Criteria (Definition of "Ready")](#launch-criteria-definition-of-ready)
- [8. Risk Mitigation](#8-risk-mitigation)
  - [Technical Risks](#technical-risks)
  - [Product Risks](#product-risks)
- [9. Long-Term Vision (12-24 Months)](#9-long-term-vision-12-24-months)
- [10. Non-Negotiables (Direction Lock)](#10-non-negotiables-direction-lock)
- [Appendix: Technical References](#appendix-technical-references)

---

## 1. Executive Summary

**Concept Definition**: A native desktop application that transforms OpenCode CLI from a terminal-only tool into a visually orchestrated control plane—exposing agents, skills, tools, commands, configs, and plugins through a high-performance GUI while preserving CLI as the single execution authority [web:1][web:2].

**Value Proposition**: Eliminates cognitive overhead of managing fragmented agent logic, opaque configurations, and slow plugin iteration by providing a first-class orchestration interface that mirrors OpenCode's native mental model without abstraction loss or vendor lock-in [web:30].

**Strategic Positioning**: Desktop-native, local-first, single-user power tool designed for the 250,000+ monthly developers already using OpenCode CLI [web:30]—not a SaaS wrapper, not a simplified abstraction, but a **canonical GUI layer** for the existing ecosystem.

---

## 2. Market & User Intelligence

### Target Personas

**Primary**: AI engineers and developer-operators (DevOps/platform engineers) who actively build custom agents, compose skills from reusable commands, and extend OpenCode through plugins—representing the top 15-20% of OpenCode's user base by engagement depth [web:1][web:2].

**Secondary**: Power users transitioning from pure CLI usage who need visual context for multi-agent orchestration, configuration debugging, and execution inspection without sacrificing terminal workflow flexibility [web:6].

### Pain Points Validated by OpenCode Ecosystem

1. **Agent Management Fragmentation**: Agent definitions scattered across AGENTS.md files, skill folders (.opencode/skills/), and opencode.json configurations create high cognitive load when managing 5+ custom agents [web:1][web:2][web:8].

2. **Skill-Tool Composition Opacity**: Skills are loaded on-demand via the skill tool, but visualizing which commands map to which tools across multiple agents requires manual file inspection and mental modeling [web:1][web:7].

3. **Configuration Error Surface**: OpenCode's permission system (allow/deny/ask patterns for tools, skills, wildcards for MCP servers) is powerful but error-prone when edited as raw JSON—invalid configs block execution with no validation preview [web:2][web:7][web:13].

4. **Plugin Development Friction**: Reloading plugins requires restarting OpenCode sessions; debugging plugin hooks (events, tool integrations) lacks real-time feedback loops [web:8].

5. **Execution Context Loss**: CLI stdout/stderr streams provide raw output but lack structured inspection—no diff between runs, no replay capability, no visual mapping of agent → tool → outcome chains [web:6][web:31].

### Competitive Landscape

**Direct**: No native GUI exists for OpenCode CLI. OpenCode offers TUI (terminal UI), Desktop app, and IDE extensions, but the Desktop app is a standalone interface, not a CLI orchestration layer [web:4][web:5][web:6].

**Indirect Analogues**:
- **GitHub Desktop** (Git CLI wrapper preserving CLI execution)
- **Postman** (API testing GUI with scripting backend)
- **Kubernetes Dashboard** (visual control plane for kubectl)
- **Agent orchestration tools** (Lindy.ai, Gumloop) focus on cloud-based multi-agent workflows, not local CLI wrapping [web:41].

**Differentiation**: This product is the **only desktop GUI** that treats OpenCode CLI as the execution engine while surfacing agents/skills/tools/plugins as first-class orchestration primitives—no SaaS dependency, no architectural divergence from OpenCode's core design [web:1][web:2][web:8].

---

## 3. Product Specifications

### Core Features (V1 MVP)

1. **Agent Lifecycle Orchestration**
   - Visual agent registry with enable/disable toggles, metadata editing (name, description, model overrides), and skill/tool assignment interfaces [web:2].
   - **CRUD operations**: Create new agents via GUI forms (frontmatter → AGENTS.md), edit existing agents (both custom and built-in like Build/Plan), archive/delete agents [web:2][web:3].
   - **Live agent switching**: Mirror OpenCode's Tab-key agent cycling with visual indicators showing active agent and available alternates [web:2][web:6].

2. **Skill Composition Engine**
   - **Skill-to-command mapping**: Graph view showing which SKILL.md files reference which commands/tools, filterable by skill location (.opencode/skills/ vs global ~/.config/opencode/skills/) [web:1].
   - **Permission overlay**: Visual representation of allow/deny/ask rules per skill, with pattern matching preview (e.g., "internal-*" matches which skills) [web:1][web:13].
   - **Skill scaffolding**: Template generator for new SKILL.md files with schema validation against OpenCode's format (name, description, content blocks) [web:1].

3. **Command & Tool Registry Inspector**
   - **Tool catalog**: Structured view of native tools (edit, bash, webfetch, skill, question) plus MCP server tools, with schema/parameter inspection [web:7].
   - **Permission matrix**: Tabular view of tool permissions across all agents (global defaults vs agent-specific overrides) with conflict highlighting [web:2][web:7][web:13].
   - **Wildcard rule tester**: Input pattern → preview matched tools (e.g., "mcp-server-*" shows all matched MCP tools) [web:7].

4. **Visual Configuration Editor**
   - **Schema-driven forms**: JSON Schema-based UI for opencode.json editing—structured inputs for providers, agents, tools, permissions, experimental flags [web:2][web:10][web:31].
   - **Pre-execution validation**: Real-time config linting with error highlighting (missing required fields, invalid permission values, type mismatches) preventing broken configs from reaching CLI [web:2][web:10].
   - **Multi-config management**: Support project-specific (.opencode/opencode.json) vs global (~/.config/opencode/opencode.json) configs with merge preview and conflict resolution [web:1][web:10].

5. **Plugin Management System**
   - **Plugin registry**: List installed plugins with metadata (name, version, hooks registered), enable/disable without file deletion [web:8].
   - **Hot reload**: Trigger plugin reload without restarting CLI session—exposes OpenCode's plugin event system (on_message, on_tool_call, etc.) [web:8].
   - **Plugin scaffolding**: Generate boilerplate plugin structure with example hooks and type definitions [web:8].
   - **Event log viewer**: Real-time stream of plugin hook invocations (which events fired, which plugins responded, execution timing) [web:8].

6. **CLI-Orchestrated Execution Console**
   - **Subprocess management**: Spawn opencode CLI as child process with workspace detection, pass GUI-configured agents/models/sessions as flags [web:31].
   - **Streaming output parser**: Capture stdout/stderr with ANSI color preservation, parse structured tool calls (edit, bash, skill invocations) into collapsible blocks [web:6][web:31].
   - **Execution control**: Start/stop/restart runs, send interrupt signals (Ctrl+C equivalent), inject mid-run commands [web:31].
   - **Session continuity**: Resume previous sessions via --session flag, sync session history from OpenCode's storage (~/.local/share/opencode/) [web:6][web:31].

7. **Run History & Execution Inspector**
   - **Structured run logs**: Store execution metadata (timestamp, agent used, model, input prompt, tool calls sequence, output, exit status) in local SQLite DB [web:31][web:32].
   - **Diff viewer**: Side-by-side comparison of two runs—highlight prompt changes, tool call deltas, output differences [web:31].
   - **Replay mode**: Re-execute past runs with same inputs/configs, visualize divergence if model/agent changed [web:31].
   - **Tool call graph**: Flowchart showing agent → tool → subagent delegation chains for complex multi-tool executions [web:2][web:7].

8. **Local Persistence Layer**
   - **File-system sync**: Read/write agents from AGENTS.md, skills from SKILL.md folders, configs from opencode.json—no proprietary storage formats [web:1][web:2][web:3][web:10].
   - **Conflict detection**: Warn if GUI state diverges from file system (external edits detected via file watchers) [web:31].
   - **Export/import**: Backup agent sets, skill collections, configs as portable packages (zip with manifest) [web:1][web:2].

### Secondary Features (Post-V1)

- **Skill dependency graph**: Visualize when skills reference other skills, detect circular dependencies [web:1].
- **Agent comparison view**: Side-by-side diff of two agents' tool permissions, skill access, model configs [web:2].
- **Keyboard-driven power mode**: Vim-style keybindings for all GUI actions (j/k navigation, "/" search, ":" command palette) [web:6][web:21].
- **Token usage analytics**: Parse OpenCode stats output (opencode stats --days 7) into charts—cost by agent, tokens by tool, model breakdown [web:31].
- **Config templates library**: Pre-built configs for common scenarios (security-hardened agent, multi-MCP setup, local-only mode) [web:2][web:10].

---

## 4. Technical Architecture

### Frontend/UI Framework

**Primary Choice: Tauri v2** [web:20][web:23][web:25][web:28]
- **Bundle size**: 4-12MB vs Electron's 100MB+ (critical for developer tool adoption—avoid bloat perception) [web:20][web:25].
- **Memory footprint**: ~50-100MB idle vs Electron's ~500MB—enables running GUI alongside resource-heavy LLM processes without system strain [web:28].
- **Startup time**: <0.5s vs Electron's 1-2s (aligns with CLI-speed expectations of target users) [web:20].
- **Rust backend**: Native performance for subprocess management (spawning opencode CLI), file watching (detect external edits to AGENTS.md, opencode.json), and log parsing [web:23][web:25].
- **Native WebView**: macOS WKWebView, Windows WebView2, Linux WebKitGTK—no bundled Chromium, smaller attack surface [web:23].

**UI Layer: React + TypeScript**
- **Component library**: Radix UI primitives for accessible forms, modals, tooltips (schema-driven config editor needs robust form validation) [web:21].
- **State management**: Zustand for local state (current agent, active tab), TanStack Query for CLI interaction caching (run history, config reads).
- **Code editor**: Monaco Editor for SKILL.md/AGENTS.md editing with Markdown syntax highlighting, diff view for run comparison [web:1][web:3].
- **Graph visualization**: Reactflow for skill dependency graphs, agent-tool permission matrices [web:1][web:7].

### Backend/CLI Integration Layer (Rust in Tauri)

**Subprocess Orchestration**
- Spawn opencode CLI via std::process::Command with stdio piping (capture stdout/stderr for streaming console) [web:31].
- Parse CLI flags from GUI state (--agent, --model, --session, --continue) and inject environment variables (OPENCODE_CONFIG_PATH for multi-config support) [web:10][web:31].
- Signal handling: Forward SIGINT/SIGTERM from GUI stop button to CLI subprocess [web:31].

**File System Watchers**
- Monitor .opencode/, ~/.config/opencode/, ~/.local/share/opencode/ for external changes (detect if user edits AGENTS.md in editor while GUI open) [web:1][web:2][web:31][web:32].
- Debounced reload: Refresh GUI state 500ms after last file change (avoid flicker during rapid edits).

**Configuration Validator**
- Embed JSON Schema for opencode.json (from OpenCode docs) [web:10].
- Pre-save validation: Block writes if schema invalid, surface errors in GUI form (missing required fields, type errors).

**Log Aggregator**
- Tail opencode logs from ~/.local/share/opencode/log/ (timestamped .log files) [web:32].
- Parse structured tool calls (regex match skill tool invocations, edit operations) into GUI timeline [web:6][web:7].

### Infrastructure & Deployment

**Build System**
- GitHub Actions CI/CD: Build .dmg (macOS), .exe (Windows), .AppImage (Linux) on each release tag [web:20].
- Code signing: macOS notarization (avoid Gatekeeper blocks), Windows Authenticode (prevent SmartScreen warnings) [web:20][web:23].
- Auto-updater: Tauri's built-in updater for silent background updates (critical for plugin API changes) [web:23].

**Installation Flow**
- **Prerequisite check**: Verify opencode CLI installed (run opencode --version), display install instructions if missing (link to https://opencode.ai/download) [web:14][web:15][web:33].
- **Workspace detection**: On first launch, prompt user to select OpenCode workspace (project root with .opencode/ or ~/.config/opencode/) [web:1][web:2].
- **Migration assistant**: Detect existing opencode.json, offer to import or create new config [web:10].

### Data Strategy

**Storage Architecture**
- **Primary source of truth**: File system (AGENTS.md, SKILL.md, opencode.json)—GUI reads/writes these files directly [web:1][web:2][web:3][web:10].
- **Metadata cache**: SQLite DB for run history (execution logs, timestamps, diffs), plugin registry (installed plugins, enabled state), UI preferences (theme, window size) [web:8][web:31].
- **Sync strategy**: File watcher → invalidate cache → reload from disk (unidirectional flow: FS truth, GUI reflects).

**Data Model Entities** (aligned with OpenCode's primitives)

| Entity | Storage | Schema |
|--------|---------|--------|
| Agent | AGENTS.md + opencode.json | name, description, model, tools{}, permissions{}, skills{} [web:2][web:3] |
| Skill | .opencode/skills/*/SKILL.md | name, description, content (instructions) [web:1] |
| Command | CLI built-in | name, args, output injection (! command syntax) [web:34] |
| Tool | opencode.json + MCP | name, permission (allow/deny/ask), parameters [web:7][web:13] |
| Config | opencode.json | providers, agents, tools, experimental flags [web:10][web:31] |
| Plugin | Plugin registry (file-based) | name, version, hooks[], enabled boolean [web:8] |
| Run | SQLite (GUI-managed) | session_id, timestamp, agent, model, input, output, tools_used[] [web:31] |
| RunLog | SQLite | run_id, log_lines[], tool_calls[], exit_status [web:32] |

---

## 5. Strategic Growth

### Key Performance Indicators (KPIs)

**Adoption Metrics**
1. **Activation Rate**: % of CLI users who install GUI and complete first agent edit within 7 days (target: 12% of 250K monthly CLI users = 30K MAU) [web:30][web:42].
2. **Depth of Use**: Avg features used per session—track if users only launch agents (shallow) vs edit skills + manage plugins (deep engagement) [web:42].
   - **Benchmark**: 4+ feature interactions/session (agent edit, skill composition, config validation, run inspection) = "power user" cohort.
3. **Time to First Value (TTFV)**: Median time from install → first successful CLI execution via GUI (target: <3 minutes) [web:42].

**Technical Health**
4. **CLI Execution Success Rate**: % of GUI-initiated runs that complete without subprocess errors (target: >95%—failures indicate integration bugs) [web:31].
5. **Config Validation Catch Rate**: % of invalid opencode.json edits blocked pre-save (target: 100% of schema violations prevented) [web:10].
6. **Plugin Hot-Reload Latency**: P95 time from "reload" button click → plugin hooks active (target: <500ms) [web:8].

**User Efficiency Gains**
7. **Agent Creation Speed**: Time to create + configure new agent (GUI vs manual AGENTS.md editing)—target 60% reduction (5 min → 2 min).
8. **Skill Discovery**: Time to find + load relevant skill from 50+ skill library—target 70% reduction via search/filter UI [web:1].

**Retention & Stickiness**
9. **DAU/MAU Ratio**: Daily actives / Monthly actives (target: >25%—reflects habitual use for agent iteration) [web:42].
10. **Multi-Config Adoption**: % of users managing 2+ opencode.json configs (project-specific setups)—indicator of advanced workflow integration [web:10].

### Go-to-Market Strategy

**Phase 1: Early Adopter Seeding (Months 1-2)**
- **Target**: OpenCode contributors (230 GitHub contributors) [web:30] + top 100 Discord community members.
- **Channels**:
  1. Post in OpenCode GitHub Discussions (pin feature announcement).
  2. Demo video on https://opencode.ai/changelog (18s users check changelog) [web:5].
  3. Tweet from OpenCode official account (29K stars = likely 5-10K Twitter followers) [web:30].
- **Onboarding Hook**: "Manage 5+ custom agents? This GUI cuts setup time by 60%." (pain → solution, quantified benefit).
- **Success Metric**: 500 installs, 20% activation rate (100 users complete first agent edit).

**Phase 2: Community-Driven Growth (Months 3-6)**
- **YouTube Tutorials**: Partner with creators who made OpenCode guides (e.g., "OpenCode CRASH Course" channel with 10K+ views) [web:16][web:19][web:22].
  - Content angle: "Build a Multi-Agent System in 10 Minutes (No Code)" → showcase skill composition + plugin management.
- **Awesome-OpenCode Integration**: Submit to awesome-opencode repo (curated list with 1K+ stars) [web:17].
- **Reddit/Dev.to**: Post "Show HN" on Hacker News, write technical deep-dive on Dev.to ("How We Built a Native GUI for 250K CLI Users Without Breaking Their Workflow") [web:27].
- **Success Metric**: 5K MAU, 15% depth-of-use (750 users editing skills/plugins regularly).

**Phase 3: Ecosystem Flywheel (Months 7-12)**
- **Plugin Marketplace Prep**: GUI becomes **the** interface for discovering/installing community plugins (even if marketplace is V2 feature, GUI lays groundwork).
- **Enterprise Pilot**: Target AI engineering teams at companies using OpenCode for internal tooling—pitch "team config templates" + "plugin standardization" (future features).
- **Conference Presence**: Demo at developer conferences (React Summit, DevOps Days) focusing on "AI agent orchestration UX" angle.
- **Success Metric**: 20K MAU, 30% DAU/MAU (habitual daily use), 50+ community-contributed skill packs imported via GUI.

### Revenue Model (Future Consideration—NOT V1)
- **V1 = 100% Free/OSS**: No monetization during validation phase (align with OpenCode's open-source ethos) [web:14][web:30].
- **Potential V2+ Paths**:
  1. **Team Sync Features**: Paid add-on for shared agent libraries, centralized plugin management (cloud storage for configs).
  2. **Enterprise Support**: SLA-backed support for companies deploying GUI to 50+ developers.
  3. **Plugin Certification**: Paid program for plugin developers to get "verified" badges in future marketplace.

---

## 6. User Experience Design Principles

### Design Philosophy: "CLI-Native, GUI-Augmented"

**1. Zero Abstraction Loss** [web:1][web:2]
- Every GUI element maps 1:1 to OpenCode concepts—never introduce proprietary terms (e.g., "workflows" instead of "skills").
- Users must be able to complete the same task in CLI or GUI interchangeably (e.g., editing AGENTS.md manually or via GUI form produces identical files).

**2. Keyboard-First Interaction** [web:6][web:21]
- All critical actions accessible via keyboard shortcuts (inspired by VS Code Command Palette: Cmd+Shift+P).
- Examples:
  - `Cmd+N` → New Agent
  - `Cmd+E` → Execute Current Agent
  - `Cmd+K` → Search Skills
  - `Cmd+,` → Open Config Editor
- Mouse usage optional for power users who live in terminals.

**3. Progressive Disclosure** [web:21][web:24]
- **Beginner mode**: Hide advanced options (experimental flags, wildcard permission patterns) behind "Advanced" accordions [web:10][web:31].
- **Power user mode**: Toggle in settings to show all fields, enable vim keybindings, display raw JSON alongside GUI forms [web:21].

**4. Real-Time Feedback** [web:21][web:42]
- **Config validation**: Inline errors as user types (red underline + tooltip) [web:10].
- **Skill permission preview**: Change "allow internal-*" → instantly highlight 4 matched skills [web:1][web:13].
- **CLI output streaming**: Show stdout/stderr with <100ms latency (no buffering) [web:6][web:31][web:49].

**5. Visual Hierarchy for Complexity** [web:21][web:24]
- **Agent Dashboard**: Card layout (1 card/agent) with color-coded status (green = enabled, gray = disabled).
- **Skill Graph**: Hierarchical tree (commands → skills → agents) with zoom/pan for large repos (50+ skills).
- **Run Comparison**: Split-pane diff with syntax highlighting (unified diff view for text, table diff for tool calls).

### Interaction Patterns

**Agent Creation Flow** (target: <2 min) [web:2][web:3]
1. Dashboard → "New Agent" button → Modal form.
2. Required fields: Name, Description (auto-suggest based on similar agents).
3. Optional: Model override (dropdown of configured providers [web:12]), tool permissions (checkboxes), skill access (multi-select) [web:1][web:7].
4. Preview: Show generated AGENTS.md frontmatter before save.
5. Save → File written, CLI subprocess reloads agents, dashboard updates.

**Skill Composition Workflow** [web:1]
1. Skill Manager → "New Skill" → Template selector (API docs, database migration, testing).
2. Rich text editor for SKILL.md content (Markdown preview, syntax highlighting for code blocks).
3. Command injection: Type `! git log --oneline` → preview shows sample output.
4. Permission wizard: "Which agents can use this skill?" → Checkboxes for agents + global default dropdown.
5. Test mode: Run skill in isolated sandbox (dry-run via opencode --command skill load <name>).

**Execution Console Experience** [web:6][web:31][web:49]
- **Left pane**: Input prompt editor (Markdown-aware, file drag-drop for @file references [web:34]).
- **Right pane**: Streaming output with:
  - **Tool call blocks**: Collapsible sections for `edit`, `bash`, `skill` invocations (show args + results).
  - **Status indicators**: Spinner for in-progress, checkmark for success, red X for errors [web:49].
  - **Thinking visibility toggle**: Show/hide LLM reasoning blocks (thinking: true/false) [web:6].
- **Bottom bar**: Session controls (stop, restart, save as template), token counter (live update from opencode stats) [web:31].

---

## 7. Success Criteria & MVP Boundary

### V1 Scope (Included)

**Must-Have Features** (Core Definition)
✅ Full agent CRUD (create, read, update, disable/enable) [web:2][web:3].
✅ Skill composition with permission management [web:1][web:13].
✅ Visual config editor with schema validation [web:10].
✅ Plugin hot-reload + event log viewer [web:8].
✅ CLI-orchestrated execution with streaming output [web:31].
✅ Local run history with diff/replay [web:31].

**Platform Support**
✅ macOS (arm64 + x86_64), Windows (x64), Linux (Ubuntu/Debian .AppImage).

**Performance Targets**
✅ Startup time: <1s (cold launch) [web:20].
✅ CLI subprocess spawn: <200ms [web:31].
✅ Config validation: <50ms for 500-line opencode.json [web:10].

### V1 Exclusions (Future Roadmap)

**Cloud Features**
❌ Remote execution (run agents on cloud VMs).
❌ Config/skill sync across devices.
❌ Team collaboration (shared agent libraries).

**AI-Powered Features**
❌ Auto-generate agents from natural language descriptions.
❌ Skill recommendation engine ("Users like you also use...").
❌ Intelligent config optimization (suggest model/tool combos).

**Marketplace**
❌ Plugin discovery/installation UI (browse community plugins).
❌ Skill template gallery.

**Advanced Debugging**
❌ Step-through debugger for agent execution (pause/inspect mid-run).
❌ Performance profiler (token usage heatmap per agent).

### Launch Criteria (Definition of "Ready")

| Criterion | Threshold | Validation Method |
|-----------|-----------|-------------------|
| Feature completeness | 100% of V1 scope implemented | QA checklist sign-off |
| CLI compatibility | Works with OpenCode v1.0+ | Test against 3 latest releases |
| Crash rate | <1% of sessions (Sentry telemetry) | 2-week beta test with 100 users |
| Config migration success | >95% of existing opencode.json files import cleanly | Test against 50 real-world configs from Discord/GitHub |
| Documentation | Guide + 3 video tutorials published | https://opencode.ai/docs/gui/ live |
| Community validation | 10+ beta testers give "would use daily" feedback | Private Discord channel poll |

---

## 8. Risk Mitigation

### Technical Risks

**Risk 1: CLI API Changes Break Integration**
- **Impact**: High (GUI becomes unusable if OpenCode CLI changes flags/output format).
- **Mitigation**:
  1. Version pinning: GUI declares "compatible with OpenCode >=1.0.0 <2.0.0" in package.json.
  2. Integration tests: CI runs GUI against nightly OpenCode builds, alert on failures.
  3. Upstream contribution: Submit PR to OpenCode for `--json-output` flag (structured tool call logs) [web:31].

**Risk 2: File Watcher Performance on Large Repos**
- **Impact**: Medium (100+ skills = slow GUI refresh).
- **Mitigation**:
  1. Debouncing: 500ms delay after last file change before reload.
  2. Selective watch: Only monitor .opencode/, ignore node_modules/, .git/.
  3. Incremental updates: Parse only changed files, not full re-scan.

**Risk 3: Plugin Hot-Reload Causes State Corruption**
- **Impact**: Medium (reloaded plugin crashes CLI subprocess).
- **Mitigation**:
  1. Sandbox mode: Test reload in isolated subprocess before applying to main session [web:8].
  2. Rollback: Cache previous plugin state, restore on reload failure.
  3. User warning: "Reloading plugins may disrupt active runs—save work first."

### Product Risks

**Risk 4: Users Prefer CLI-Only Workflow**
- **Impact**: High (low adoption if power users reject GUI).
- **Mitigation**:
  1. Hybrid mode: Allow CLI commands from GUI terminal (embed terminal tab).
  2. Export CLI commands: Every GUI action shows equivalent CLI command (e.g., "Create Agent" → `opencode agent create --name=...`).
  3. Early feedback: Beta test with 50 CLI-first users, iterate on friction points.

**Risk 5: Abstraction Creep (Feature Requests Diverge from OpenCode's Model)**
- **Impact**: Medium (community asks for features that violate "zero abstraction loss").
- **Mitigation**:
  1. Direction lock (from original blueprint): Reject features that hide agents/skills/tools/configs [web:1][web:2].
  2. Governance: Publish "Product Principles" doc in repo—link in issue templates.
  3. Upstream alignment: Propose GUI-friendly OpenCode improvements (e.g., structured logs) instead of GUI workarounds.

---

## 9. Long-Term Vision (12-24 Months)

**Year 1 Goal**: Become the **default interface** for 15% of OpenCode CLI users (37.5K MAU from 250K base) [web:30].

**Year 2 Expansion**:
1. **Team Features**: Shared agent libraries synced via Git (not cloud), plugin update notifications.
2. **Plugin Ecosystem**: In-app marketplace for community skills/plugins (curated, not open submission) [web:8][web:17].
3. **AI-Assisted Workflows**: Natural language → agent config (e.g., "Create a security-focused agent that can only read files" → auto-generate opencode.json) [web:2][web:10].
4. **Cross-Platform Sync**: Optional encrypted cloud backup for configs (self-hosted or OpenCode-hosted S3).

**Exit Criteria for Success**:
- **Metric**: 50K MAU, 40% DAU/MAU (20K daily actives).
- **Ecosystem**: 500+ community plugins, 50+ skill packs, 10+ enterprise deployments.
- **Upstream Impact**: OpenCode CLI adds official `--gui-mode` flag that launches this app (full integration).

---

## 10. Non-Negotiables (Direction Lock)

These constraints **cannot** be violated without fundamentally breaking the product's identity:

1. **CLI remains execution authority**: GUI never bypasses opencode CLI for agent runs, skill loading, or tool calls [web:1][web:2][web:31].
2. **File system is source of truth**: No proprietary storage—agents in AGENTS.md, skills in SKILL.md, configs in opencode.json [web:1][web:2][web:3][web:10].
3. **Local-first, single-user**: No cloud dependency for core features (sync/backup are optional add-ons) [web:30].
4. **Zero abstraction loss**: GUI terminology mirrors OpenCode docs exactly (agents, skills, tools, commands, configs, plugins) [web:1][web:2][web:7][web:8].
5. **Open source**: MIT license, GitHub repo public, community contributions welcome (aligned with OpenCode's OSS ethos) [web:30].
6. **No vendor lock-in**: Users can export all data (agents, skills, runs) and switch back to pure CLI without data loss [web:1][web:2].

---

## Appendix: Technical References

**OpenCode Documentation Anchors** (for integration spec):
- Agent configuration: https://opencode.ai/docs/agents/ [web:2]
- Skill system: https://opencode.ai/docs/skills/ [web:1]
- Tools & permissions: https://opencode.ai/docs/tools/ [web:7]
- Config schema: https://opencode.ai/docs/config/ [web:10]
- Plugin hooks: https://opencode.ai/docs/plugins/ [web:8]
- CLI flags: https://opencode.ai/docs/cli/ [web:31]
- Logs & troubleshooting: https://opencode.ai/docs/troubleshooting/ [web:32]

**Community Resources**:
- GitHub: https://github.com/sst/opencode (29K stars, 230 contributors) [web:30]
- Awesome-OpenCode: https://github.com/awesome-opencode/awesome-opencode [web:17]
- Changelog: https://opencode.ai/changelog (feature velocity tracker) [web:5]
