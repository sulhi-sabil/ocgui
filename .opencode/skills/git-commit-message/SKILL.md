# Git Commit Message Skill

## Description
Generate high-quality, conventional commit messages that follow best practices.

## When to Use
- Before committing changes
- Writing commit messages for PRs
- Rebasing or squash merging

## Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, etc.
- **ci**: CI/CD changes
- **revert**: Reverting changes

### Guidelines

#### Subject Line
- Use imperative mood ("Add feature" not "Added feature")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters
- Be specific and descriptive

#### Body
- Separate from subject with blank line
- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Use bullet points for multiple changes

#### Footer
- Reference issues: `Fixes #123`, `Closes #456`
- Breaking changes: `BREAKING CHANGE: description`
- Co-authors: `Co-authored-by: Name <email>`

## Examples

### Good Examples
```
feat(auth): add OAuth2 login support

Implement OAuth2 authentication flow with Google and GitHub
providers. Includes token refresh mechanism and user profile
caching for improved performance.

Fixes #234
```

```
fix(api): resolve null pointer in user validation

Add null check for email field before validation. This prevents
500 errors when users submit incomplete registration forms.

Closes #567
```

```
refactor(db): optimize user query with index

Add composite index on (created_at, status) to improve query
performance for user listing endpoint. Reduces query time
from 450ms to 15ms.
```

### Bad Examples
```
fixed bug                    // Too vague
```

```
Updated files.              // Not descriptive
```

```
FEAT: Added NEW feature!!!  // Wrong format, caps, punctuation
```

## Process
1. Analyze what changed (git diff)
2. Determine the type of change
3. Identify scope (optional but helpful)
4. Write descriptive subject
5. Add body if complex change
6. Reference related issues

## Tips
- Commit often with small, focused changes
- One logical change per commit
- Write commit message before coding to clarify intent
- Review commits before pushing
