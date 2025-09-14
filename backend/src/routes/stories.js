const express = require('express');
const { aiRateLimit } = require('../middleware/rateLimiter');
const db = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Generate user stories from PRD and NFRs
router.post('/generate', aiRateLimit, async (req, res) => {
  try {
    const { projectId, prdId, nfrId, options = {} } = req.body;
    
    // Mock user story generation (replace with actual AI service)
    const generatedStories = [
      {
        title: 'User Registration and Authentication',
        description: 'As a new user, I want to register for an account so that I can access the platform',
        acceptanceCriteria: [
          'User can register with email and password',
          'Email verification is required',
          'Password meets security requirements'
        ],
        storyPoints: 5,
        priority: 'high'
      },
      {
        title: 'Dashboard Overview',
        description: 'As a logged-in user, I want to see an overview dashboard so that I can quickly understand my project status',
        acceptanceCriteria: [
          'Display project summary cards',
          'Show recent activity feed',
          'Include quick action buttons'
        ],
        storyPoints: 8,
        priority: 'high'
      }
    ];
    
    const stories = [];
    for (const story of generatedStories) {
      const result = await db.query(`
        INSERT INTO user_stories (project_id, title, description, acceptance_criteria, 
                                story_points, priority, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        projectId, story.title, story.description,
        JSON.stringify(story.acceptanceCriteria),
        story.storyPoints, story.priority, req.user.id
      ]);
      stories.push(result.rows[0]);
    }
    
    res.status(201).json({
      success: true,
      message: 'User stories generated successfully',
      data: { stories }
    });
  } catch (error) {
    logger.error('Story generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate user stories'
    });
  }
});

// Get stories for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const result = await db.query(`
      SELECT us.*, u.first_name, u.last_name
      FROM user_stories us
      LEFT JOIN users u ON us.assignee_id = u.id
      JOIN projects p ON us.project_id = p.id
      WHERE us.project_id = $1 
        AND (p.created_by = $2 OR p.id IN (SELECT project_id FROM project_members WHERE user_id = $2))
      ORDER BY us.priority DESC, us.created_at ASC
    `, [projectId, req.user.id]);
    
    res.json({
      success: true,
      data: { stories: result.rows }
    });
  } catch (error) {
    logger.error('Get stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories'
    });
  }
});

module.exports = router;