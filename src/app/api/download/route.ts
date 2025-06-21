import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');
  const fileName = searchParams.get('name') || 'paper.pdf';

  if (!fileUrl) {
    return new NextResponse('URL parameter is missing', { status: 400 });
  }

  try {
    // Fetch the file from the Firebase URL on the server
    const fileResponse = await fetch(fileUrl);

    if (!fileResponse.ok) {
      return new NextResponse('Failed to fetch the file from storage', { status: fileResponse.status });
    }

    // Get the file as a ReadableStream
    const body = fileResponse.body as ReadableStream<Uint8Array>;

    // Create a new response to stream back to the client
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 