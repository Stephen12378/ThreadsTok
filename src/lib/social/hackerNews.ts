import { ISocial } from './base';
import parser from 'metadata-scraper';
import axios from 'axios';
import { HackerNewsPost, IPost } from '@/types/types';

const GET_POST_API_URL = 'https://hn.algolia.com/api/v1/items';

const SUMMARIZE_HN_POST_SYSTEM_PROMPT = `
You are a skilled content creator with a knack for turning Hacker News discussions into compelling, 
TikTok-style video scripts. Your goal is to craft 2-4 engaging narrative paragraphs that distill the most intriguing 
insights, debates, and takeaways from HN discussions into bite-sized, high-impact storytelling. 
Each paragraph should push the narrative forward without redundancy, 
ensuring every moment in the video delivers fresh, valuable content. 
Keep the tone sharp, informative, and designed for fast-paced digital consumption.

## Target Audience  
- Hacker News users who prefer digesting discussions through video content.  
- A technically savvy audience that values depth, precision, and nuance.  
- Viewers accustomed to HNs discussion style and familiar with technical concepts.  
- Keep each slide concise, delivering maximum insight with minimal fluff.
- Keep each slides text short (one to three brief sentences) to match a quick news delivery style.


**Output Example Format:**

## Output Format
{
  "title": "Clear, technical title capturing post essence",
  "slides": [
    "Core post overview and context...",
    "Technical details or key insights...",
    "Community discussion highlights...",
    "Additional context if needed...",
    "Final insights if warranted..."
  ]
}

Hacker news post -
`;

export class HackerNews extends ISocial {
  async getPostFromSource(postId: number) {
    const { data } = await axios.get(`${GET_POST_API_URL}/${postId}`);

    if (!data) {
      throw new Error('Post not found');
    }

    const prompt = await this.getPrompt(data);
    const comments = this.countComments(data);

    return {
      postId: data.id,
      source: 'HackerNews',
      title: data.title,
      description: data.text,
      url: data.url,
      author: data.author,
      likes: data.points || 0,
      comments: comments,
      createdAt: new Date(data.created_at_i * 1000),
      systemPrompt: SUMMARIZE_HN_POST_SYSTEM_PROMPT,
      prompt,
    } as Partial<IPost> & { systemPrompt: string; prompt: string };
  }

  private countComments(post: HackerNewsPost): number {
    let count = 0;

    count += post.children.length;
    for (const comment of post.children) {
      count += this.countComments(comment);
    }

    return count;
  }

  private async getPrompt(post: HackerNewsPost) {
    const { url, title, type, text, author, points, created_at_i, children } = post;
    const metaData = url ? await parser(url) : null;

    return `
    Title: ${title}
    Meta: ${metaData}
    URL: ${url}
    Author: ${author}
    Points: ${points}
    Created at: ${created_at_i}
    Type: ${type}
    Text: ${text}
    Comments: \n\n${this.formatCommentsToMarkdown(children)}
  `;
  }

  private formatCommentsToMarkdown(comments: HackerNewsPost[], indentLevel: number = 0): string {
    return comments.map((comment) => this.formatCommentToMarkdown(comment, indentLevel)).join('');
  }

  private formatCommentToMarkdown(comment: HackerNewsPost, indentLevel: number): string {
    const indent = '  '.repeat(indentLevel);
    let markdown = '';

    if (comment.text) {
      // Properly decode HTML entities and escape markdown special characters
      const decodedText = comment.text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x60;/g, '`')
        // Escape markdown special characters
        .replace(/([*_~`])/g, '\\$1');

      markdown += `${indent}- ${decodedText.trim()}\n`;
    } else {
      markdown += `${indent}- _(Empty Comment)_\n`;
    }

    if (comment.children?.length > 0 && indentLevel < 1) {
      markdown += this.formatCommentsToMarkdown(comment.children, indentLevel + 1);
    }

    return markdown;
  }
}
