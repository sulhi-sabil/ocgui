---
name: context-engineering-memory
description: Advanced techniques for context management and memory systems in AI agents
license: MIT
compatibility: opencode
---

# Context Engineering & Memory Systems Skill

## When to Use
- Managing large codebases
- Long-running conversations
- Complex multi-step tasks
- Maintaining context across sessions

## Context Engineering Principles

### 1. Context Window Management
- **Prioritize** most relevant information
- **Summarize** older context when approaching limits
- **Compress** verbose content while preserving meaning
- **Chunk** large documents into manageable pieces

### 2. Hierarchical Memory
```
Memory Levels:
├── Working Memory (immediate context)
├── Short-term Memory (current session)
├── Long-term Memory (persistent storage)
└── External Memory (files, databases)
```

### 3. Context Injection
- Inject relevant documentation at start
- Add code examples for patterns
- Include configuration details
- Reference related files

## Memory System Architecture

### Episodic Memory
- Store conversation history
- Track decisions and rationale
- Remember user preferences
- Log action outcomes

### Semantic Memory
- Code patterns and templates
- Best practices knowledge
- Domain-specific rules
- Project conventions

### Procedural Memory
- Common workflows
- Tool usage patterns
- Debugging procedures
- Refactoring strategies

## Implementation Techniques

### Context Summarization
```
When context grows large:
1. Identify key points
2. Remove redundant information
3. Consolidate related items
4. Maintain references to details
```

### Selective Loading
- Load only necessary files
- Lazy load large resources
- Use summaries for overview
- Fetch details on demand

### State Management
```typescript
interface AgentState {
  workingMemory: {
    currentTask: string;
    recentActions: Action[];
    openFiles: string[];
  };
  shortTermMemory: {
    sessionHistory: Message[];
    decisions: Decision[];
    contextSummaries: Summary[];
  };
  longTermMemory: {
    projectKnowledge: KnowledgeBase;
    userPreferences: Preferences;
    learnedPatterns: Pattern[];
  };
}
```

## Best Practices

### 1. Context Efficiency
- Start with high-level overview
- Drill down as needed
- Remove irrelevant details
- Use concise representations

### 2. Memory Persistence
- Save key learnings
- Store user preferences
- Cache expensive computations
- Version control memory files

### 3. Context Switching
- Clear context between tasks
- Save state before switching
- Restore relevant context
- Minimize cross-contamination

### 4. Retrieval Augmentation
- Index important documents
- Use semantic search
- Retrieve relevant snippets
- Combine with generation

## Tools & Patterns

### Context Files
```
docs/
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── conventions.md
│   └── decisions.md
```

### Memory Files
```
.opencode/
├── memory/
│   ├── episodic/
│   ├── semantic/
│   └── procedural/
```

## Success Metrics
- Context utilization efficiency
- Information retrieval accuracy
- Task completion with context
- User satisfaction with continuity
