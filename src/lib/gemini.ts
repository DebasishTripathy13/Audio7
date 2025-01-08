import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateSummaryFromAudio(audioBlob: Blob) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
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
        text: `## Objective
Generate comprehensive academic lecture notes using the following structured format:

## Prompt Instructions:
1. Carefully analyze the lecture/audio content
2. Create a detailed, scholarly document with the following sections:

### 1. Comprehensive Summary
- Provide a comprehensive narrative overview
- Capture the core thesis and main arguments
- Contextualize the lecture's academic significance

### 2. Key Points
- Identify and elaborate on 5-7 primary conceptual points
- Include:
  - Precise definitions
  - Theoretical foundations
  - Critical analytical insights

### 3. Detailed Content Breakdown
- Segment the lecture into 2-3 major subsections
- For each subsection:
  - Provide in-depth analysis
  - Include supporting research
  - Highlight critical arguments

### 4. Action Items
- Academic research recommendations
- Potential research questions
- Practical application strategies

### 5. Terminology and References
- Compile a comprehensive glossary
- List key scholarly references
- Create a reference table with:
  - Term
  - Definition
  - Source
  - Academic significance

### 6. Critical Analysis Section
- Synthesize most transformative insights
- Discuss broader intellectual implications
- Identify potential research directions

### 7. External Resources
- Recommend additional reading materials
- Include academic database references
- Provide links to supplementary sources

### 8. Formatting Guidelines
- Use markdown formatting
- Maintain academic writing style
- Ensure clarity and scholarly precision

### 9. Metadata
- Indicate lecture context
- Note complexity level
- Tag interdisciplinary connections

## Submission Requirements:
- Minimum length: 1000 words
- Maximum length: 2500 words
- Use APA or specified citation style
- Demonstrate critical thinking
- Maintain academic rigor

## Special Instructions:
- Focus on intellectual depth
- Balance descriptive and analytical approaches
- Highlight innovative concepts
- Maintain objective scholarly tone

### Evaluation Criteria:
- Comprehensiveness
- Analytical depth
- Scholarly presentation
- Critical insight
- Clarity of exposition

---

### Template Completion Prompt:
"Based on the provided lecture/audio content, generate comprehensive academic notes following the above structured guidelines. Ensure thorough coverage, scholarly analysis, and intellectual depth."`
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}