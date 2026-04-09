# Deployment Guide

## Prerequisites

- Node.js 18+ or Docker
- Git
- GitHub account (for CI/CD)
- npm or yarn

## Local Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd goal-manager

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t goal-manager:latest .
```

### Run with Docker

```bash
docker run -p 8080:80 goal-manager:latest
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f goal-manager
```

## CI/CD Pipeline Setup

### GitHub Actions Configuration

1. **Fork/Clone the repository** to your GitHub account

2. **Set Required Secrets** in GitHub Settings → Secrets and variables → Actions:
   - `SONAR_TOKEN`: SonarQube token (if using SonarQube)
   - `SONAR_HOST_URL`: SonarQube server URL
   - `SNYK_TOKEN`: Snyk security token (optional)
   - `DEPLOY_KEY`: SSH private key for deployment server
   - `DEPLOY_HOST`: Deployment server hostname/IP
   - `DEPLOY_USER`: Deployment server user

3. **Workflows Included**:
   - **ci.yml**: Runs on every push/PR - builds, tests, lints, audits
   - **docker-build.yml**: Builds and pushes Docker image on main branch push
   - **deploy.yml**: Deploys to production on main branch push
   - **security-scan.yml**: Weekly security scanning and dependency checks

### Manual Deployment

1. **SSH into deployment server**:
   ```bash
   ssh user@deploy-server
   ```

2. **Pull latest code**:
   ```bash
   cd /opt/goal-manager
   git pull origin main
   ```

3. **Update and restart**:
   ```bash
   docker-compose pull
   docker-compose up -d
   docker image prune -f
   ```

## Production Checklist

- [ ] All security vulnerabilities fixed
- [ ] Environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] Database backups configured (if applicable)
- [ ] Monitoring and alerting setup
- [ ] Log aggregation configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers added

## Monitoring

### Health Check
```bash
curl http://localhost:8080/health
```

### Logs
```bash
# Docker logs
docker logs -f goal-manager

# Docker Compose logs
docker-compose logs -f goal-manager

# View logs for specific service
docker service logs goal-manager
```

## Rollback Procedure

```bash
# List available images
docker images goal-manager

# Run previous version
docker run -p 8080:80 goal-manager:<previous-tag>

# Or with Docker Compose
docker-compose down
git checkout <previous-commit>
docker-compose up -d
```

## Security Best Practices

1. **Never commit sensitive data** - Use `.env.local` (in .gitignore)
2. **Keep dependencies updated**:
   ```bash
   npm update
   npm audit fix
   ```
3. **Regular security scans**:
   ```bash
   npm audit
   npm run lint
   ```
4. **Use HTTPS** in production
5. **Enable security headers** via nginx configuration
6. **Run container as non-root** (already configured)
7. **Use read-only filesystem** where possible (configured in docker-compose.yml)

## Troubleshooting

### Container won't start
```bash
docker-compose logs goal-manager
```

### Port already in use
```bash
# Change port in docker-compose.yml or use:
docker-compose up -p 9090:80
```

### Build fails
```bash
# Clear cache and rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
```

## Support

For issues or questions, please open a GitHub issue or contact the development team.
