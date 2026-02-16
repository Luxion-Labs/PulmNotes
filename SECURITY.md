# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Pulm Notes seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please Do

**Report security vulnerabilities via email to:** report@luxionlabs.com

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, SQL injection, data exposure, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### What to Expect

- **Acknowledgment:** We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication:** We will keep you informed about the progress of fixing the vulnerability
- **Timeline:** We aim to address critical vulnerabilities within 7 days and other vulnerabilities within 30 days
- **Credit:** We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Considerations for Pulm Notes

### Local-First Architecture

Pulm Notes is designed as a local-first application where all data stays on your device:

- **No cloud storage:** Your notes are stored locally and never transmitted to external servers
- **No authentication:** There are no user accounts or authentication systems
- **No tracking:** We do not collect analytics or telemetry data

### Desktop App Security

The desktop application is built with Tauri, which provides:

- **Sandboxed environment:** Limited system access through capability-based security
- **CSP enforcement:** Content Security Policy to prevent XSS attacks
- **IPC security:** Secure inter-process communication between frontend and backend

### Web App Security

When running as a web application:

- **Browser storage:** Data is stored in browser's localStorage/IndexedDB
- **Static export:** No server-side code execution
- **Client-side only:** All processing happens in the browser

## Security Best Practices for Users

1. **Keep software updated:** Always use the latest version of Pulm Notes
2. **Backup your data:** Regularly backup your notes directory
3. **Secure your device:** Use device encryption and strong passwords
4. **Be cautious with extensions:** Only install trusted browser extensions
5. **Verify downloads:** Download Pulm Notes only from official sources

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible
5. Publish a security advisory on GitHub

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.
