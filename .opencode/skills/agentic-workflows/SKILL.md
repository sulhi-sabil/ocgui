---
name: agentic-workflows
description: Design and implement automated agentic workflows for repository automation
license: MIT
compatibility: opencode
metadata:
  workflow: automation
  audience: devops-engineers
---

# Agentic Workflows Skill

## When to Use
- Automating repository tasks
- Creating CI/CD pipelines with agents
- Implementing automated code reviews
- Setting up issue triage automation

## Workflow Patterns

### 1. Code Review Workflow
```
Trigger: Pull Request opened
Steps:
├── Run linters and type checks
├── Execute test suite
├── Security scan dependencies
├── Generate review comments
└── Auto-approve if all checks pass
```

### 2. Issue Triage Workflow
```
Trigger: New issue created
Steps:
├── Classify issue type (bug/feature/docs)
├── Extract relevant code context
├── Suggest labels and assignee
├── Generate initial response
└── Link related issues/PRs
```

### 3. Documentation Sync Workflow
```
Trigger: Code changes merged
Steps:
├── Detect API changes
├── Update OpenAPI specs
├── Generate changelog entries
├── Update README if needed
└── Notify documentation team
```

## Implementation

### Workflow Definition
```typescript
interface Workflow {
  name: string;
  trigger: Trigger;
  steps: Step[];
  onError: ErrorHandler;
  onSuccess: SuccessHandler;
}

interface Step {
  name: string;
  action: string;
  condition?: string;
  retry?: number;
  timeout?: number;
}
```

### GitHub Actions Integration
```yaml
name: Agentic Review
on: pull_request

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Agent Review
        run: opencode run /review-pr
```

## Best Practices

### Guardrails
- Define clear boundaries for agent actions
- Require human approval for destructive operations
- Log all actions for audit trail
- Set rate limits on automated operations

### Error Handling
```typescript
async function executeWorkflow(workflow: Workflow): Promise<Result> {
  try {
    for (const step of workflow.steps) {
      if (step.condition && !evaluate(step.condition)) {
        continue;
      }
      await executeStep(step);
    }
    return { success: true };
  } catch (error) {
    await workflow.onError(error);
    return { success: false, error };
  }
}
```

## Workflow Templates

### Automated Testing
- Run on every push
- Parallel test execution
- Coverage reporting
- Flaky test detection

### Release Automation
- Version bump calculation
- Changelog generation
- Release PR creation
- npm/pypi publish

### Security Scanning
- Dependency audit
- Secret detection
- CodeQL analysis
- SARIF report upload
