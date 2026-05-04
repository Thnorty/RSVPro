import { extractText } from 'expo-pdf-text-extract';

export async function extractTextFromPDF(filePath: string): Promise<string> {
  return await extractText(filePath);
}
