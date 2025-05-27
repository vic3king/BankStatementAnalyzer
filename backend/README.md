# PDF Parser Module

A NestJS module for parsing bank statement PDF files with background processing.

## Tech Stack

- **[NestJS](https://nestjs.com/)** - Node.js framework
- **[Bull.js](https://github.com/OptimalBits/bull)** - Queue management
- **[Redis](https://redis.io/)** - Queue storage
- **[PDF-Parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction

## Documentation

- [My API Documentation (Swagger)](http://localhost:3000/api) - Interactive API documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [Bull.js Documentation](https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md)
- [Redis Documentation](https://redis.io/docs/)

## Prerequisites

- Node.js 18+
- OPENAI key

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key
```

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the application:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## How to Test

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```