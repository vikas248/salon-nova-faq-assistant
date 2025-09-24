//FAQ Service - Handles parsing FAQ text and finding relevant answers

//Parse FAQ text into structured Q&A pairs
const parseFAQ = (faqText) => {
  const faqItems = [];
  const lines = faqText.split('\n').filter(line => line.trim());
  
  let currentQuestion = null;
  let currentAnswer = null;
  let questionId = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('Q:')) {
      if (currentQuestion && currentAnswer && questionId) {
        faqItems.push({
          id: questionId,
          question: currentQuestion,
          answer: currentAnswer
        });
      }
      
      currentQuestion = trimmedLine.substring(2).trim();
      questionId = generateQuestionId(currentQuestion);
      currentAnswer = null;
    } else if (trimmedLine.startsWith('A:')) {
      currentAnswer = trimmedLine.substring(2).trim();
    }
  }
  
  if (currentQuestion && currentAnswer && questionId) {
    faqItems.push({
      id: questionId,
      question: currentQuestion,
      answer: currentAnswer
    });
  }
  
  return faqItems;
};

//Generate a simple ID from question text
const generateQuestionId = (question) => {
  const keywords = question.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 2);
  
  return keywords.join('-') || 'question';
};

//Find relevant FAQ answers based on the user question
const findRelevantAnswers = (faqData, userQuestion) => {
  const questionLower = userQuestion.toLowerCase();
  const relevantItems = [];

  // Define keyword mappings for better matching
  const keywordMappings = {
    'saturday': ['saturday', 'sat', 'weekend'],
    'hours': ['hours', 'open', 'time', 'when'],
    'walk-ins': ['walk-in', 'walk in', 'appointment', 'without appointment'],
    'services': ['service', 'offer', 'do', 'what'],
    'booking': ['book', 'schedule', 'appointment', 'reserve'],
    'cancellation': ['cancel', 'reschedule', 'change', 'policy']
  };

  for (const faqItem of faqData) {
    let relevanceScore = 0;
    const matchedKeywords = [];

    for (const [category, keywords] of Object.entries(keywordMappings)) {
      for (const keyword of keywords) {
        if (questionLower.includes(keyword)) {
          if (faqItem.question.toLowerCase().includes(keyword) || 
              faqItem.answer.toLowerCase().includes(keyword)) {
            relevanceScore += 1;
            if (!matchedKeywords.includes(category)) {
              matchedKeywords.push(category);
            }
          }
        }
      }
    }

    if (relevanceScore > 0) {
      relevantItems.push({
        ...faqItem,
        relevanceScore,
        matchedKeywords
      });
    }
  }

  return relevantItems.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

module.exports = {
  parseFAQ,
  findRelevantAnswers
};
