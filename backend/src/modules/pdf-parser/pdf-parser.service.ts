import { Injectable, Logger, Inject } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { ParsedStatementDto } from './dto/parsed-statement.dto';
import { LLMServiceInterface, LLM_SERVICE } from '../llm/llm.interface';
import {
  BANK_STATEMENT_SYSTEM_INSTRUCTION,
  createBankStatementPrompt,
} from '../../common/constants/prompts';
import {
  validateAndTransformResult,
  validateReconciliation,
} from '../../common/utils';

export interface ProgressCallback {
  (progress: number, message?: string): Promise<void>;
}

@Injectable()
export class PdfParserService {
  private readonly logger = new Logger(PdfParserService.name);

  constructor(
    @Inject(LLM_SERVICE) private readonly llmService: LLMServiceInterface,
  ) {}

  async extractTextFromPdf(
    buffer: Buffer,
    progressCallback?: ProgressCallback,
  ): Promise<string> {
    try {
      this.logger.log('Extracting text from PDF');

      if (progressCallback) {
        await progressCallback(25, 'Starting PDF text extraction');
      }

      const data = await pdfParse(buffer);

      if (progressCallback) {
        await progressCallback(
          35,
          `PDF parsing completed: ${data.text.length} characters extracted`,
        );
      }

      return data.text;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to extract text from PDF: ${errorMessage}`);
      throw new Error('Failed to parse PDF file');
    }
  }

  async parseBankStatement(
    pdfBuffer: Buffer,
    progressCallback: ProgressCallback,
  ): Promise<ParsedStatementDto> {
    try {
      await progressCallback(15, 'Starting bank statement parsing');

      const pdfText = await this.extractTextFromPdf(
        pdfBuffer,
        progressCallback,
      );
      this.logger.debug('PDF text extracted successfully');

      await progressCallback(45, 'Preparing LLM analysis prompt');

      await progressCallback(55, 'Sending data to LLM for analysis');

      const response = await this.llmService.createResponse(
        BANK_STATEMENT_SYSTEM_INSTRUCTION,
        createBankStatementPrompt(pdfText),
      );

      await progressCallback(70, 'Processing LLM response');

      const parsedResult = JSON.parse(response);

      await progressCallback(75, 'Validating extracted data structure');

      const validatedResult = validateAndTransformResult(parsedResult);

      await progressCallback(85, 'Performing reconciliation calculations');

      validateReconciliation(validatedResult);

      await progressCallback(
        95,
        `Processing complete: ${validatedResult.transactions?.length || 0} transactions extracted`,
      );

      return validatedResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to parse bank statement: ${errorMessage}`);
      throw new Error('Failed to parse bank statement');
    }
  }
}
