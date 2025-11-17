/**
 * PDF Text Extraction
 * Stub implementation - pdfjs-dist not installed
 */

export async function extractPDFText(file: File): Promise<{ text: string; pageCount: number }> {
  // Stub implementation - would require pdfjs-dist package
  console.log('PDF extraction not implemented:', file.name);
  return { text: '', pageCount: 0 };
}
