# TRI AI Solutions Demo - Salon Nova Full-Stack Application

A full-stack web application that generates grounded, brand-voice-consistent answers for FAQ queries. Features a modern, accessible frontend interface and a robust backend API.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Setup

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`

### Access the Application
- **Frontend Interface**: `http://localhost:3000` (Web UI)
- **API Endpoint**: `http://localhost:3000/api/generate` (Direct API access)
- **Health Check**: `http://localhost:3000/health`

### Using the Web Interface
1. Open `http://localhost:3000` in your browser
2. The form will be pre-filled with the demo data (FAQ, Brand Voice, and Question)
3. Click "Generate Answer" to test the provided question
4. View the generated answer, sources used, and response time
5. Use "Reset to Defaults" to restore the original demo data

## Testing the Provided Question

### Sample Request
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "brandVoice": {
      "tone": "Warm, concise, reassuring",
      "style_rules": [
        "Use short sentences.",
        "Avoid jargon.",
        "End with a friendly nudge if suitable."
      ],
      "signoff": "— Salon Nova"
    },
    "faq": "Q: What services do you offer?\nA: Haircuts, coloring, styling, and keratin treatments.\nQ: What are your hours?\nA: Mon–Fri 9am–6pm, Sat 10am–4pm, closed Sunday.\nQ: Do you accept walk-ins?\nA: We prefer appointments, but walk-ins are welcome if a stylist is free.\nQ: How can I book?\nA: Use our website or call 555-0148. We require a credit card to hold your slot.\nQ: Cancellation policy?\nA: Cancel or reschedule at least 12 hours in advance to avoid a $20 fee.",
    "question": "Are you open on Saturdays, and can I come without an appointment?"
  }'
```

### Expected Response
```json
{
  "answer": "Yes, we're open Saturdays 10am–4pm. Walk-ins are welcome if a stylist is free. Booking is recommended. — Salon Nova",
  "sources": ["what-are", "do-you"],
  "latencyMs": 15
}
```

## API Endpoints

### POST /api/generate
Generates a grounded answer based on FAQ content and brand voice.

**Request Body:**
```json
{
  "brandVoice": {
    "tone": "string",
    "style_rules": ["string"],
    "signoff": "string"
  },
  "faq": "string (raw FAQ text)",
  "question": "string"
}
```

**Response:**
```json
{
  "answer": "string (generated answer)",
  "sources": ["string (FAQ IDs used)"],
  "latencyMs": "number"
}
```

### GET /health
Health check endpoint.

## Project Structure

```
├── server.js              # Main server file
├── public/                # Frontend static files
│   ├── index.html         # Main web interface
│   ├── styles.css         # Modern, accessible styling
│   └── app.js            # Frontend JavaScript logic
├── routes/
│   └── generateRoutes.js   # API routes
├── controllers/
│   └── generateController.js # Request handling logic
├── services/
│   ├── faqService.js       # FAQ parsing and grounding
│   └── brandVoiceService.js # Brand voice application
├── package.json
├── README.md
└── DESIGN.md
```

## Additional Test Questions

### Booking Question
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "brandVoice": {
      "tone": "Warm, concise, reassuring",
      "style_rules": ["Use short sentences.", "Avoid jargon."],
      "signoff": "— Salon Nova"
    },
    "faq": "Q: How can I book?\nA: Use our website or call 555-0148. We require a credit card to hold your slot.",
    "question": "How do I book an appointment?"
  }'
```

## Trade-offs & Known Gaps

### Current Implementation
- **Simple keyword matching**: Uses basic string matching for FAQ grounding
- **In-memory processing**: No database, all processing happens in memory
- **Static FAQ parsing**: Assumes consistent Q:/A: format
- **Basic brand voice**: Simple sentence splitting and jargon removal

### Known Limitations
- No fuzzy matching or semantic similarity
- Limited to predefined keyword mappings
- No learning or adaptation capabilities
- Basic error handling for malformed input

### What Would Be Added With More Time
- Semantic search using embeddings (e.g., OpenAI embeddings)
- More sophisticated NLP for answer composition
- Database integration for persistent FAQ storage
- Advanced brand voice modeling
- Comprehensive test suite
- Rate limiting and authentication
- Logging and monitoring
- Docker containerization

## Development

### Running Tests
```bash
npm test
```

### Code Structure
- **Routes**: Handle HTTP routing and basic validation
- **Controllers**: Orchestrate business logic and handle requests/responses  
- **Services**: Core business logic for FAQ processing and brand voice application
- **Separation of Concerns**: Clear separation between HTTP handling, business logic, and data processing
