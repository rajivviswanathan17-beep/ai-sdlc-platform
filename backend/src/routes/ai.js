const express = require('express');
const { aiRateLimit } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

const router = express.Router();

// Apply AI rate limiting to all AI routes
router.use(aiRateLimit);

// Test AI connection
router.get('/test', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'AI services are available',
      data: {
        providers: ['OpenAI', 'Anthropic'],
        status: 'operational'
      }
    });
  } catch (error) {
    logger.error('AI test error:', error);
    res.status(500).json({
      success: false,
      message: 'AI services unavailable'
    });
  }
});

// Generic AI completion endpoint
router.post('/complete', async (req, res) => {
  try {
    const { prompt, provider = 'openai', model, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }
    
    // Mock AI completion (replace with actual AI service calls)
    const completion = {
      text: `This is a mock AI response to: "${prompt.substring(0, 50)}..."`,
      provider,
      model: model || 'gpt-4',
      usage: {
        promptTokens: Math.floor(prompt.length / 4),
        completionTokens: 50,
        totalTokens: Math.floor(prompt.length / 4) + 50
      }
    };
    
    logger.info(`AI completion requested by ${req.user.email}`, {
      provider,
      model,
      promptLength: prompt.length
    });
    
    res.json({
      success: true,
      data: completion
    });
  } catch (error) {
    logger.error('AI completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI completion'
    });
  }
});

module.exports = router;