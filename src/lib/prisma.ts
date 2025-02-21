import { PrismaClient } from '@prisma/client';
import { Post } from '@prisma/client';

export class PrismaDB {
  private client: PrismaClient;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.client = new PrismaClient();
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient();
      }
      this.client = global.prisma;
    }
  }

  async getPosts(page: number = 1, limit: number = 40): Promise<Post[]> {
    return this.client.post.findMany({
      orderBy: { id: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getPost(postId: number): Promise<Post | null> {
    return this.client.post.findUnique({
      where: { postId: postId },
    });
  }

  async createPost(data: {
    postId: number;
    source: string;
    title: string;
    description?: string;
    url?: string;
    author: string;
    likes?: number;
    comments?: number;
    slides?: string[];
    voiceOver?: string;
    createdAt?: Date | string;
  }): Promise<Post> {
    try {
      const post = await this.client.post.create({
        data: {
          postId: data.postId,
          source: data.source,
          title: data.title,
          description: data.description,
          url: data.url,
          author: data.author,
          likes: data.likes || 0,
          comments: data.comments || 0,
          slides: data.slides || [],
          voiceOver: data.voiceOver || '',
          createdAt: data.createdAt || new Date(),
        },
      });
      return post;
    } catch (error: unknown) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post', { cause: error });
    }
  }
}

// Export a singleton instance
export const db = new PrismaDB();
