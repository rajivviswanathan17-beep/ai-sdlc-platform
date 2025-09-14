const express = require('express');
const db = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Get all projects for current user
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.name, p.description, p.type, p.industry, p.status,
             p.created_at, p.updated_at,
             COUNT(pr.id) as prd_count,
             COUNT(us.id) as story_count
      FROM projects p
      LEFT JOIN prds pr ON p.id = pr.project_id
      LEFT JOIN user_stories us ON p.id = us.project_id
      WHERE p.created_by = $1 OR p.id IN (
        SELECT project_id FROM project_members WHERE user_id = $1
      )
      GROUP BY p.id, p.name, p.description, p.type, p.industry, p.status, p.created_at, p.updated_at
      ORDER BY p.updated_at DESC
    `, [req.user.id]);
    
    res.json({
      success: true,
      data: {
        projects: result.rows
      }
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    
    const result = await db.query(`
      SELECT p.*, 
             u.first_name as creator_first_name, u.last_name as creator_last_name,
             COUNT(pr.id) as prd_count,
             COUNT(us.id) as story_count
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN prds pr ON p.id = pr.project_id
      LEFT JOIN user_stories us ON p.id = us.project_id
      WHERE p.id = $1 AND (p.created_by = $2 OR p.id IN (
        SELECT project_id FROM project_members WHERE user_id = $2
      ))
      GROUP BY p.id, u.first_name, u.last_name
    `, [projectId, req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        project: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const { name, description, type, industry, settings = {} } = req.body;
    
    // Validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Project name and type are required'
      });
    }
    
    const result = await db.query(`
      INSERT INTO projects (name, description, type, industry, created_by, settings)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, type, industry, req.user.id, JSON.stringify(settings)]);
    
    const project = result.rows[0];
    
    // Log activity
    await db.query(`
      INSERT INTO activity_logs (project_id, user_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'create', 'project', $3, $4)
    `, [project.id, req.user.id, project.id, JSON.stringify({ name, type, industry })]);
    
    logger.info(`New project created: ${project.name} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    });
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, type, industry, status, settings } = req.body;
    
    // Check if project exists and user has permission
    const existingProject = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND created_by = $2',
      [projectId, req.user.id]
    );
    
    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    let valueIndex = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${valueIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${valueIndex++}`);
      values.push(description);
    }
    if (type !== undefined) {
      updates.push(`type = $${valueIndex++}`);
      values.push(type);
    }
    if (industry !== undefined) {
      updates.push(`industry = $${valueIndex++}`);
      values.push(industry);
    }
    if (status !== undefined) {
      updates.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    if (settings !== undefined) {
      updates.push(`settings = $${valueIndex++}`);
      values.push(JSON.stringify(settings));
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(projectId);
    
    const result = await db.query(`
      UPDATE projects 
      SET ${updates.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `, values);
    
    // Log activity
    await db.query(`
      INSERT INTO activity_logs (project_id, user_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'update', 'project', $3, $4)
    `, [projectId, req.user.id, projectId, JSON.stringify(req.body)]);
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Check if project exists and user has permission
    const existingProject = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND created_by = $2',
      [projectId, req.user.id]
    );
    
    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }
    
    // Delete project (cascade will handle related records)
    await db.query('DELETE FROM projects WHERE id = $1', [projectId]);
    
    logger.info(`Project deleted: ${existingProject.rows[0].name} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;