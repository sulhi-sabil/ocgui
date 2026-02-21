---
name: moai-adk-tool
description: Integration with MOAI ADK for advanced agent tooling and orchestration
license: MIT
compatibility: opencode
---

# MOAI ADK Tool Skill

## When to Use
- Multi-agent coordination
- Complex task decomposition
- Resource management
- Workflow orchestration

## MOAI Framework

### Core Concepts
- **Agents**: Autonomous entities with specific capabilities
- **Tasks**: Units of work to be completed
- **Tools**: External capabilities agents can use
- **Orchestration**: Coordination of multiple agents

### Architecture
```
MOAI System:
├── Agent Registry
│   ├── Agent A (Frontend)
│   ├── Agent B (Backend)
│   └── Agent C (DevOps)
├── Task Manager
│   ├── Task Queue
│   ├── Scheduler
│   └── Monitor
└── Tool Registry
    ├── Git Tools
    ├── Build Tools
    └── Test Tools
```

## Agent Configuration

### Agent Definition
```typescript
interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  tools: string[];
  model: string;
  permissions: Permission[];
}
```

### Task Assignment
```typescript
interface Task {
  id: string;
  type: string;
  priority: number;
  assignedAgent: string;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}
```

## Integration Patterns

### 1. Sequential Execution
```
Task A → Task B → Task C
```

### 2. Parallel Execution
```
        ┌→ Task A ─┐
Task 0 ─┼→ Task B ─┼→ Task 1
        └→ Task C ─┘
```

### 3. Conditional Execution
```
Task A ─┬─[condition]→ Task B
        └─[else]─────→ Task C
```

## Tool Integration

### Built-in Tools
- **File Operations**: Read, write, search
- **Git Operations**: Commit, branch, merge
- **Build Tools**: Compile, package, deploy
- **Test Tools**: Run tests, coverage

### Custom Tools
```typescript
interface Tool {
  name: string;
  description: string;
  parameters: Parameter[];
  execute: (params: any) => Promise<Result>;
}
```

## Orchestration Workflows

### Code Review Workflow
```
1. Developer submits code
2. Auto-assign reviewers
3. Run automated checks
4. Collect feedback
5. Approve or request changes
6. Merge on approval
```

### Deployment Workflow
```
1. Build application
2. Run test suite
3. Security scan
4. Deploy to staging
5. Smoke tests
6. Deploy to production
7. Monitor metrics
```

## Best Practices

### 1. Task Design
- Keep tasks small and focused
- Define clear inputs/outputs
- Specify dependencies explicitly
- Set reasonable timeouts

### 2. Error Handling
- Define retry strategies
- Implement circuit breakers
- Log execution details
- Alert on failures

### 3. Resource Management
- Limit concurrent agents
- Queue long-running tasks
- Monitor resource usage
- Scale based on demand

### 4. Monitoring
- Track task completion rates
- Measure execution times
- Monitor error rates
- Generate reports

## Configuration

### Agent Settings
```json
{
  "agents": {
    "frontend": {
      "model": "opencode/kimi-k2.5-free",
      "skills": ["react", "typescript", "ui-design"]
    },
    "backend": {
      "model": "opencode/glm-4.7-free",
      "skills": ["api-design", "database", "security"]
    }
  }
}
```

## Usage Example
```
// Create task
const task = {
  type: 'implement-feature',
  priority: 1,
  requirements: ['Add login form', 'Validate inputs'],
  assignedAgent: 'frontend'
};

// Submit to MOAI
moai.submitTask(task);

// Monitor progress
moai.on('task-complete', (result) => {
  console.log('Task completed:', result);
});
```
