/**
 * PDF Text Extraction using pdf.js with Vite worker bundling
 */
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
// Import the worker as a URL so Vite bundles it correctly
// Note: pdfjs v5 uses .mjs worker filename
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

export async function extractPDFText(file: File): Promise<{ text: string; pageCount: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;

    let fullText = '';

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as any[])
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    console.log(`Extracted ${fullText.length} characters from ${pageCount} pages`);
    return { text: fullText.trim(), pageCount };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return { text: '', pageCount: 0 };
  }
}
