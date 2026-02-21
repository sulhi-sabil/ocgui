# Security Policy

## Supported Versions

The following versions of ocgui are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not** open a public issue for security vulnerabilities
2. Report vulnerabilities through GitHub's private vulnerability reporting:
   - Go to the [Security tab](https://github.com/sulhi-sabil/ocgui/security)
   - Click "Report a vulnerability"
   - Fill in the details of the vulnerability

### What to Include

Please include the following information in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)
- Your contact information for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours
- **Triage & Assessment**: Within 7 days
- **Fix Development**: Depends on severity and complexity
- **Disclosure**: After fix is released and users have time to update

## Security Best Practices

When using ocgui:

1. **Keep Updated**: Always use the latest version
2. **API Keys**: Never commit API keys or secrets to the repository
3. **OpenCode CLI**: Keep your OpenCode CLI installation updated
4. **Permissions**: Review and limit tool permissions in opencode.json
5. **Configuration**: Don't share your opencode.json if it contains sensitive paths

## Scope

### In Scope
- Vulnerabilities in ocgui application code
- Security issues in Tauri desktop integration
- Vulnerabilities in npm dependencies
- Authentication/authorization issues

### Out of Scope
- Vulnerabilities in third-party dependencies (report to maintainers)
- Issues in OpenCode CLI (report to OpenCode team)
- Social engineering attacks
- Physical security attacks

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help keep ocgui secure (with your permission).
