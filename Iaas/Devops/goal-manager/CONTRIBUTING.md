# Contributing Guidelines

Thank you for interest in contributing to Goal Manager! This document provides guidelines for contributing to the project.

## Code of Conduct

- Respectful communication
- Inclusive environment
- Professional behavior
- No discrimination or harassment

## Getting Started

### 1. Fork the Repository
```bash
# Click "Fork" on GitHub
git clone https://github.com/YOUR_USERNAME/goal-manager.git
cd goal-manager
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-export-functionality`
- `fix/null-pointer-exception`
- `docs/update-deployment-guide`

### 3. Setup Development Environment
```bash
npm install
npm run dev
```

## Development Workflow

### Before Starting
- Check existing issues and PRs
- Create an issue for major changes
- Discuss approach for significant changes

### While Developing
- Write clean, readable code
- Follow project conventions
- Add comments for complex logic
- Keep functions focused and small
- Write descriptive commit messages

### Commit Messages
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic changes)
- `refactor`: Code restructuring
- `test`: Test additions/updates
- `chore`: Build, dependencies, etc.
- `ci`: CI/CD configuration

Example:
```
feat(auth): add remember-me functionality

- Add checkbox to login form
- Extend session duration for checked users
- Store preference in localStorage

Fixes #123
```

## Code Quality

### Linting
```bash
# Check code quality
npm run lint

# Fix issues automatically
npm run lint:fix
```

### Testing
```bash
# Run tests (when configured)
npm run test
```

### Building
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## Pull Request Process

### 1. Ensure Quality
```bash
npm run lint:fix
npm audit fix
npm run build
```

### 2. Push to Fork
```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request
- Use descriptive title
- Link related issues (#123)
- Describe changes clearly
- Include screenshots if UI changes
- Reference any breaking changes

### 4. PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Fixes #123

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Security practices followed
```

## Review Process

### What Reviewers Look For
- ✅ Code quality and style
- ✅ Test coverage
- ✅ Documentation
- ✅ Security practices
- ✅ Performance implications
- ✅ Browser compatibility
- ✅ Accessibility compliance

### Addressing Feedback
- Respond to all comments
- Make requested changes
- Re-request review after updates
- Ask for clarification if needed

## Security Guidelines

### Before Submitting
- [ ] No hardcoded credentials
- [ ] No console.log for sensitive data
- [ ] Input properly validated
- [ ] Output properly escaped
- [ ] Dependencies are secure
- [ ] No XXS vulnerabilities
- [ ] No SQL injection vulnerabilities

### Security Review
- Automated scanning on all PRs
- Manual review for security changes
- Dependency updates checked
- No critical vulnerabilities allowed

## Documentation

### Update Documentation For
- New features
- API changes
- Configuration additions
- Installation updates

### Documentation Files
- `README.md`: Overview and quickstart
- `DEPLOYMENT.md`: Deployment instructions
- `SECURITY.md`: Security practices
- Inline code comments

### Code Comments
```javascript
// Good: Explains WHY, not WHAT
// Cache result to avoid repeated API calls
const cached = useMemo(() => fetchData(), []);

// Avoid: Explains obvious code
// Increment i
i++;
```

## Performance Considerations

- Minimize bundle size
- Optimize component renders
- Avoid unnecessary re-renders
- Lazy load large components
- Profile with React DevTools

## Accessibility Guidelines

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader testing

## Reporting Issues

### Bug Reports Include
- [ ] Description of issue
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Screenshots/videos
- [ ] Environment details
- [ ] Error messages

### Feature Requests Include
- [ ] Clear description
- [ ] Use case/motivation
- [ ] Proposed solution
- [ ] Alternative approaches
- [ ] Additional context

### Bug Report Template
```markdown
## Description
Concise description

## Steps to Reproduce
1. Go to...
2. Click on...
3. Observe...

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Environment
- OS: macOS/Windows/Linux
- Browser: Chrome/Firefox/Safari
- Node: v18.0.0
- npm: v9.0.0

## Screenshots
If applicable
```

## Resources

- **Style Guide**: See `.eslintrc`
- **Git Workflow**: GitHub Flow
- **React Patterns**: React Docs
- **Component Library**: Storybook (if available)

## Running Locally

### Development
```bash
npm run dev
# Open http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker
```bash
docker-compose up -d
# Open http://localhost:8080
```

## Troubleshooting

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# For port 5173 (dev)
npm run dev -- --port 3000

# For port 8080 (docker)
docker run -p 9090:80 goal-manager:latest
```

### Build Fails
```bash
npm run lint:fix
npm install
npm run build
```

## Questions?

- Open a GitHub Discussion
- Check existing issues
- Read documentation
- Ask on PRs

## Thank You! 🎉

Your contributions help make Goal Manager better for everyone.

Happy coding!

---

**See Also**
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
- [License](LICENSE)
