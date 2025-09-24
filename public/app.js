// Seed data for the demo
const SEED_DATA = {
    faq: `Q: What services do you offer?
A: Haircuts, coloring, styling, and keratin treatments.

Q: What are your hours?
A: Mon–Fri 9am–6pm, Sat 10am–4pm, closed Sunday.

Q: Do you accept walk-ins?
A: We prefer appointments, but walk-ins are welcome if a stylist is free.

Q: How can I book?
A: Use our website or call 555-0148. We require a credit card to hold your slot.

Q: Cancellation policy?
A: Cancel or reschedule at least 12 hours in advance to avoid a $20 fee.`,

    brandVoice: {
        "tone": "Warm, concise, reassuring",
        "style_rules": [
            "Use short sentences.",
            "Avoid jargon.",
            "End with a friendly nudge if suitable."
        ],
        "signoff": "— Salon Nova"
    },

    question: "Are you open on Saturdays, and can I come without an appointment?"
};

// DOM elements
const elements = {
    form: document.getElementById('generateForm'),
    faqInput: document.getElementById('faqInput'),
    brandVoiceInput: document.getElementById('brandVoiceInput'),
    questionInput: document.getElementById('questionInput'),
    generateBtn: document.getElementById('generateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    btnText: document.querySelector('.btn-text'),
    btnLoading: document.querySelector('.btn-loading'),
    results: document.getElementById('results'),
    error: document.getElementById('error'),
    answerOutput: document.getElementById('answerOutput'),
    sourcesOutput: document.getElementById('sourcesOutput'),
    latencyOutput: document.getElementById('latencyOutput'),
    errorMessage: document.getElementById('errorMessage')
};

// API configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINT = `${API_BASE_URL}/api/generate`;

// Initialize the application
function initializeApp() {
    loadSeedData();
    attachEventListeners();
    console.log('TRI AI Solutions Demo initialized');
}

// Load seed data into form fields
function loadSeedData() {
    elements.faqInput.value = SEED_DATA.faq;
    elements.brandVoiceInput.value = JSON.stringify(SEED_DATA.brandVoice, null, 2);
    elements.questionInput.value = SEED_DATA.question;
}

// Attach event listeners
function attachEventListeners() {
    elements.form.addEventListener('submit', handleFormSubmit);
    elements.resetBtn.addEventListener('click', handleReset);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleFormSubmit(e);
        }
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            handleReset();
        }
    });
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    hideResults();
    hideError();
    
    const validation = validateInputs();
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    const requestData = prepareRequestData();
    if (!requestData) {
        return; 
    }
    
    setLoadingState(true);
    
    try {
        const startTime = performance.now();
        const response = await makeAPIRequest(requestData);
        const endTime = performance.now();
        
        if (response.success) {
            // Add client-side latency if not provided by server
            if (!response.data.latencyMs) {
                response.data.latencyMs = Math.round(endTime - startTime);
            }
            showResults(response.data);
        } else {
            showError(response.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('API request failed:', error);
        showError(`Network error: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}

// Validate form inputs
function validateInputs() {
    const faq = elements.faqInput.value.trim();
    const brandVoice = elements.brandVoiceInput.value.trim();
    const question = elements.questionInput.value.trim();
    
    if (!faq) {
        return { isValid: false, message: 'FAQ content is required' };
    }
    
    if (!brandVoice) {
        return { isValid: false, message: 'Brand Voice configuration is required' };
    }
    
    if (!question) {
        return { isValid: false, message: 'User question is required' };
    }
    
    try {
        JSON.parse(brandVoice);
    } catch (e) {
        return { isValid: false, message: 'Brand Voice must be valid JSON format' };
    }
    
    return { isValid: true };
}

// Prepare request data
function prepareRequestData() {
    try {
        const faq = elements.faqInput.value.trim();
        const brandVoiceText = elements.brandVoiceInput.value.trim();
        const question = elements.questionInput.value.trim();
        
        let brandVoice;
        try {
            brandVoice = JSON.parse(brandVoiceText);
        } catch (e) {
            showError('Invalid JSON format in Brand Voice field');
            return null;
        }
        
        return {
            faq,
            brandVoice,
            question
        };
    } catch (error) {
        showError('Error preparing request data');
        return null;
    }
}

// Make API request
async function makeAPIRequest(data) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                error: result.error || `HTTP ${response.status}: ${response.statusText}`
            };
        }
        
        return {
            success: true,
            data: result
        };
    } catch (error) {
        throw new Error(`Failed to connect to server: ${error.message}`);
    }
}

function showResults(data) {
    elements.answerOutput.textContent = data.answer || 'No answer generated';
    
    if (data.sources && data.sources.length > 0) {
        elements.sourcesOutput.innerHTML = data.sources
            .map(source => `<span class="source-tag">${escapeHtml(source)}</span>`)
            .join('');
    } else {
        elements.sourcesOutput.innerHTML = '<em>No sources identified</em>';
    }
    
    const latency = data.latencyMs || 0;
    elements.latencyOutput.textContent = `${latency}ms`;
    
    elements.results.style.display = 'block';
    
    elements.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.error.style.display = 'block';
    elements.error.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
    elements.results.style.display = 'none';
}

function hideError() {
    elements.error.style.display = 'none';
}

function setLoadingState(isLoading) {
    elements.generateBtn.disabled = isLoading;
    
    if (isLoading) {
        elements.btnText.style.display = 'none';
        elements.btnLoading.style.display = 'inline-flex';
    } else {
        elements.btnText.style.display = 'inline';
        elements.btnLoading.style.display = 'none';
    }
}

function handleReset() {
    if (confirm('Reset all fields to default values?')) {
        loadSeedData();
        hideResults();
        hideError();
        elements.faqInput.focus();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    showError('An unexpected error occurred. Please try again.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showError('An unexpected error occurred. Please try again.');
    event.preventDefault();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SEED_DATA,
        validateInputs,
        prepareRequestData,
        escapeHtml
    };
}
