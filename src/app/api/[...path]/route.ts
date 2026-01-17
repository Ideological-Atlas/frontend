import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/env';

const EXTERNAL_API_URL = env.NEXT_PUBLIC_API_BASE_URL;

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathString = path.join('/');

  if (pathString.startsWith('_next')) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let body: string | undefined = undefined;

  const contentType = request.headers.get('content-type');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (contentType?.includes('application/json')) {
      body = JSON.stringify(await request.json());
    } else {
      body = await request.text();
    }
  }

  try {
    const targetUrl = `${EXTERNAL_API_URL}/api/${pathString}/` + (request.nextUrl.search || '');

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
    });

    if (response.status === 204) {
      return new NextResponse(null, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      });
    }

    const responseData = await response.arrayBuffer();

    const nextResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });

    return nextResponse;
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
