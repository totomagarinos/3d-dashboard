# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | ~/.claude/skills/branch-pr/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | ~/.claude/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | ~/.claude/skills/judgment-day/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | ~/.config/opencode/skills/go-testing/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | ~/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue (Closes #N, Fixes #N, Resolves #N) — no exceptions
- Issue MUST have `status:approved` label before PR can be opened
- Branch naming: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- PR template at `.github/PULL_REQUEST_TEMPLATE.md` — use it, fill ALL sections
- Add exactly one `type:*` label matching the PR type
- PR body MUST include: Linked Issue, PR Type checkbox + label, Summary (1-3 bullet points), Changes Table, Test Plan
- Automated checks must pass before merge

### issue-creation
- Blank issues disabled — MUST use template (bug_report.yml or feature_request.yml)
- Every issue gets `status:needs-review` label automatically on creation
- Maintainer MUST add `status:approved` before any PR can be opened
- Search existing issues for duplicates first
- Bug Report requires: pre-flight checks, description, steps to reproduce, expected/actual behavior, OS, agent/client, shell
- Questions go to Discussions, not issues

### judgment-day
- Launch TWO independent blind judge sub-agents in PARALLEL via `delegate` (async) — never sequential
- Each judge receives the SAME target but works independently, neither knows about the other
- Skill resolution: read registry, match by code/task context, inject `## Project Standards` into BOTH judges AND fix agent
- Synthesize verdict: Confirmed (both found) → fix; Suspect (one found) → triage; Contradiction → manual
- WARNING classification: real (causes bug in production scenario, fix required) vs theoretical (contrived scenario, report as INFO)
- After round 1: present verdict to user, ASK before fixing. Round 2+: fix confirmed CRITICALs without re-judging
- After 2 fix iterations, if issues remain → ASK user whether to continue
- NEVER do the review yourself — coordination only

### go-testing
- Table-driven tests: use `[]struct{ name, input, expected, wantErr }` with `t.Run()` sub-tests
- Bubbletea: test model state transitions directly via `m.Update(tea.KeyMsg{...})`
- Teatest: use `teatest.NewTestModel(t, m)` for integration-style TUI testing with `tm.Send()` and `tm.WaitFinished()`
- Golden file testing: compare output against `testdata/*.golden`, use `*update` flag to regenerate
- Always use `t.Errorf` instead of `t.Fatalf` in model/view tests to report all failures
- Prefer `go test ./...` with `-count=1` to disable test caching

### skill-creator
- Create `skills/{skill-name}/SKILL.md` with frontmatter (name, description, license, metadata.author, metadata.version)
- Description MUST include trigger keywords after "Trigger:" so agents auto-load on context
- Compact patterns > lengthy explanations. Keep code examples minimal and focused.
- Include Commands section with copy-paste commands
- `assets/` for templates/schemas/examples, `references/` for local doc links only (no web URLs)
- After creating, add to AGENTS.md trigger table and update skill registry
- DON'T create for one-off tasks, trivial patterns, or where docs already exist
- DON'T add Keywords section, troubleshooting, or web URLs

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| CLAUDE.md | backend/CLAUDE.md | Bun conventions for backend |

Read the convention files listed above for project-specific patterns and rules.
