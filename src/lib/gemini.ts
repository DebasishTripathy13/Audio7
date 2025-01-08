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
        text: `Please analyze the provided audio in **extreme detail** and generate a **comprehensive, in-depth, and highly structured document** in markdown format. The output should be as long and detailed as possible, covering every aspect of the audio content. Include the following sections:

1. **Summary**: Provide a detailed overview of the audio, capturing the main ideas, context, purpose, and tone. Go beyond surface-level insights and explore nuances, underlying themes, and implications.
2. **Key Points**: Break the content into **exhaustive bullet points**, covering every significant idea, argument, or insight. Include sub-points for additional depth and context.
3. **Action Items**: Extract **all actionable tasks, recommendations, or next steps** mentioned in the audio. Provide detailed explanations for each action item, including why it matters and how to implement it.
4. **Key Terms & Concepts**: List and define **every important term, jargon, or concept** discussed. Provide detailed explanations, examples, and context for each term to ensure full understanding.
5. **References & Resources**: Include **all references, books, studies, tools, or external resources** mentioned in the audio. Add additional resources for further learning, including links, summaries, and why they are relevant.
6. **Highlights**: Create a "Quick Highlights" section at the top, summarizing the **most critical points** in 5-7 bullet points for easy scanning. Ensure these highlights are detailed and capture the essence of the audio.
7. **Quotes & Verbatim Excerpts**: Include **direct quotes or verbatim excerpts** from the audio that are particularly impactful, insightful, or noteworthy. Provide context for each quote.
8. **Analysis & Insights**: Add a section for **deeper analysis and insights**. Explore connections between ideas, potential implications, and any unanswered questions or areas for further exploration.
9. **Timestamps (if applicable)**: If the audio includes timestamps or references to specific sections, include them in the notes for easy navigation.

**Formatting Guidelines**:
- Use markdown for headings, bullet points, bold text, and code blocks (if applicable).
- Organize the content hierarchically, with clear sections and sub-sections.
- Use tables, lists, and other formatting tools to enhance readability.

**Goal**: The output should be a **thorough, exhaustive, and highly detailed document** that captures every aspect of the audio. It should serve as a **standalone resource** for understanding the content in depth, with no detail left unexplored.`
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}