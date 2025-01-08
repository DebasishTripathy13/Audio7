import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateSummaryFromAudio(audioBlob: Blob) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert blob to base64
    const buffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: audioBlob.type,
          data: base64Audio
        }
      },
      { 
        text: `Please provide a detailed summary of this audio in markdown format make it as long as possible. 
        Include the following sections:
        1. Summary
        2. Key Points
        3. Action Items
        4. Notable References or Terms
        5. References for future studies or that might help in understanding alongside links to sources
        6.Create an important section where the most important poins or refferences are mentioned` 
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}