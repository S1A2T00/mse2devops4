# CI/CD Configuration Guide

This guide explains the complete CI/CD pipeline setup for Goal Manager.

## Pipeline Overview

```
Pull Request
    ↓
├─ Linting & Code Quality
├─ Build & Test
├─ Security Scanning
└─ Approval Required
    ↓
Main Branch Push
    ↓
├─ CI Pipeline (all checks)
├─ Docker Build & Push
├─ Deploy to Staging (optional)
└─ Production Deployment (manual trigger)
```

## GitHub Actions Workflows

### 1. Continuous Integration (`.github/workflows/ci.yml`)

**Triggers**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs**
- Build on Node 18 and 20
- Run ESLint
- npm audit
- Build project
- Upload artifacts
- SonarQube analysis

**Configuration**
```yaml
matrix:
  node-version: [18.x, 20.x]
```

### 2. Docker Build (`.github/workflows/docker-build.yml`)

**Triggers**
- Push to `main`
- Tagged releases (v*)
- Manual workflow dispatch

**Output**
- Docker image: `ghcr.io/YOUR_ORG/goal-manager:latest`
- Tags: Branch name, version, commit SHA

**Features**
- Multi-stage build
- Layer caching
- Automatic cleanup

### 3. Deployment (`.github/workflows/deploy.yml`)

**Triggers**
- Main branch push (auto-deploy)
- Manual workflow dispatch

**Process**
1. SSH to deployment server
2. Pull latest Docker image
3. Update docker-compose
4. Clean up old images
5. Restart services

**Requirements**
- SSH credentials preconfigured
- Deployment server access
- Docker installed on server

### 4. Security Scanning (`.github/workflows/security-scan.yml`)

**Triggers**
- Weekly schedule (Sunday 2 AM UTC)
- Push to main/develop
- Pull requests

**Scans**
1. npm audit
2. Snyk scanning
3. Dependency Check
4. SARIF report upload

## GitHub Secrets Setup

### Required Secrets

#### For SonarQube (Optional)
```
SONAR_TOKEN        # SonarQube authentication token
SONAR_HOST_URL     # SonarQube server URL (e.g., https://sonarqube.example.com)
```

#### For Security Scanning
```
SNYK_TOKEN         # Snyk.io API token (optional)
```

#### For Deployment
```
DEPLOY_KEY         # SSH private key (ED25519 or RSA)
DEPLOY_HOST        # Deployment server IP/hostname
DEPLOY_USER        # SSH username
DEPLOY_PORT        # SSH port (default: 22) - optional
```

### Setup Steps

1. **Go to Repository Settings**
   - GitHub.com → Your Repo → Settings

2. **Navigate to Secrets and Variables**
   - Settings → Secrets and variables → Actions

3. **Add New Secrets**
   ```bash
   # Example: Adding SSH key
   cat ~/.ssh/deploy_key | github-cli secret add DEPLOY_KEY
   ```

4. **Verify Secrets Added**
   - All secrets should appear (values hidden)
   - Redacted with asterisks

## Setting Up Deployment

### 1. Generate SSH Key Pair

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -f deploy_key -C "goal-manager-deploy" -N ""

# View public key
cat deploy_key.pub
```

### 2. Configure Deployment Server

```bash
# On deployment server
mkdir -p ~/.ssh
cat deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Create deployment directory
sudo mkdir -p /opt/goal-manager
sudo chown $USER:$USER /opt/goal-manager

# Clone repository
cd /opt/goal-manager
git clone https://github.com/YOUR_ORG/goal-manager.git
```

### 3. Add SSH Key to GitHub

```bash
# Copy private key content
cat deploy_key

# Add to GitHub Secrets as DEPLOY_KEY
```

### 4. Configure Docker Credentials

If pushing to private registry:
```bash
# On deployment server
docker login ghcr.io
```

## Environment Variables

### For CI/CD Pipeline

```bash
# .github/workflows/ci.yml
NODE_VERSION: '18'

# In build step
NODE_ENV: production
```

### For Deployment

```bash
# Set in docker-compose.yml or .env file
PORT=8080
NODE_ENV=production
VITE_API_URL=https://api.example.com
```

## Branch Protection Rules

### Recommended Settings

1. **Require status checks to pass**
   - ✅ build (Node 18.x)
   - ✅ build (Node 20.x)
   - ✅ code-quality
   - ✅ Security scanning

2. **Require branches to be up to date**
   - Enabled

3. **Require code reviews**
   - Min 1 approval required

4. **Dismiss stale PR reviews**
   - Enabled

5. **Require CODEOWNERS review**
   - Optional but recommended

### Setup Steps
```
Settings → Branches → Add rule
Branch name: main
Enable protections as above
```

## Workflow Monitoring

### GitHub Actions Dashboard

1. **View Workflow Status**
   - Actions tab → Select workflow
   - See all runs with status badges

2. **Check Run Details**
   - Click on run
   - Expand jobs to see logs
   - Download artifacts

3. **Enable Notifications**
   - Settings → Notifications
   - Get alerts for workflow failures

### Troubleshooting Failures

**Build Failures**
```bash
# Local reproduction
npm install
npm run lint
npm run build
```

**Deployment Issues**
```bash
# SSH connection test
ssh -i deploy_key user@host

# Check Docker on server
docker ps
docker-compose logs
```

**Secret Issues**
```bash
# Verify secret exists
# Go to Settings → Secrets
# Ensure proper naming (uppercase with underscores)
```

## Performance Optimization

### Cache Strategy

```yaml
# Cache npm dependencies
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### Parallel Jobs

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

### Artifact Retention

```yaml
retention-days: 5  # Keep build artifacts 5 days
```

## Cost Management

GitHub Actions provides free minutes for public repos. To optimize:

1. **Limit workflow triggers**
   - Run on main branch only where possible
   - Skip for documentation-only changes

2. **Optimize matrix**
   - Test only critical Node versions
   - Remove unnecessary parallel jobs

3. **Use selective deployments**
   - Manual approval for production
   - Deploy only on tagged releases

## Securing Secrets

### Best Practices

1. **Never log secrets**
   ```bash
   # Bad
   echo "TOKEN=$DEPLOY_KEY"
   
   # Good
   echo "Deploying..."
   ```

2. **Rotate regularly**
   - SSH keys: Quarterly
   - API tokens: Annually

3. **Scope permissions**
   - SSH key for deployment only
   - Tokens with minimal required permissions

4. **Audit access**
   - View secret access logs
   - Review who can access secrets

## Troubleshooting

### Workflows Not Triggering

**Check**
1. Branch exists and has push access
2. Workflow file syntax is valid
3. Event trigger conditions met
4. Repository not archived

**Fix**
```bash
# Validate YAML syntax
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/ci.yml')))"
```

### Deployment Failures

**Common Issues**
- SSH key invalid
- Host not accessible
- Wrong port number
- Permission denied

**Debug**
```bash
# Test SSH locally
ssh -vvv -i deploy_key user@host

# Check server logs
ssh user@host 'docker-compose logs -f'
```

### Secrets Not Loading

1. **Check secret name**
   - Must match exactly
   - UPPERCASE_WITH_UNDERSCORES

2. **Verify permissions**
   - User has admin access to repo
   - Not in private fork

3. **Clear cache**
   - GitHub caches workflow runs
   - Wait ~5 minutes for changes

## Advanced Topics

### Custom Actions

Create `.github/actions/deploy/action.yml`:
```yaml
name: Custom Deploy Action
inputs:
  host:
    required: true
```

### Matrix Strategy

```yaml
strategy:
  matrix:
    node: [18, 20]
    os: [ubuntu-latest, windows-latest]
```

### Conditional Steps

```yaml
- if: github.event_name == 'push'
  run: npm run deploy
```

## Support & Resources

- **GitHub Actions Docs**: https://docs.github.com/actions
- **Workflow Syntax**: https://docs.github.com/actions/reference/workflow-syntax-for-github-actions
- **Examples**: https://github.com/actions/starter-workflows

---

**See Also**
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [SECURITY.md](SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)
