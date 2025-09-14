const express = require('express');
const db = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Export to Jira
router.post('/jira/export', async (req, res) => {
  try {
    const { projectId, jiraConfig, storyIds = [] } = req.body;
    
    // Mock Jira export (replace with actual Jira API integration)
    const exportResult = {
      success: true,
      exportedStories: storyIds.length || 0,
      jiraUrl: `${jiraConfig?.url || 'https://company.atlassian.net'}/projects/${jiraConfig?.projectKey || 'PROJ'}`,
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Jira export requested for project ${projectId} by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Stories exported to Jira successfully',
      data: exportResult
    });
  } catch (error) {
    logger.error('Jira export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export to Jira'
    });
  }
});

// GitHub integration
router.post('/github/export', async (req, res) => {
  try {
    const { projectId, githubConfig, exportType = 'issues' } = req.body;
    
    // Mock GitHub export
    const exportResult = {
      success: true,
      exportType,
      repositoryUrl: `https://github.com/${githubConfig?.owner || 'user'}/${githubConfig?.repo || 'repo'}`,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Exported to GitHub successfully',
      data: exportResult
    });
  } catch (error) {
    logger.error('GitHub export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export to GitHub'
    });
  }
});

module.exports = router;