# Quick Start Guide

> Get your AI-driven SDLC platform up and running in under 30 minutes

## 🎯 What You'll Build

By the end of this guide, you'll have:
- A working PRD generation interface with AI assistance
- Basic NFR analysis capabilities
- User story generation from your requirements
- A complete development workflow integration

## 📋 Prerequisites

### Required Tools
- **Node.js 18+** and npm/yarn
- **Docker** and Docker Compose
- **Git** for version control
- **AI API Access** (OpenAI or Anthropic Claude)

### Recommended Tools
- **VS Code** with extensions for React/TypeScript
- **Postman** for API testing
- **pgAdmin** for database management

## 🚀 Step 1: Environment Setup

### Clone and Initialize
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-sdlc-platform.git
cd ai-sdlc-platform

# Install dependencies
npm run install:all

# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Configure Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_sdlc_dev
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ENCRYPTION_KEY=your-32-char-encryption-key-here

# Application
PORT=3001
NODE_ENV=development
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_AI_PROVIDER=openai
```

## 🐳 Step 2: Quick Start with Docker

### Option A: Full Docker Setup (Recommended for beginners)
```bash
# Start all services with Docker Compose
docker-compose up -d

# Initialize database
npm run db:setup
```

### Option B: Local Development Setup
```bash
# Start database and Redis
docker-compose up -d postgres redis

# Start backend
cd backend && npm run dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

## 🎨 Step 3: First PRD Creation

### Access the Platform
1. Open your browser to `http://localhost:3000`
2. Create your first account (or use demo credentials)
3. Navigate to "New Project" → "Create PRD"

### Create Your First PRD
```bash
# Using the API directly
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First AI Project",
    "type": "web_app",
    "industry": "saas"
  }'
```

### AI-Assisted PRD Generation
1. **Project Setup**: Choose "SaaS Web Application"
2. **AI Interview**: Answer 5-7 questions about your product
3. **Template Selection**: Pick the recommended template
4. **Content Generation**: Watch AI create your PRD sections
5. **Collaborative Editing**: Refine with team members

## 🔧 Step 4: Generate NFRs and Design

### Automatic NFR Analysis
```javascript
// The platform automatically generates NFRs from your PRD
const nfrResponse = await fetch('/api/nfr/generate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ prdId: 'your-prd-id' })
});
```

### UI/UX Design Generation
1. **Navigate to Design Studio**: From your PRD, click "Generate Designs"
2. **AI Wireframes**: Review auto-generated wireframes
3. **Design System**: Apply your brand colors and components
4. **Responsive Layouts**: Preview mobile, tablet, desktop views
5. **Export Assets**: Download design specifications

## 📋 Step 5: User Story Generation

### Generate Stories from Complete Artifacts
```bash
# API call to generate stories
curl -X POST http://localhost:3001/api/stories/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "your-project-id",
    "includeNFRs": true,
    "includeDesigns": true,
    "estimationModel": "fibonacci"
  }'
```

### Story Review and Refinement
1. **Epic Overview**: Review generated epic structure
2. **Story Details**: Check acceptance criteria and estimates
3. **Dependencies**: Validate story relationships
4. **Sprint Planning**: Organize stories into sprints
5. **Export to Tools**: Send to Jira, GitHub, or Linear

## 🔗 Step 6: Tool Integration

### Jira Integration
```javascript
// Configure Jira connection
const jiraConfig = {
  url: 'https://yourcompany.atlassian.net',
  email: 'your-email@company.com',
  apiToken: 'your-jira-api-token',
  projectKey: 'PROJ'
};

// Export stories to Jira
await exportToJira(projectId, jiraConfig);
```

### GitHub Integration
```bash
# Connect your GitHub repository
gh auth login

# Configure repository integration
npm run setup:github -- --repo "yourorg/yourproject"
```

## 📊 Step 7: Validation and Testing

### Test Your Setup
```bash
# Run health checks
npm run health-check

# Test AI integration
npm run test:ai

# Validate database connection
npm run test:db

# Test external integrations
npm run test:integrations
```

### Sample Data Setup
```bash
# Load sample projects and templates
npm run seed:sample-data

# Create demo user accounts
npm run seed:demo-users
```

## 🎉 Success! What's Next?

### You Now Have:
- ✅ **Working PRD Generator** with AI assistance
- ✅ **NFR Analysis Engine** extracting technical requirements  
- ✅ **Design Studio** creating wireframes and user flows
- ✅ **Story Generation Hub** producing development-ready tasks
- ✅ **Tool Integrations** connecting to your existing workflow

### Next Steps:
1. **Customize Templates**: Add your industry-specific templates
2. **Team Onboarding**: Invite your team members
3. **Integration Setup**: Connect your preferred tools (Jira, Slack, etc.)
4. **Custom Workflows**: Adapt the platform to your processes
5. **AI Model Training**: Train on your organizational data

## 🆘 Troubleshooting

### Common Issues

**AI Services Not Working:**
```bash
# Test API keys
npm run test:openai
npm run test:anthropic

# Check network connectivity
curl -s https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Database Connection Issues:**
```bash
# Check database status
docker-compose logs postgres

# Reset database
npm run db:reset
```

**Frontend Not Loading:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port conflicts
lsof -i :3000
```

### Getting Help
- **Documentation**: Check `/docs` folder for detailed guides
- **Community**: Join our GitHub Discussions
- **Issues**: Report bugs via GitHub Issues
- **Discord**: Join our developer community (link in README)

## 🔧 Development Mode

### Hot Reloading Setup
```bash
# Terminal 1: Backend with nodemon
cd backend && npm run dev:watch

# Terminal 2: Frontend with React hot reload  
cd frontend && npm run dev

# Terminal 3: Watch for changes in AI prompts
npm run dev:prompts
```

### Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## 📈 Performance Optimization

### Production-Ready Checklist
- [ ] Environment variables configured for production
- [ ] Database connection pooling enabled
- [ ] Redis caching configured
- [ ] AI response caching implemented
- [ ] CDN setup for static assets
- [ ] Load balancing configured
- [ ] Monitoring and logging enabled

### Scaling Considerations
- **Database**: Consider read replicas for heavy read workloads
- **AI Services**: Implement request queuing for high volume
- **Frontend**: Use CDN and implement service workers
- **Caching**: Redis cluster for high availability
- **Monitoring**: APM tools for performance tracking

---

**🎊 Congratulations!** You now have a fully functional AI-driven SDLC platform. The real magic happens when your team starts using it to create better products faster!

**Next:** Explore the [Advanced Configuration Guide](./advanced-configuration.md) to customize the platform for your specific needs.