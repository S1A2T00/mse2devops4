# Goal Manager

A modern task/goal management application built with React and Vite, featuring a robust CI/CD pipeline and security-focused architecture.

## Overview

Goal Manager is a web-based application designed to help users manage their goals and tasks efficiently. The application is built with:

- **Frontend**: React 19+ with Vite for fast development and optimized builds
- **Architecture**: Component-based with custom hooks for state management
- **DevOps**: Full CI/CD pipeline with GitHub Actions, Docker, and security scanning
- **Security**: Industry-standard security practices implemented throughout

## Table of Contents

- [Features](#features)
- [Security Updates](#security-updates)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building](#building)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [Security](#security)

## Features

✅ User authentication and session management  
✅ Goal creation and tracking  
✅ Task management and action feeds  
✅ Responsive UI design  
✅ Real-time data synchronization  
✅ Secure password handling  
✅ Session tracking and analytics  

## Security Updates

### Bugs Fixed

All security vulnerabilities and code quality issues have been resolved:

#### React Components (VulnerableComponents.jsx)
- ✅ Added `key` prop to list rendering
- ✅ Fixed useEffect dependency arrays
- ✅ Eliminated state mutations
- ✅ Added proper null/undefined checks
- ✅ Moved hardcoded credentials to environment variables
- ✅ Removed sensitive console.log statements
- ✅ Reduced function complexity

#### Security Vulnerabilities (moreVulnerabilities.js)
- ✅ Replaced weak `Math.random()` with cryptographically secure generation
- ✅ Fixed inadequate MD5 hashing with proper alternatives
- ✅ Prevented unsafe global state mutations
- ✅ Added proper resource cleanup in async operations
- ✅ Removed command execution vulnerabilities
- ✅ Added path validation to prevent traversal attacks
- ✅ Replaced insecure deserialization with safe JSON parsing

#### Additional Improvements
- ✅ Added DOMPurify for XSS prevention
- ✅ Implemented input sanitization
- ✅ Added error handling throughout
- ✅ Improved error boundaries

## Quick Start

### Prerequisites

- Node.js 18+ or Docker
- npm 9+ or yarn
- Git

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd goal-manager

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

Access the application at `http://localhost:5173`

### Docker Setup

```bash
# Build image
docker build -t goal-manager:latest .

# Run container
docker run -p 8080:80 goal-manager:latest

# Or use Docker Compose
docker-compose up -d
```

## Project Structure

```
goal-manager/
├── src/
│   ├── api/              # API integration modules
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # CSS stylesheets
│   ├── utils/            # Utility functions
│   └── main.jsx          # Application entry point
├── public/               # Static assets
├── .github/workflows/    # CI/CD pipeline definitions
├── Dockerfile            # Docker image configuration
├── docker-compose.yml    # Docker compose configuration
└── nginx.conf            # Nginx web server config
```

## Development

### Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Security audit
npm run security-audit

# Run tests (when configured)
npm run test
```

### Code Standards

- ESLint configuration for React best practices
- React Hooks and Functional Components
- Modern JavaScript (ES6+)
- Component-driven development

## Building

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Build output is generated in the `dist/` directory.

### Docker Build
```bash
docker build -t goal-manager:v1.0.0 .
```

## CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline with GitHub Actions:

### Workflows

#### 1. **Continuous Integration** (`.github/workflows/ci.yml`)
- Runs on: Push to main/develop, Pull Requests
- Tasks:
  - Installs dependencies
  - Runs ESLint
  - Performs npm audit
  - Builds application
  - SonarQube code analysis

#### 2. **Docker Build & Push** (`.github/workflows/docker-build.yml`)
- Runs on: Push to main, Tags
- Tasks:
  - Builds Docker image
  - Pushes to GitHub Container Registry
  - Caches layers for faster builds

#### 3. **Security Scan** (`.github/workflows/security-scan.yml`)
- Runs on: Weekly schedule, Push to main/develop
- Tasks:
  - npm audit
  - Snyk security scanning
  - Dependency vulnerability checks
  - SARIF report upload

#### 4. **Deployment** (`.github/workflows/deploy.yml`)
- Runs on: Push to main
- Tasks:
  - Pulls Docker image
  - Updates containers via SSH
  - Docker Compose deployment

### Setup GitHub Actions

1. Set the following secrets in GitHub:
   - `SONAR_TOKEN`: SonarQube authentication token
   - `SONAR_HOST_URL`: SonarQube server URL
   - `SNYK_TOKEN`: Snyk security token (optional)
   - `DEPLOY_KEY`: SSH private key
   - `DEPLOY_HOST`: Deployment server IP/hostname
   - `DEPLOY_USER`: SSH username

2. Workflows will automatically trigger on configured events

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- Local development setup
- Docker deployment
- Docker Compose orchestration
- CI/CD integration
- Production checklist
- Monitoring and logging
- Security best practices

## Security

### Implementation

- ✅ Non-root Docker container execution
- ✅ Read-only filesystem where possible
- ✅ Input sanitization with DOMPurify
- ✅ Secure random token generation
- ✅ Environment variable management
- ✅ No hardcoded credentials
- ✅ Security headers via Nginx
- ✅ Container resource limits
- ✅ Health checks
- ✅ Comprehensive logging

### Dependencies

- Regularly updated React ecosystem
- Security audit via npm
- Snyk security scanning
- GitHub's dependency scanning

### Reporting Security Issues

Please do not open GitHub issues for security vulnerabilities. Instead, use GitHub's private vulnerability reporting.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Submit a pull request
5. CI/CD pipeline will run automatically

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, documentation, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review deployment guide

---

**Last Updated**: April 2026  
**Status**: ✅ All bugs fixed, CI/CD pipeline active
