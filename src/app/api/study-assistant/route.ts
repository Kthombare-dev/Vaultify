import { NextResponse } from "next/server";

// Cache for storing paper content
const paperContentCache = new Map<string, string>();

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

async function fetchPaperContent(fileUrl: string): Promise<{ content: string; isImage: boolean }> {
  try {
    const fileType = await getFileType(fileUrl);
    console.log('Detected file type:', fileType);
    
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType);
    console.log('Content type:', isImage ? 'image' : 'text');
    
    if (isImage) {
      // For images, fetch and convert to base64
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return { content: base64, isImage: true };
    } else {
      // For text files, fetch and decode the content
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch paper content');
      const arrayBuffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(arrayBuffer);
      console.log('Processing text file:', { fileType, contentLength: text.length });
      return { content: text, isImage: false };
    }
  } catch (error: unknown) {
    console.error('Error fetching paper content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to process ${fileUrl}: ${errorMessage}`);
  }
}

async function generateGeminiResponse(prompt: string, content: string, isImage: boolean) {
  try {
    if (!canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }
    
    requestTimestamps.push(Date.now());

    // Use different models for image and text content
    const model = isImage ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    
    const body = {
      contents: [
        {
          parts: isImage ? [
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: content
              }
            },
            {
              text: prompt
            }
          ] : [
            {
              text: `${prompt}\n\nContent to analyze:\n${content}`
            }
          ]
        }
      ]
    };

    console.log(`Using model: ${model} for ${isImage ? 'image' : 'text'} content`);
    console.log('Processing content:', { isImage, contentType: isImage ? 'image/jpeg' : 'text' });

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
    const { action, paperId, fileUrl, question } = await request.json();

    switch (action) {
      case "select_paper": {
        if (!paperId || !fileUrl) {
          return NextResponse.json({ error: "Paper ID and URL are required" }, { status: 400 });
        }

        try {
          // Fetch and cache paper content if not already cached
          if (!paperContentCache.has(paperId)) {
            console.log("Processing paper:", { paperId, fileUrl });
            const { content, isImage } = await fetchPaperContent(fileUrl);
            
            if (!content) {
              throw new Error('Failed to extract content from the file');
            }
            
            // Store both content and type information
            paperContentCache.set(paperId, JSON.stringify({ content, isImage }));

            const initialPrompt = `You are a professional study assistant who has just received a ${isImage ? 'image' : 'document'} to analyze. 

Please analyze the content thoroughly and provide a welcoming, professional response that:
1. Starts with a warm greeting acknowledging that you've analyzed their material
2. Briefly mentions 2-3 key topics you've identified, incorporating them naturally into your response
3. Maintains a professional yet approachable tone
4. Concludes by asking how you can help them study this material

For example, you might say something like:
"I've carefully reviewed your material on [subject]. I notice it covers several important concepts, including [topic 1] and [topic 2]. I'd be happy to help you understand these concepts better. Would you like to focus on a specific topic, or would you prefer a comprehensive overview of the material?"

Keep the response conversational and encouraging, but maintain a professional tone throughout. Avoid using any special formatting characters or markdown syntax.`;

            const initialInsights = await generateGeminiResponse(initialPrompt, content, isImage);

            return NextResponse.json({ 
              message: "Paper processed successfully",
              paperId,
              initialInsights
            });
          }

          return NextResponse.json({ 
            message: "Paper already processed",
            paperId 
          });
        } catch (error: unknown) {
          console.error("Error processing paper:", error);
          return NextResponse.json({ 
            error: `Failed to process paper: ${error instanceof Error ? error.message : String(error)}` 
          }, { status: 500 });
        }
      }

      case "ask_question": {
        if (!paperId || !question) {
          return NextResponse.json({ error: "Paper ID and question are required" }, { status: 400 });
        }

        // Get paper content from cache
        const cachedData = paperContentCache.get(paperId);
        if (!cachedData) {
          return NextResponse.json({ error: "Paper not found in cache. Please reselect the paper." }, { status: 404 });
        }

        try {
          const { content, isImage } = JSON.parse(cachedData);
          
          const questionPrompt = `You are a professional study assistant helping a student understand their course material. 
The student asks: "${question}"

Please provide a clear, well-structured response that:
1. Uses natural, professional language (no markdown formatting like **, ##, or bullet points)
2. Organizes information in clear paragraphs
3. Uses proper transitions between ideas
4. Numbers any lists or steps naturally (e.g., "First," "Second," "Third," or "The first advantage...")
5. Maintains a professional yet conversational tone
6. Uses indentation for sub-points (using spaces, not special characters)

When listing multiple items:
- Start with an introductory sentence
- Present each item as a complete sentence or paragraph
- Use proper transitions between items
- Conclude with a summary if appropriate

Based on the content:
${content}`;

          const answer = await generateGeminiResponse(questionPrompt, content, isImage);
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