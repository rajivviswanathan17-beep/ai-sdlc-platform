const express = require('express');
const { aiRateLimit } = require('../middleware/rateLimiter');
const db = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Get PRD by project ID
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify user has access to project
    const projectCheck = await db.query(
      'SELECT id FROM projects WHERE id = $1 AND (created_by = $2 OR id IN (SELECT project_id FROM project_members WHERE user_id = $2))',
      [projectId, req.user.id]
    );
    
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }
    
    const result = await db.query(`
      SELECT p.*, u.first_name, u.last_name, u.email,
             proj.name as project_name
      FROM prds p
      JOIN users u ON p.created_by = u.id
      JOIN projects proj ON p.project_id = proj.id
      WHERE p.project_id = $1
      ORDER BY p.version DESC
      LIMIT 1
    `, [projectId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No PRD found for this project'
      });
    }
    
    res.json({
      success: true,
      data: {
        prd: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Get PRD error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PRD'
    });
  }
});

// Generate PRD using AI
router.post('/generate', aiRateLimit, async (req, res) => {
  try {
    const { 
      projectId, 
      businessGoals, 
      targetMarket, 
      competitiveContext, 
      templateId,
      additionalContext 
    } = req.body;
    
    // Validation
    if (!projectId || !businessGoals || !targetMarket) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, business goals, and target market are required'
      });
    }
    
    // Verify user has access to project
    const projectResult = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND (created_by = $2 OR id IN (SELECT project_id FROM project_members WHERE user_id = $2))',
      [projectId, req.user.id]
    );
    
    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }
    
    const project = projectResult.rows[0];
    
    // Mock AI PRD generation (replace with actual AI service call)
    const generatedContent = {
      executiveSummary: {
        productVision: `${project.name} is designed to address the core challenges identified in the target market analysis.`,
        marketOpportunity: `Based on the provided business goals: ${Array.isArray(businessGoals) ? businessGoals.join(', ') : businessGoals}`,
        successMetrics: [
          'User acquisition targets',
          'Revenue goals', 
          'Market penetration metrics'
        ]
      },
      marketAnalysis: {
        targetMarket: targetMarket,
        competitiveContext: competitiveContext || {},
        marketSize: 'To be determined through research',
        trends: []
      },
      userPersonas: [
        {
          name: 'Primary User',
          description: 'Main target user based on market analysis',
          goals: [],
          painPoints: []
        }
      ],
      features: [
        {
          name: 'Core Feature Set',
          description: 'Essential functionality based on requirements',
          priority: 'high',
          requirements: []
        }
      ],
      technicalConsiderations: {
        scalability: 'Scalable architecture required',
        security: 'Industry-standard security measures',
        performance: 'Optimal performance requirements',
        integrations: []
      },
      timeline: {
        phases: [
          {
            name: 'Phase 1: Foundation',
            duration: '2-3 months',
            deliverables: []
          }
        ]
      }
    };
    
    // Save PRD to database
    const prdResult = await db.query(`
      INSERT INTO prds (project_id, title, content, template_id, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      projectId,
      `${project.name} - Product Requirements Document`,
      JSON.stringify(generatedContent),
      templateId || 'default',
      req.user.id
    ]);
    
    const prd = prdResult.rows[0];
    
    // Log activity
    await db.query(`
      INSERT INTO activity_logs (project_id, user_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'generate', 'prd', $3, $4)
    `, [projectId, req.user.id, prd.id, JSON.stringify({ templateId, aiGenerated: true })]);
    
    logger.info(`PRD generated for project ${projectId} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'PRD generated successfully',
      data: {
        prd
      }
    });
  } catch (error) {
    logger.error('Generate PRD error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PRD'
    });
  }
});

// Update PRD content
router.put('/:id', async (req, res) => {
  try {
    const prdId = req.params.id;
    const { title, content, status } = req.body;
    
    // Check if PRD exists and user has permission
    const existingPrd = await db.query(`
      SELECT p.*, proj.created_by as project_owner
      FROM prds p
      JOIN projects proj ON p.project_id = proj.id
      WHERE p.id = $1 AND (proj.created_by = $2 OR proj.id IN (SELECT project_id FROM project_members WHERE user_id = $2))
    `, [prdId, req.user.id]);
    
    if (existingPrd.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PRD not found or access denied'
      });
    }
    
    // Build update query
    const updates = [];
    const values = [];
    let valueIndex = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${valueIndex++}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${valueIndex++}`);
      values.push(JSON.stringify(content));
    }
    if (status !== undefined) {
      updates.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(prdId);
    
    const result = await db.query(`
      UPDATE prds 
      SET ${updates.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `, values);
    
    // Log activity
    await db.query(`
      INSERT INTO activity_logs (project_id, user_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'update', 'prd', $3, $4)
    `, [existingPrd.rows[0].project_id, req.user.id, prdId, JSON.stringify({ updated: Object.keys(req.body) })]);
    
    res.json({
      success: true,
      message: 'PRD updated successfully',
      data: {
        prd: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Update PRD error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update PRD'
    });
  }
});

// Get PRD versions/history
router.get('/:id/versions', async (req, res) => {
  try {
    const prdId = req.params.id;
    
    const result = await db.query(`
      SELECT p.id, p.version, p.status, p.created_at, p.updated_at,
             u.first_name, u.last_name, u.email
      FROM prds p
      JOIN users u ON p.created_by = u.id
      JOIN projects proj ON p.project_id = proj.id
      WHERE p.project_id = (SELECT project_id FROM prds WHERE id = $1)
        AND (proj.created_by = $2 OR proj.id IN (SELECT project_id FROM project_members WHERE user_id = $2))
      ORDER BY p.version DESC
    `, [prdId, req.user.id]);
    
    res.json({
      success: true,
      data: {
        versions: result.rows
      }
    });
  } catch (error) {
    logger.error('Get PRD versions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PRD versions'
    });
  }
});

module.exports = router;