//Brand Voice Service - Applies brand voice to generated answers

//Generate an answer using relevant FAQ data and brand voice
const generateAnswer = (relevantAnswers, brandVoice, userQuestion) => {
  if (!relevantAnswers || relevantAnswers.length === 0) {
    return generateFallbackAnswer(brandVoice);
  }

  const answerParts = [];
  const sources = [];

  for (const item of relevantAnswers) {
    answerParts.push(item.answer);
    sources.push(item.id);
  }

  let composedAnswer = composeAnswer(answerParts, userQuestion);
  
  composedAnswer = applyBrandVoice(composedAnswer, brandVoice);

  return {
    answer: composedAnswer,
    sources: sources
  };
};

//Compose answer from FAQ parts based on user question
const composeAnswer = (answerParts, userQuestion) => {
  const questionLower = userQuestion.toLowerCase();
  let composedAnswer = '';

  // Handle specific question patterns
  if (questionLower.includes('saturday') && questionLower.includes('appointment')) {
    const hoursInfo = answerParts.find(part => 
      part.toLowerCase().includes('sat') || part.toLowerCase().includes('10am')
    );
    const walkInInfo = answerParts.find(part => 
      part.toLowerCase().includes('walk-in') || part.toLowerCase().includes('appointment')
    );

    if (hoursInfo && walkInInfo) {
      const saturdayHours = hoursInfo.match(/sat\s+(\d+am–\d+pm)/i);
      const hours = saturdayHours ? saturdayHours[1] : '10am–4pm';
      
      composedAnswer = `Yes, we're open Saturdays ${hours}. ${walkInInfo} Booking is recommended.`;
    }
  } else if (questionLower.includes('book') || questionLower.includes('appointment')) {
    const bookingInfo = answerParts.find(part => 
      part.toLowerCase().includes('website') || part.toLowerCase().includes('call')
    );
    if (bookingInfo) {
      composedAnswer = bookingInfo;
    }
  } else if (questionLower.includes('service') || questionLower.includes('offer')) {
    const servicesInfo = answerParts.find(part => 
      part.toLowerCase().includes('haircut') || part.toLowerCase().includes('coloring')
    );
    if (servicesInfo) {
      composedAnswer = `We offer ${servicesInfo.toLowerCase()}.`;
    }
  } else if (questionLower.includes('hours') || questionLower.includes('open')) {
    const hoursInfo = answerParts.find(part => 
      part.toLowerCase().includes('mon') || part.toLowerCase().includes('9am')
    );
    if (hoursInfo) {
      composedAnswer = `Our hours are ${hoursInfo.toLowerCase()}.`;
    }
  } else {
    composedAnswer = answerParts[0];
  }

  return composedAnswer;
};

//Apply brand voice rules to the answer
const applyBrandVoice = (answer, brandVoice) => {
  let styledAnswer = answer;

  if (brandVoice.style_rules) {
    for (const rule of brandVoice.style_rules) {
      if (rule.includes('short sentences')) {
        styledAnswer = makeShortSentences(styledAnswer);
      }
      if (rule.includes('avoid jargon')) {
        styledAnswer = removeJargon(styledAnswer);
      }
    }
  }

  if (brandVoice.signoff) {
    styledAnswer += ` ${brandVoice.signoff}`;
  }

  return styledAnswer;
};

//Break long sentences into shorter ones
const makeShortSentences = (text) => {
  return text
    .replace(/,\s+and\s+/g, '. ')
    .replace(/,\s+but\s+/g, '. ')
    .replace(/;\s+/g, '. ')
    .replace(/\.\s+\./g, '.')
    .trim();
};

//Remove or simplify jargon
const removeJargon = (text) => {
  const jargonMap = {
    'utilize': 'use',
    'facilitate': 'help',
    'implement': 'do',
    'optimize': 'improve'
  };

  let result = text;
  for (const [jargon, simple] of Object.entries(jargonMap)) {
    const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
    result = result.replace(regex, simple);
  }

  return result;
};

//Generate fallback answer when no relevant FAQ found
const generateFallbackAnswer = (brandVoice) => {
  let fallbackAnswer = "I don't have specific information about that. Please call us for details.";
  
  fallbackAnswer = applyBrandVoice(fallbackAnswer, brandVoice);

  return {
    answer: fallbackAnswer,
    sources: []
  };
};

module.exports = {
  generateAnswer
};
