# API Reference

> Comprehensive REST API documentation for the AI-Driven SDLC Platform

## 🔗 Base URL
```
Production: https://api.ai-sdlc-platform.com/v1
Development: http://localhost:3001/api/v1
```

## 🔐 Authentication

### JWT Bearer Token
All API requests require authentication via JWT tokens:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting an Access Token
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "product_owner"
  }
}
```

## 📋 Projects API

### Create Project
```http
POST /projects
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "My AI Project",
  "description": "AI-powered analytics dashboard",
  "type": "saas_platform",
  "industry": "data_analytics",
  "stakeholders": [
    {
      "role": "product_owner",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

**Response:**
```json
{
  "id": "proj_abc123",
  "name": "My AI Project",
  "description": "AI-powered analytics dashboard",
  "type": "saas_platform",
  "industry": "data_analytics",
  "status": "draft",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "stakeholders": [...],
  "workflow_stage": "prd_generation"
}
```

### List Projects
```http
GET /projects?page=1&limit=20&status=active
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (`draft`, `active`, `completed`, `archived`)
- `type` (optional): Filter by project type
- `search` (optional): Search in project names and descriptions

### Get Project Details
```http
GET /projects/{project_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "proj_abc123",
  "name": "My AI Project",
  "description": "AI-powered analytics dashboard",
  "type": "saas_platform",
  "industry": "data_analytics",
  "status": "active",
  "workflow_stage": "nfr_generation",
  "progress": {
    "prd": {
      "status": "completed",
      "completion_percentage": 100,
      "last_updated": "2024-01-15T14:30:00Z"
    },
    "nfr": {
      "status": "in_progress", 
      "completion_percentage": 65,
      "last_updated": "2024-01-16T09:15:00Z"
    },
    "design": {
      "status": "pending",
      "completion_percentage": 0,
      "last_updated": null
    },
    "stories": {
      "status": "pending",
      "completion_percentage": 0,
      "last_updated": null
    }
  },
  "team": [...],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T09:15:00Z"
}
```

## 📄 PRD API

### Generate PRD
```http
POST /projects/{project_id}/prd/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "template_id": "saas_platform_template",
  "discovery_responses": {
    "problem_statement": "Small businesses need simple CRM solutions",
    "target_users": "Small business owners with 10-50 customers",
    "success_metrics": "85% user retention, <30min onboarding",
    "competitive_advantage": "Simple setup, mobile-first, affordable"
  },
  "ai_settings": {
    "model": "gpt-4",
    "creativity_level": 0.7,
    "technical_depth": "medium"
  }
}
```

**Response:**
```json
{
  "id": "prd_xyz789",
  "project_id": "proj_abc123", 
  "status": "generating",
  "job_id": "job_generate_prd_123",
  "estimated_completion": "2024-01-15T11:00:00Z"
}
```

### Get PRD Content
```http
GET /projects/{project_id}/prd
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "prd_xyz789",
  "project_id": "proj_abc123",
  "status": "completed",
  "content": {
    "executive_summary": "...",
    "market_analysis": "...", 
    "user_personas": "...",
    "functional_requirements": "...",
    "success_metrics": "...",
    "go_to_market": "..."
  },
  "metadata": {
    "word_count": 4250,
    "completion_score": 0.92,
    "ai_confidence": 0.87,
    "generated_sections": ["executive_summary", "market_analysis", ...],
    "review_status": {
      "product_owner": "approved",
      "engineering_lead": "pending",
      "stakeholder_count": 3
    }
  },
  "version": "1.2",
  "created_at": "2024-01-15T10:45:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

### Update PRD Section
```http
PATCH /projects/{project_id}/prd/sections/{section_name}
Content-Type: application/json
Authorization: Bearer <token>

{
  "content": "Updated section content...",
  "ai_assist": true,
  "review_notes": "Updated based on stakeholder feedback"
}
```

### Export PRD
```http
GET /projects/{project_id}/prd/export?format=pdf&include_comments=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `format`: Export format (`pdf`, `docx`, `markdown`, `html`)
- `include_comments` (optional): Include review comments (default: false)
- `template` (optional): Custom export template ID

## ⚙️ NFR API

### Generate NFRs
```http
POST /projects/{project_id}/nfr/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "prd_id": "prd_xyz789",
  "analysis_depth": "comprehensive",
  "focus_areas": [
    "performance",
    "security", 
    "scalability",
    "reliability"
  ],
  "industry_standards": [
    "soc2",
    "gdpr"
  ]
}
```

**Response:**
```json
{
  "id": "nfr_def456",
  "project_id": "proj_abc123",
  "prd_id": "prd_xyz789",
  "status": "generating",
  "job_id": "job_generate_nfr_456",
  "estimated_completion": "2024-01-16T10:30:00Z"
}
```

### Get NFR Analysis
```http
GET /projects/{project_id}/nfr
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "nfr_def456",
  "project_id": "proj_abc123",
  "status": "completed",
  "requirements": {
    "performance": {
      "response_time": {
        "target": "< 2 seconds",
        "critical_paths": ["dashboard_load", "report_generation"],
        "rationale": "User research indicates 2s is maximum acceptable wait time"
      },
      "throughput": {
        "concurrent_users": 1000,
        "requests_per_second": 500,
        "rationale": "Based on projected user growth and usage patterns"
      }
    },
    "security": {
      "authentication": {
        "methods": ["multi_factor", "sso"],
        "session_timeout": "8 hours",
        "rationale": "Enterprise security requirements for sensitive data"
      },
      "data_protection": {
        "encryption_at_rest": "AES-256",
        "encryption_in_transit": "TLS 1.3",
        "rationale": "Industry standard for financial data protection"
      }
    }
  },
  "technical_feasibility": {
    "overall_score": 0.85,
    "risk_factors": [
      {
        "category": "performance",
        "risk_level": "medium",
        "description": "Complex reporting queries may impact response time",
        "mitigation": "Implement caching and query optimization"
      }
    ]
  },
  "cost_analysis": {
    "infrastructure_estimate": "$2,400/month",
    "scaling_cost_projection": "$12,000/month at 10x scale",
    "cost_optimization_recommendations": [...]
  },
  "created_at": "2024-01-16T09:15:00Z",
  "updated_at": "2024-01-16T10:30:00Z"
}
```

## 🎨 Design API

### Generate Design
```http
POST /projects/{project_id}/design/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "prd_id": "prd_xyz789",
  "nfr_id": "nfr_def456",
  "design_preferences": {
    "style": "modern_minimal",
    "color_palette": "professional_blue",
    "target_devices": ["desktop", "tablet", "mobile"],
    "accessibility_level": "wcag_aa"
  },
  "generate_components": [
    "wireframes",
    "user_flows", 
    "component_library",
    "responsive_layouts"
  ]
}
```

### Get Design Assets
```http
GET /projects/{project_id}/design
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "design_ghi789",
  "project_id": "proj_abc123",
  "status": "completed",
  "assets": {
    "wireframes": [
      {
        "name": "Dashboard Overview",
        "url": "https://assets.ai-sdlc.com/wireframes/dashboard-overview.svg",
        "components": ["navigation", "kpi_cards", "charts", "activity_feed"]
      },
      {
        "name": "User Management", 
        "url": "https://assets.ai-sdlc.com/wireframes/user-mgmt.svg",
        "components": ["user_list", "add_user_modal", "permissions_grid"]
      }
    ],
    "user_flows": [
      {
        "name": "User Onboarding",
        "url": "https://assets.ai-sdlc.com/flows/onboarding.svg",
        "steps": 5,
        "estimated_time": "3-5 minutes"
      }
    ],
    "component_library": {
      "buttons": [...],
      "forms": [...],
      "navigation": [...],
      "data_display": [...]
    }
  },
  "design_system": {
    "colors": {
      "primary": "#2563eb",
      "secondary": "#10b981", 
      "accent": "#f59e0b"
    },
    "typography": {
      "font_family": "Inter",
      "scales": {...}
    },
    "spacing": {...}
  },
  "accessibility_report": {
    "wcag_compliance": "AA",
    "issues_found": 0,
    "recommendations": [...]
  }
}
```

## 📋 Stories API

### Generate User Stories
```http
POST /projects/{project_id}/stories/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "prd_id": "prd_xyz789",
  "nfr_id": "nfr_def456",
  "design_id": "design_ghi789",
  "generation_settings": {
    "story_format": "given_when_then",
    "estimation_method": "fibonacci",
    "include_technical_stories": true,
    "include_testing_stories": true,
    "epic_breakdown": "feature_based"
  }
}
```

### Get Generated Stories
```http
GET /projects/{project_id}/stories?epic=dashboard&status=ready
Authorization: Bearer <token>
```

**Response:**
```json
{
  "project_id": "proj_abc123",
  "total_stories": 47,
  "epics": [
    {
      "id": "epic_001",
      "name": "User Authentication & Onboarding",
      "description": "User registration, login, and initial setup",
      "story_count": 6,
      "total_points": 21,
      "priority": "high",
      "stories": [
        {
          "id": "story_001", 
          "title": "User Registration with Email Verification",
          "type": "feature",
          "epic_id": "epic_001",
          "story_points": 5,
          "priority": "high",
          "status": "ready",
          "description": "As a new user, I want to create an account with email verification so that I can securely access the platform",
          "acceptance_criteria": [
            {
              "scenario": "Successful Registration",
              "given": "I am on the registration page",
              "when": "I enter valid email, password, and confirm password",
              "then": "I should receive an email verification link and see a confirmation message"
            }
          ],
          "technical_notes": "Implement email service integration with SendGrid",
          "definition_of_done": [
            "Unit tests written and passing",
            "Integration tests for email service",
            "Accessibility testing completed",
            "Cross-browser testing verified"
          ],
          "dependencies": [],
          "labels": ["frontend", "backend", "email"],
          "assignee": null,
          "created_at": "2024-01-17T10:15:00Z"
        }
      ]
    }
  ],
  "summary": {
    "total_epics": 8,
    "total_story_points": 213,
    "story_breakdown": {
      "feature": 32,
      "technical": 8,
      "bug": 0,
      "testing": 7
    },
    "priority_breakdown": {
      "high": 15,
      "medium": 22, 
      "low": 10
    }
  }
}
```

### Export Stories to External Tools
```http
POST /projects/{project_id}/stories/export
Content-Type: application/json
Authorization: Bearer <token>

{
  "target_platform": "jira",
  "configuration": {
    "server_url": "https://yourcompany.atlassian.net",
    "project_key": "PROJ",
    "credentials": {
      "email": "user@example.com",
      "api_token": "your_jira_token"
    }
  },
  "export_settings": {
    "create_epics": true,
    "include_acceptance_criteria": true,
    "map_story_points": true,
    "sync_mode": "create_new"
  }
}
```

## 🤖 AI API

### Get AI Models Status
```http
GET /ai/models/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "models": [
    {
      "provider": "openai",
      "model": "gpt-4",
      "status": "available",
      "latency_ms": 1250,
      "rate_limit": {
        "requests_per_minute": 60,
        "remaining": 45
      }
    },
    {
      "provider": "anthropic",
      "model": "claude-3-sonnet",
      "status": "available", 
      "latency_ms": 980,
      "rate_limit": {
        "requests_per_minute": 50,
        "remaining": 32
      }
    }
  ],
  "usage_stats": {
    "total_requests_today": 1247,
    "cost_today": "$23.45",
    "average_response_time": 1150
  }
}
```

### Custom AI Request
```http
POST /ai/chat/completions
Content-Type: application/json
Authorization: Bearer <token>

{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a product requirements specialist."
    },
    {
      "role": "user", 
      "content": "Analyze this feature request and suggest acceptance criteria..."
    }
  ],
  "context": {
    "project_id": "proj_abc123",
    "document_type": "user_story",
    "industry": "saas"
  }
}
```

## 🔧 Webhooks

### Configure Webhook
```http
POST /webhooks
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://yourapp.com/webhook/ai-sdlc",
  "events": [
    "prd.completed",
    "nfr.generated", 
    "design.created",
    "stories.generated"
  ],
  "secret": "your_webhook_secret"
}
```

### Webhook Event Format
```json
{
  "event": "prd.completed",
  "project_id": "proj_abc123",
  "data": {
    "prd_id": "prd_xyz789",
    "completion_score": 0.92,
    "word_count": 4250,
    "sections_generated": 8
  },
  "timestamp": "2024-01-15T14:30:00Z",
  "signature": "sha256=1a2b3c4d5e6f..."
}
```

## 📊 Analytics API

### Get Project Analytics
```http
GET /projects/{project_id}/analytics?period=30d
Authorization: Bearer <token>
```

### Platform Usage Statistics  
```http
GET /analytics/usage?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <token>
```

## ❌ Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Valid email address is required"
      }
    ],
    "request_id": "req_123456789"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## 🔒 Rate Limits

### Default Limits
- **Authentication**: 5 requests per minute
- **AI Generation**: 10 requests per hour
- **Standard API**: 100 requests per minute
- **Webhook Delivery**: 1000 per hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642694400
```

## 🔧 SDKs & Libraries

### Official SDKs
- **JavaScript/TypeScript**: `npm install @ai-sdlc/sdk`
- **Python**: `pip install ai-sdlc-python`
- **Go**: `go get github.com/ai-sdlc/go-sdk`

### Example Usage (JavaScript)
```javascript
import { AISdlcClient } from '@ai-sdlc/sdk';

const client = new AISdlcClient({
  apiKey: 'your_api_key',
  baseURL: 'https://api.ai-sdlc-platform.com/v1'
});

// Create project
const project = await client.projects.create({
  name: 'My Project',
  type: 'saas_platform'
});

// Generate PRD
const prd = await client.prd.generate(project.id, {
  template: 'saas_template',
  discoveryResponses: {...}
});
```

---

## 📚 Additional Resources

- **API Explorer**: Interactive API testing interface
- **Postman Collection**: Pre-configured API collection
- **Rate Limit Calculator**: Estimate your usage needs
- **Webhook Tester**: Validate webhook integrations
- **Status Page**: Real-time API status and incidents

**Support**: For API issues or questions, contact `api-support@ai-sdlc-platform.com`