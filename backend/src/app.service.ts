import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Bank Statement Parser API',
      description:
        'API for parsing PDF bank statements and extracting structured data using LLM',
      version: '1.0.0',
      endpoints: [
        {
          path: '/api/parse-bank-statement',
          method: 'POST',
          description: 'Upload and parse a PDF bank statement',
        },
      ],
    };
  }
}
