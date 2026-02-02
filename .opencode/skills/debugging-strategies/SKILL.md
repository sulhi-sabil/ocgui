# Debugging Strategies Skill

## Description
Comprehensive debugging strategies and techniques for efficient problem resolution.

## When to Use
- Investigating bugs or errors
- Performance issues
- Unexpected behavior
- Production incidents

## Debugging Mindset

### 1. Scientific Method
```
1. Observe the problem
2. Form a hypothesis
3. Design an experiment
4. Test the hypothesis
5. Analyze results
6. Conclude or iterate
```

### 2. Binary Search
- Divide problem space in half
- Determine which half contains issue
- Repeat until isolated

### 3. Rubber Ducking
- Explain code line by line
- Articulate assumptions
- Often reveals the issue

## Debugging Techniques

### Print/Debug Logging
```typescript
// Strategic logging
console.log('DEBUG: Value at point A:', value);
console.log('DEBUG: State before operation:', state);
console.trace('DEBUG: Call stack');
```

### Breakpoint Strategies
1. **Line breakpoints**: Stop at specific line
2. **Conditional breakpoints**: Stop when condition met
3. **Watch expressions**: Monitor variable changes
4. **Call stack inspection**: Trace execution flow

### Binary Debugging
```
Working?    Problem?
    │           │
    ▼           ▼
  Good        Bad
    │           │
    └─── Midpoint ───┘
         Check here
```

### Divide and Conquer
- Comment out half the code
- Determine if issue persists
- Narrow down to specific function/line

## Common Bug Patterns

### 1. Off-by-One Errors
```typescript
// Wrong
for (let i = 0; i <= array.length; i++)

// Right
for (let i = 0; i < array.length; i++)
```

### 2. Null/Undefined Checks
```typescript
// Defensive programming
if (!value || value === null || value === undefined) {
  return defaultValue;
}
```

### 3. Async Issues
- Race conditions
- Unhandled promises
- Missing await
- Callback hell

### 4. Type Mismatches
- Implicit conversions
- Dynamic type issues
- API contract violations

## Debugging Workflow

### Step 1: Reproduce
- Get consistent reproduction
- Document exact steps
- Note environment details
- Create minimal test case

### Step 2: Isolate
- Narrow scope
- Identify component
- Check recent changes
- Use version control bisect

### Step 3: Analyze
- Read error messages carefully
- Check logs and traces
- Review documentation
- Search for similar issues

### Step 4: Fix
- Address root cause
- Write minimal fix
- Test thoroughly
- Document solution

### Step 5: Prevent
- Add regression tests
- Update documentation
- Improve error messages
- Share knowledge

## Tools

### Static Analysis
- Type checkers (TypeScript)
- Linters (ESLint)
- Formatters (Prettier)
- Security scanners

### Runtime Tools
- Debuggers (Chrome DevTools, VS Code)
- Profilers
- Memory analyzers
- Network inspectors

## Performance Debugging

### Identify Bottlenecks
1. Measure baseline
2. Profile execution
3. Identify hotspots
4. Optimize critical paths

### Memory Debugging
- Check for leaks
- Monitor heap usage
- Analyze garbage collection
- Review object retention

## Tips
- Take breaks when stuck
- Change perspective
- Ask for help
- Document learnings
- Stay calm and systematic
