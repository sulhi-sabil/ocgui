---
name: opencode-primitives
description: Reference OpenCode docs when implementing skills, plugins, MCPs, or config-driven behavior
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: opencode-development
---

# OpenCode Primitives Skill

## When to Use
- Implementing OpenCode skills
- Creating OpenCode plugins
- Configuring MCP servers
- Writing opencode.json config
- Building custom tools

## Official Documentation Sources

Always cite these when implementing OpenCode features:
- Skills: https://opencode.ai/docs/skills
- Plugins: https://opencode.ai/docs/plugins
- MCP Servers: https://opencode.ai/docs/mcp-servers
- Config: https://opencode.ai/docs/config
- Tools: https://opencode.ai/docs/tools
- Agents: https://opencode.ai/docs/agents
- Models: https://opencode.ai/docs/models

## Skills

### File Location
```
.opencode/skills/<name>/SKILL.md
~/.config/opencode/skills/<name>/SKILL.md
```

### Frontmatter Requirements
```yaml
---
name: skill-name           # Required, 1-64 chars, lowercase with hyphens
description: Description   # Required, 1-1024 chars
license: MIT               # Optional
compatibility: opencode    # Optional
metadata:                  # Optional, string-to-string map
  audience: developers
  workflow: automation
---
```

### Name Validation
- 1-64 characters
- Lowercase alphanumeric with single hyphen separators
- Cannot start or end with hyphen
- No consecutive hyphens
- Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`

### Skill Example
```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do
- Draft release notes from merged PRs
- Propose version bump
- Provide gh release create command

## When to use me
Use when preparing a tagged release.
```

## Plugins

### Plugin Structure
```typescript
// .opencode/plugins/my-plugin/index.ts
import type { Plugin } from '@opencode/sdk'

export default {
  name: 'my-plugin',
  version: '1.0.0',
  
  // Event hooks
  onCommand: async (event) => { },
  onFile: async (event) => { },
  onMessage: async (event) => { },
  onPermission: async (event) => { },
  onSession: async (event) => { },
  onTool: async (event) => { },
  onTui: async (event) => { },
} satisfies Plugin
```

### Registering Plugins
```json
// opencode.json
{
  "plugin": [
    "my-plugin",
    "another-plugin@latest"
  ]
}
```

## MCP Servers

### Configuration
```json
// opencode.json
{
  "mcp": {
    "servers": {
      "my-server": {
        "command": "node",
        "args": ["./mcp-server.js"],
        "env": {
          "API_KEY": "..."
        }
      }
    }
  }
}
```

### Available MCP Types
- stdio: Local process communication
- sse: Server-Sent Events
- websocket: WebSocket connection

## Configuration

### Config Locations (in precedence order)
1. `.opencode/config.json` (project)
2. `~/.config/opencode/config.json` (global)
3. Environment variables

### Key Config Fields
```json
{
  "model": "opencode/claude-opus-4-5",
  "agent": {
    "default": "general",
    "plan": {
      "model": "opencode/gpt-5-nano"
    }
  },
  "permission": {
    "tool": {
      "bash": "ask",
      "write": "allow"
    },
    "skill": {
      "*": "allow",
      "internal-*": "deny"
    }
  },
  "plugin": ["plugin-name"],
  "mcp": {
    "servers": {}
  }
}
```

## Agents

### Agent Definition
```json
// .opencode/agents/my-agent/agent.json
{
  "name": "my-agent",
  "model": "opencode/glm-5-free",
  "temperature": 0.7,
  "tools": {
    "bash": false,
    "write": true
  },
  "permissions": {
    "read": true,
    "write": true
  }
}
```

### Agent Frontmatter (in prompt.md)
```yaml
---
model: opencode/glm-5-free
temperature: 0.7
tools:
  skill: true
  websearch: true
permission:
  tool:
    bash: ask
---
```

## Tools

### Custom Tool Definition
```typescript
// .opencode/tools/my-tool.ts
import { defineTool } from '@opencode/sdk'

export default defineTool({
  name: 'my_tool',
  description: 'Does something useful',
  parameters: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'Input value' }
    },
    required: ['input']
  },
  execute: async (params) => {
    return { result: `Processed: ${params.input}` }
  }
})
```

### Registering Tools
```json
// opencode.json
{
  "tools": {
    "custom": ["./tools/my-tool.ts"]
  }
}
```

## Permissions

### Permission Levels
- `allow`: Action permitted without asking
- `deny`: Action blocked
- `ask`: User prompted for approval

### Permission Configuration
```json
{
  "permission": {
    "tool": {
      "bash": "ask",
      "write": "allow",
      "webfetch": "allow"
    },
    "skill": {
      "*": "allow",
      "dangerous-*": "deny"
    },
    "mcp": {
      "filesystem": "ask"
    }
  }
}
```

## Free Models (OpenCode Zen)

Available free models via `opencode/` prefix:
- `opencode/glm-5-free` - General purpose
- `opencode/kimi-k2.5-free` - Good for coding
- `opencode/minimax-m2.1-free` - Alternative
- `opencode/gpt-5-nano` - Fast, lightweight
- `opencode/big-pickle` - Knowledge retrieval

## Best Practices
1. Always validate skill names match directory names
2. Use proper frontmatter in all SKILL.md files
3. Configure permissions at the right granularity
4. Test plugins with different agent configurations
5. Document MCP server requirements
6. Use semantic versioning for plugins
