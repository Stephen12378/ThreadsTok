import { Model, IPost } from '@/types/types';
import { AI } from '../ai';
import { R2Storage } from '../r2';
import { db } from '@/lib/prisma';

export abstract class ISocial {
  private ai: AI = new AI(Model.OPENAI);
  private r2: R2Storage = new R2Storage();

  async createPost(postId: number) {
    const existingPost = await db.getPost(postId);

    if (existingPost) {
      return existingPost;
    }

    const post = await this.getPostFromSource(postId);
    const summary = await this.ai.generateJson(post.systemPrompt, post.prompt);
    const voiceOver = await this.generateVoiceOver(summary.slides);

    const newPost = {
      ...post,
      title: summary.title,
      slides: summary.slides,
      voiceOver,
    };

    await db.createPost(newPost as IPost);

    return newPost;
  }

  private async generateVoiceOver(slides: string[]) {
    const uuid = crypto.randomUUID();

    await Promise.all(
      slides.map(async (slide: string, index: number) => {
        const audio = await this.ai.generateVoiceover(slide);
        this.r2.uploadAudio(Buffer.from(await audio.arrayBuffer()), uuid, `${index}.mp3`, 'audio/mpeg');

        return uuid;
      })
    );

    return uuid;
  }

  abstract getPostFromSource(postId: number): Promise<Partial<IPost> & { systemPrompt: string; prompt: string }>;
}
