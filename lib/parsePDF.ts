import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js';

// Polyfill structuredClone to handle null options argument, which breaks in Hermes/ungap
const originalStructuredClone = globalThis.structuredClone;
globalThis.structuredClone = function(val: any, options?: any) {
  return originalStructuredClone ? originalStructuredClone(val, options || undefined) : JSON.parse(JSON.stringify(val));
};

// Load the exact worker matching the imported library to run in the main thread (Hermes)
(globalThis as any).pdfjsWorker = pdfjsWorker;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'dummy';

export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableFontFace: true,
    disableRange: true,
    disableStream: true,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}
