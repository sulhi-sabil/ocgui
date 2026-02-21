---
name: cli-development
description: Best practices for building command-line interface tools and applications
license: MIT
compatibility: opencode
metadata:
  category: developer-tools
  audience: backend-developers
---

# CLI Development Skill

## When to Use
- Building command-line tools
- Creating developer utilities
- Implementing CLI interfaces
- Designing terminal user experiences

## CLI Design Principles

### 1. Command Structure
```
mycli <command> [options] [arguments]

Commands:
  init        Initialize a new project
  build       Build the project
  test        Run tests
  deploy      Deploy to production

Options:
  -h, --help     Show help
  -v, --version  Show version
  --verbose      Enable verbose output
```

### 2. Argument Parsing
```typescript
import { program } from 'commander';

program
  .name('mycli')
  .description('My CLI tool')
  .version('1.0.0');

program
  .command('build')
  .description('Build the project')
  .option('-w, --watch', 'Watch for changes')
  .option('-m, --minify', 'Minify output')
  .action(async (options) => {
    await build(options);
  });

program.parse();
```

## Output Patterns

### Progress Indicators
```typescript
import ora from 'ora';

const spinner = ora('Processing...').start();
try {
  await doWork();
  spinner.succeed('Done!');
} catch (error) {
  spinner.fail('Failed');
}
```

### Interactive Prompts
```typescript
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'template',
    message: 'Choose a template:',
    choices: ['react', 'vue', 'svelte']
  },
  {
    type: 'confirm',
    name: 'typescript',
    message: 'Use TypeScript?',
    default: true
  }
]);
```

### Colored Output
```typescript
import chalk from 'chalk';

console.log(chalk.green('Success!'), 'Operation completed');
console.log(chalk.red('Error:'), 'Something went wrong');
console.log(chalk.yellow('Warning:'), 'Check your configuration');
```

## Configuration Management

### Config File Pattern
```typescript
import { cosmiconfigSync } from 'cosmiconfig';

const explorer = cosmiconfigSync('mycli');
const result = explorer.search();

const config = {
  // Defaults
  output: 'dist',
  minify: false,
  ...result?.config, // User config overrides
};
```

### Config Locations
```
.myclirc
.myclirc.json
.myclirc.yaml
.myclirc.js
mycli.config.js
package.json (mycli key)
```

## Error Handling

### User-Friendly Errors
```typescript
class CLIError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'CLIError';
  }
}

function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.error(chalk.red(`Error [${error.code}]:`), error.message);
    process.exit(1);
  }
  throw error;
}
```

## Distribution

### Package.json Setup
```json
{
  "name": "mycli",
  "bin": {
    "mycli": "./dist/cli.js"
  },
  "files": ["dist"],
  "engines": {
    "node": ">=18"
  }
}
```

### Shebang for Node CLIs
```typescript
#!/usr/bin/env node
import { program } from 'commander';
// ... CLI implementation
```

## Best Practices
- Provide helpful error messages with suggestions
- Support both interactive and non-interactive modes
- Respect NO_COLOR environment variable
- Follow POSIX conventions for flags
- Include shell completion support
- Test with different terminal emulators
