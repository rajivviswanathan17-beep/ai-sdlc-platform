# Local Development Setup Guide

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed
- Git installed

### Steps

1. **Clone and navigate to the project:**
   ```bash
   git clone https://github.com/rajivviswanathan17-beep/ai-sdlc-platform.git
   cd ai-sdlc-platform
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health
   - Database Admin (optional): http://localhost:5050

4. **Create your first account:**
   - Go to http://localhost:3000
   - Click "Create a new account"
   - Fill in your details and start using the platform!

## 🔧 Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up PostgreSQL database:**
   ```bash
   createdb ai_sdlc_dev
   ```

3. **Start Redis:**
   ```bash
   redis-server
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Start the backend:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```

## 🔑 AI API Keys Setup (Optional)

To enable AI features, add your API keys to `backend/.env`:

```bash
# OpenAI (for GPT-4 integration)
OPENAI_API_KEY=sk-your-openai-key-here

# Anthropic (for Claude integration)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

Get your keys from:
- OpenAI: https://platform.openai.com/account/api-keys
- Anthropic: https://console.anthropic.com/

## 🧪 Testing the Setup

### Health Checks
- Backend: `curl http://localhost:3001/health`
- Frontend: Open http://localhost:3000

### Database Connection
```bash
# Connect to PostgreSQL
psql postgresql://postgres:password@localhost:5432/ai_sdlc_dev

# List tables
\dt
```

### Redis Connection
```bash
# Connect to Redis
redis-cli ping
# Should return: PONG
```

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Development with hot reload
npm run dev

# Run tests
npm test

# Check lint
npm run lint

# Database operations
npm run db:migrate
npm run db:seed
npm run db:reset
```

### Frontend
```bash
cd frontend

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check lint
npm run lint

# Type checking
npm run type-check
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Rebuild containers
docker-compose up -d --build

# View service status
docker-compose ps
```

## 📊 Default Ports

- Frontend (React): http://localhost:3000
- Backend (Node.js): http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- pgAdmin (optional): http://localhost:5050

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

### Docker Issues
```bash
# Clean up Docker
docker-compose down -v
docker system prune -f

# Rebuild from scratch
docker-compose up -d --build --force-recreate
```

### Database Issues
```bash
# Reset database
docker-compose exec backend npm run db:reset

# View database logs
docker-compose logs postgres
```

## 🎯 First Time Usage

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Create your first project** from the dashboard
4. **Start generating PRDs** with AI assistance

## 📱 Features Available

✅ **Authentication**: User registration and login
✅ **Project Management**: Create and manage projects
✅ **Real-time Collaboration**: Multiple users can work together
✅ **Database Integration**: PostgreSQL with full schema
✅ **Caching**: Redis for performance
✅ **API Documentation**: REST API with comprehensive endpoints

🔄 **Coming with AI Keys**:
- AI-powered PRD generation
- NFR analysis from requirements
- User story generation
- Smart suggestions and improvements

## 💡 Tips

- Use Docker for the easiest setup experience
- Add AI API keys to unlock the full potential
- Check the logs if something isn't working: `docker-compose logs -f`
- The database will persist data between restarts
- Use the health endpoints to verify services are running