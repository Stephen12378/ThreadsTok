import { NextRequest, NextResponse } from 'next/server';

export type RouteHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

export interface HackerNewsPost {
  id: number;
  title?: string;
  text?: string;
  url?: string;
  type: string;
  author: string;
  points?: number;
  created_at_i: number;
  children: HackerNewsPost[];
}

export enum Model {
  OPENAI = 'openai',
  GOOGLE = 'google',
}

export interface IPost {
  id: number;
  postId: number;
  source: 'HackerNews' | 'Reddit' | 'Twitter';
  title: string;
  description?: string;
  url?: string;
  author: string;
  likes: number;
  comments: number;
  createdAt: string;
  slides: string[];
  voiceOver: string;
}

export interface AudioUploadResult {
  key: string;
  url: string;
  filename: string;
  contentType: string;
}
