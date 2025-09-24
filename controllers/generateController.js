const faqService = require('../services/faqService');
const brandVoiceService = require('../services/brandVoiceService');

const generateAnswer = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { brandVoice, faq, question } = req.body;

    if (!brandVoice || !faq || !question) {
      return res.status(400).json({
        error: 'Missing required fields: brandVoice, faq, and question are required'
      });
    }

    const faqData = faqService.parseFAQ(faq);
    const relevantAnswers = faqService.findRelevantAnswers(faqData, question);

    const result = brandVoiceService.generateAnswer(relevantAnswers, brandVoice, question);

    const latencyMs = Date.now() - startTime;

    res.json({
      answer: result.answer,
      sources: result.sources,
      latencyMs
    });

  } catch (error) {
    console.error('Error generating answer:', error);
    const latencyMs = Date.now() - startTime;
    
    res.status(500).json({
      error: 'Failed to generate answer',
      latencyMs
    });
  }
};

module.exports = {
  generateAnswer
};
