# Systematic Debugging Skill

## Description
A systematic approach to debugging that uses a 4-phase root cause analysis process.

## When to Use
- When encountering bugs or unexpected behavior
- When code is not working as expected
- When investigating production issues

## 4-Phase Debugging Process

### Phase 1: Reproduction
1. **Confirm the bug exists**
   - Get exact error message or unexpected output
   - Identify the minimal steps to reproduce
   - Create a test case that fails

2. **Document the environment**
   - Operating system and version
   - Runtime environment (Node.js, Python, etc.)
   - Dependencies and versions
   - Configuration settings

### Phase 2: Isolation
1. **Narrow down the scope**
   - Identify which component/module is involved
   - Determine if it's a code, configuration, or environment issue
   - Use binary search approach to isolate the problem

2. **Create minimal reproduction**
   - Remove unnecessary code
   - Strip down to the essentials
   - Confirm the bug still occurs in minimal state

### Phase 3: Investigation
1. **Analyze the code**
   - Trace execution flow
   - Check inputs and outputs at each step
   - Look for logical errors, edge cases, or assumptions

2. **Use debugging tools**
   - Add logging/tracing
   - Use breakpoints and step-through debugging
   - Check stack traces and error messages

3. **Root cause identification**
   - Find the exact line or logic causing the issue
   - Understand WHY it fails
   - Identify any related issues that might occur

### Phase 4: Resolution
1. **Fix the root cause**
   - Address the underlying issue, not just symptoms
   - Write minimal fix needed
   - Ensure fix doesn't break other functionality

2. **Verification**
   - Test the fix with reproduction case
   - Run full test suite
   - Check for regressions

3. **Prevention**
   - Add tests to prevent regression
   - Update documentation if needed
   - Consider if pattern exists elsewhere

## Techniques

### Root Cause Tracing
- Ask "Why?" five times
- Trace data flow from input to output
- Check assumptions about data types, formats, and values

### Defense in Depth
- Validate inputs at boundaries
- Add assertions for assumptions
- Handle edge cases explicitly

### Condition-Based Waiting
- Don't guess at timing issues
- Use proper synchronization primitives
- Add explicit waits for async operations

## Success Criteria
- Bug is reproducible with minimal test case
- Root cause is identified, not just symptoms
- Fix is minimal and targeted
- Tests pass and no regressions introduced
- Documentation updated if needed
