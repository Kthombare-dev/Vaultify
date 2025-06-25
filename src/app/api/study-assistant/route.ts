import { NextResponse } from "next/server";

// Cache for storing paper content
const paperContentCache = new Map<string, { content: string | ArrayBuffer; isImage: boolean; mimeType: string }>();

// Rate limiting
const REQUESTS_PER_MINUTE = 10;
const requestTimestamps: number[] = [];

function canMakeRequest(): boolean {
  const now = Date.now();
  // Remove timestamps older than 1 minute
  const oneMinuteAgo = now - 60000;
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }
  return requestTimestamps.length < REQUESTS_PER_MINUTE;
}

async function getFileType(url: string): Promise<string> {
  try {
    // Remove query parameters from the URL
    const urlWithoutParams = url.split('?')[0];
    // Get the last part of the path
    const fileName = urlWithoutParams.split('/').pop() || '';
    // Get the extension
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    console.log('File type detection:', { fileName, extension });
    return extension;
  } catch (error) {
    console.error('Error getting file type:', error);
    return '';
  }
}

async function fetchPaperContent(fileUrl: string): Promise<{ content: string | ArrayBuffer; isImage: boolean; mimeType: string }> {
  try {
    const fileType = await getFileType(fileUrl);
    console.log('Detected file type:', fileType);
    
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType);
    console.log('Content type:', isImage ? 'image' : 'text');
    
    // Determine the correct MIME type
    let mimeType = 'text/plain';
    if (isImage) {
      switch (fileType) {
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
      }
    }
    
    // Fetch the content
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to fetch content');
    
    if (isImage) {
      // For images, keep as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      return { content: arrayBuffer, isImage: true, mimeType };
    } else {
      // For text files, decode to string
      const arrayBuffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(arrayBuffer);
      console.log('Processing text file:', { fileType, contentLength: text.length });
      return { content: text, isImage: false, mimeType };
    }
  } catch (error: unknown) {
    console.error('Error fetching paper content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to process ${fileUrl}: ${errorMessage}`);
  }
}

async function generateGeminiResponse(prompt: string, content: string | ArrayBuffer, isImage: boolean, mimeType: string = 'text/plain') {
  try {
    if (!canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }
    
    requestTimestamps.push(Date.now());

    // Use different models for image and text content
    const model = isImage ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    
    let body;
    if (isImage) {
      // Convert ArrayBuffer to base64 and ensure proper formatting
      const base64Data = Buffer.from(content as ArrayBuffer).toString('base64');
      
      // Create the request body according to Gemini's API structure
      body = {
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: prompt
            }
          ]
        }]
      };

      // Log the first few characters of base64 to verify format
      console.log('Image data preview:', base64Data.substring(0, 50));
    } else {
      // For text, use the existing format
      body = {
        contents: [{
          parts: [{
            text: `${prompt}\n\nContent to analyze:\n${content}`
          }]
        }]
      };
    }

    console.log(`Using model: ${model} for ${isImage ? 'image' : 'text'} content with mimeType: ${mimeType}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error details:', errorData);
      
      // Handle quota exceeded error specifically
      if (errorData.error?.code === 429) {
        throw new Error('API quota exceeded. Please try again later or upgrade your API plan.');
      }
      
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response status:', response.status);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate AI response: ${errorMessage}`);
  }
}

export async function POST(request: Request) {
  try {
    const { action, papers, question } = await request.json();

    switch (action) {
      case "select_papers": {
        if (!papers || !Array.isArray(papers) || papers.length === 0) {
          return NextResponse.json({ error: "At least one paper is required" }, { status: 400 });
        }

        try {
          const processedPapers = [];
          let combinedInsights = "";

          // Process each paper
          for (const { paperId, fileUrl } of papers) {
            if (!paperId || !fileUrl) {
              throw new Error("Paper ID and URL are required for each paper");
            }

            // Fetch and cache paper content if not already cached
            if (!paperContentCache.has(paperId)) {
              console.log("Processing paper:", { paperId, fileUrl });
              const { content, isImage, mimeType } = await fetchPaperContent(fileUrl);
              
              if (!content) {
                throw new Error(`Failed to extract content from file: ${fileUrl}`);
              }
              
              // Store content and type information directly
              paperContentCache.set(paperId, { content, isImage, mimeType });

              const initialPrompt = `You are a professional study assistant who has just received a ${isImage ? 'image' : 'document'} to analyze. 
This is one of multiple papers selected by the student.

Please analyze the content thoroughly and provide a brief, focused summary that:
1. Identifies the main subject or topic in plain text (no bold, italics, or other formatting)
2. Lists 2-3 key concepts covered in natural language
3. Uses a professional, conversational tone as if speaking directly to the student
4. Avoids any special characters or formatting (like **, ##, _, or bullet points)

Keep the response concise and natural, as it will be combined with insights from other papers.`;

              const paperInsights = await generateGeminiResponse(initialPrompt, content, isImage, mimeType);
              combinedInsights += `\n\nPaper Analysis:\n${paperInsights}`;
              processedPapers.push(paperId);
            }
          }

          // Generate a combined analysis if we have new insights
          if (combinedInsights) {
            const finalPrompt = `You are a professional study assistant. Based on the individual paper analyses below, provide a welcoming, professional response that:
1. Starts with a warm, natural greeting acknowledging that you've analyzed their materials
2. Presents key topics and connections between papers in a conversational way
3. Uses natural language without any special formatting or symbols
4. Writes numbers and lists in a natural way (e.g., "First," "Second," or "The first concept is...")
5. Maintains a professional yet friendly tone as if having a face-to-face conversation
6. Concludes by suggesting how you can help them study these materials together

Remember:
- Write as if you're speaking directly to the student
- Avoid any markdown formatting (**, ##, _, etc.)
- Use natural paragraph breaks instead of bullet points
- Present lists in a flowing, narrative style
- Keep the tone warm and professional

Individual paper analyses:${combinedInsights}`;

            const finalInsights = await generateGeminiResponse(finalPrompt, combinedInsights, false, 'text/plain');

            return NextResponse.json({ 
              message: "Papers processed successfully",
              processedPapers,
              initialInsights: finalInsights
            });
          }

          return NextResponse.json({ 
            message: "Papers already processed",
            processedPapers
          });
        } catch (error: unknown) {
          console.error("Error processing papers:", error);
          return NextResponse.json({ 
            error: `Failed to process papers: ${error instanceof Error ? error.message : String(error)}` 
          }, { status: 500 });
        }
      }

      case "ask_question": {
        if (!papers || !Array.isArray(papers) || papers.length === 0 || !question) {
          return NextResponse.json({ error: "Papers and question are required" }, { status: 400 });
        }

        try {
          let combinedContent = "";
          let isAnyImage = false;

          // Combine content from all papers
          for (const { paperId } of papers) {
            const cachedData = paperContentCache.get(paperId);
            if (!cachedData) {
              return NextResponse.json({ error: `Paper ${paperId} not found in cache. Please reselect the papers.` }, { status: 404 });
            }

            const { content, isImage, mimeType } = cachedData;
            combinedContent += `\n\nPaper ${paperId} content:\n${content}`;
            isAnyImage = isAnyImage || isImage;
          }
          
          const questionPrompt = `You are a professional study assistant helping a student understand multiple course materials. 
The student asks: "${question}"

Please provide a clear, well-structured response that:
1. Uses natural, conversational language as if speaking directly to the student
2. Organizes information in clear paragraphs with natural transitions
3. Presents lists and steps in a narrative format (e.g., "First," "Next," "Finally")
4. References specific papers naturally within the conversation
5. Compares and contrasts information from different papers when appropriate
6. Maintains a warm, professional tone throughout
7. Avoids any special formatting characters or markdown syntax (**, ##, _, etc.)

Remember to:
- Write as if having a face-to-face conversation
- Use natural paragraph breaks
- Present information in a flowing, narrative style
- Keep explanations clear and approachable
- Use everyday language while maintaining professionalism

Based on the combined content from multiple papers:
${combinedContent}`;

          const answer = await generateGeminiResponse(questionPrompt, combinedContent, isAnyImage, 'text/plain');
          return NextResponse.json({ answer });
        } catch (error) {
          console.error("Error processing question:", error);
          return NextResponse.json({ 
            error: `Failed to process question: ${error instanceof Error ? error.message : String(error)}` 
          }, { status: 500 });
        }
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in study assistant API:", error);
    return NextResponse.json({ 
      error: `An error occurred: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
} 