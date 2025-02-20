import { NextRequest, NextResponse } from 'next/server';
import { RouteHandler } from '../types/types';

export class HttpError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

export function withHttpError(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }

      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
