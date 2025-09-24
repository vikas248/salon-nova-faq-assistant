# Design Document - TRI AI Solutions Demo

## Architecture Overview

This full-stack application follows a clean, layered architecture with clear separation of concerns:

**Frontend Architecture:**
```
User Interface → JavaScript (app.js) → API Calls → Backend Services
```

**Backend Architecture:**
```
HTTP Request → Routes → Controllers → Services → Response
```

### Key Design Decisions

#### 1. **Modular Structure**
**Backend:**
- **Routes**: Handle HTTP routing and basic request validation
- **Controllers**: Orchestrate business logic, manage request/response flow
- **Services**: Core business logic separated into domain-specific modules

**Frontend:**
- **HTML**: Semantic, accessible structure with proper form elements
- **CSS**: Modern styling with responsive design and accessibility features
- **JavaScript**: Clean separation of concerns with error handling and user feedback

**Rationale**: Enables easy testing, maintenance, and future scaling

#### 2. **FAQ Grounding Strategy**
- **Approach**: Keyword-based matching with relevance scoring
- **Implementation**: 
  - Parse FAQ into structured Q&A pairs with generated IDs
  - Map user questions to FAQ content using keyword dictionaries
  - Score relevance and return top matches
- **Trade-off**: Simple but effective vs. more sophisticated semantic matching

#### 3. **Brand Voice Application**
- **Approach**: Rule-based text transformation
- **Implementation**:
  - Sentence shortening (split on conjunctions)
  - Jargon removal (simple word replacement)
  - Consistent signoff application
- **Trade-off**: Predictable results vs. more nuanced voice modeling

#### 4. **Answer Composition**
- **Strategy**: Pattern-based composition with fallback
- **Implementation**: Detect question patterns and compose targeted responses
- **Example**: Saturday + appointment → hours info + walk-in policy + recommendation

#### 5. **Frontend User Experience**
- **Approach**: Modern, accessible single-page interface
- **Implementation**:
  - Pre-filled forms with seed data for immediate testing
  - Real-time validation and error handling
  - Loading states and user feedback
  - Responsive design for all device sizes
- **Accessibility**: WCAG compliance with proper labels, keyboard navigation, and screen reader support

## Technical Choices

### Framework: Express.js
- **Why**: Lightweight, well-established, excellent for APIs
- **Alternatives considered**: Fastify (performance), Koa (modern syntax)
- **Decision**: Express for familiarity and ecosystem

### Data Processing: In-Memory
- **Why**: Meets demo requirements, simple deployment
- **Trade-off**: No persistence vs. quick setup and testing
- **Future**: Would add database for production use

### Frontend: Vanilla JavaScript + CSS
- **Why**: No build process needed, immediate deployment, lightweight
- **Alternatives considered**: React (component model), Vue (simplicity)
- **Decision**: Vanilla JS for simplicity and to avoid build complexity
- **Styling**: Modern CSS with CSS Grid, Flexbox, and custom properties

### Error Handling
- **Approach**: Centralized error middleware with graceful degradation
- **Implementation**: Try-catch in controllers, fallback answers for missing data
- **Monitoring**: Basic console logging (would add structured logging in production)

## Grounding Implementation

### FAQ Parsing
```javascript
// Simple regex-based parsing
Q: question text → { id: "generated-id", question: "...", answer: "..." }
```

### Relevance Scoring
```javascript
// Keyword matching with categories
{
  'saturday': ['saturday', 'sat', 'weekend'],
  'hours': ['hours', 'open', 'time', 'when'],
  // ...
}
```

### Source Tracking
- Each FAQ item gets a generated ID based on question keywords
- Sources array returned with answer for transparency

## Brand Voice Processing

### Style Rules Implementation
1. **Short sentences**: Split on conjunctions, semicolons
2. **Avoid jargon**: Simple word replacement dictionary
3. **Friendly nudge**: Context-aware recommendations (e.g., "Booking is recommended")

### Tone Application
- Warm: Use inclusive language ("we", "welcome")
- Concise: Prefer shorter constructions
- Reassuring: Add helpful context and next steps

## Performance Considerations

### Current Performance
- **Latency**: ~10-50ms for typical requests
- **Memory**: Minimal footprint, all processing in-memory
- **Scalability**: Single-threaded, suitable for demo load

### Bottlenecks Identified
1. **FAQ parsing**: Done on every request (could cache)
2. **String processing**: Multiple regex operations
3. **No connection pooling**: Not applicable for current implementation

## What Would Change With More Time

### Immediate Improvements (1-2 days)
1. **Caching**: Cache parsed FAQ data
2. **Better parsing**: Handle more FAQ formats
3. **Enhanced testing**: Unit tests for all services
4. **Input validation**: JSON schema validation

### Medium-term Enhancements (1 week)
1. **Semantic search**: Use embeddings for better matching
2. **Advanced NLP**: Better sentence boundary detection
3. **Configuration**: External config for keyword mappings
4. **Monitoring**: Structured logging, metrics

### Long-term Evolution (1 month+)
1. **Machine Learning**: Train models on brand voice examples
2. **Multi-tenant**: Support multiple brand voices
3. **Real-time learning**: Adapt based on user feedback
4. **Advanced grounding**: Knowledge graph integration

## Security & Production Readiness

### Current Security
- **Helmet.js**: Basic security headers
- **CORS**: Cross-origin request handling
- **Input limits**: JSON payload size limits

### Production Additions Needed
- **Authentication**: API key or JWT-based auth
- **Rate limiting**: Prevent abuse
- **Input sanitization**: Prevent injection attacks
- **HTTPS**: TLS termination
- **Environment variables**: Secure configuration management

## Testing Strategy

### Current Testing
- Manual testing with curl commands
- Health check endpoint

### Comprehensive Testing Plan
```javascript
// Unit tests
- faqService.parseFAQ()
- faqService.findRelevantAnswers()
- brandVoiceService.generateAnswer()

// Integration tests  
- POST /api/generate with various inputs
- Error handling scenarios
- Edge cases (empty FAQ, malformed JSON)

// Performance tests
- Load testing with concurrent requests
- Memory usage profiling
```

## Deployment Considerations

### Current Deployment
- Simple `npm start`
- Single process, no orchestration

### Production Deployment
```dockerfile
# Docker containerization
FROM node:18-alpine
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Infrastructure
- **Container orchestration**: Kubernetes or Docker Swarm
- **Load balancing**: NGINX or cloud load balancer
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK stack or cloud logging service

## Conclusion

This implementation prioritizes **simplicity and clarity** over sophistication, making it easy to understand, test, and extend. The modular architecture provides a solid foundation for future enhancements while meeting all current requirements.

The keyword-based grounding approach, while simple, effectively handles the demo scenarios and provides a clear path to more advanced semantic matching in the future.
