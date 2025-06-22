import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const name = request.nextUrl.searchParams.get('name');

    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse('Failed to fetch file', { status: response.status });
    }

    // Get the content type from the response
    const contentType = response.headers.get('content-type');
    const blob = await response.blob();

    // Create response with original content type and suggested filename
    const headers = new Headers({
      'Content-Type': contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name || 'download'}"`,
      'Cache-Control': 'no-cache'
    });

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; 