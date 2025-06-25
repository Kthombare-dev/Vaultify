import { NextResponse } from "next/server";

async function getFileType(file: File): Promise<string> {
  return file.name.split('.').pop()?.toLowerCase() || '';
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateGeminiResponse(prompt: string, content: string, isImage: boolean) {
  try {
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
      
      if (errorData.error?.code === 429) {
        throw new Error('API quota exceeded. Please try again later or upgrade your API plan.');
      }
      
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const fileType = await getFileType(file);
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType);
    
    let content: string;
    if (isImage) {
      const buffer = await fileToBuffer(file);
      content = buffer.toString('base64');
    } else {
      const buffer = await fileToBuffer(file);
      content = buffer.toString('utf-8');
    }

    const prompt = `You are a professional study assistant analyzing a ${isImage ? 'image' : 'document'} of an academic paper.

Please analyze the content and extract the following information in a structured format.

IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text.

Extract these fields:
1. Subject Name (e.g., "Data Structures", "Computer Networks")
2. Subject Code (e.g., "CS201", "IT301")
3. Paper Type (one of: "end-sem", "mid-semester-test 1", "mid-semester-test 2", "other")
4. Branch (one of: "Computer Science Engineering (CSE)", "Information Technology (IT)", "Electronics & Communication (EC)", "Electrical Engineering (EE)", "Mechanical Engineering (ME)", "Civil Engineering (CE)", "Chemical Engineering (CHE)", "Biotechnology (BT)", "Artificial Intelligence (AI)", "Data Science (DS)", "Cyber Security (CS)", "Other")
5. Semester (1-8)
6. Description (a brief 1-2 sentence description of the paper content)
7. Tags (comma-separated keywords)
8. College Name (e.g., "MIT College of Engineering", "COEP Technological University")
9. University Name (e.g., "Savitribai Phule Pune University", "Mumbai University")

Return EXACTLY this JSON structure with no additional text or formatting:
{
  "subjectName": "",
  "subjectCode": "",
  "paperType": "",
  "branch": "",
  "semester": "",
  "description": "",
  "tags": "",
  "collegeName": "",
  "universityName": ""
}

If you cannot determine any field with high confidence, leave it as an empty string. Do not make assumptions. Only include information that is clearly present in the content.`;

    const result = await generateGeminiResponse(prompt, content, isImage);
    
    try {
      // Clean up the response to handle potential markdown formatting
      const cleanedResult = result
        .replace(/```json\n?/g, '') // Remove ```json
        .replace(/```\n?/g, '')     // Remove closing ```
        .trim();                    // Remove any extra whitespace
      
      const parsedResult = JSON.parse(cleanedResult);
      
      // Validate the parsed result has the expected structure
      const expectedKeys = ['subjectName', 'subjectCode', 'paperType', 'branch', 'semester', 'description', 'tags', 'collegeName', 'universityName'];
      const hasAllKeys = expectedKeys.every(key => key in parsedResult);
      
      if (!hasAllKeys) {
        throw new Error('Response missing required fields');
      }
      
      return NextResponse.json(parsedResult);
    } catch (error) {
      console.error('Error parsing AI response as JSON:', error);
      console.error('Raw AI response:', result);
      return NextResponse.json({ error: "Failed to parse paper details" }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error processing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 