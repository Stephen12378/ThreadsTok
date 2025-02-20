import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { openai as OpenAITTS } from 'orate/openai';
import { speak } from 'orate';
import { LanguageModelV1 } from 'ai';
import { Model } from '../types/types';
import { SpeechCreateParams } from 'openai/resources/audio/speech';
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const openai = createOpenAI({ apiKey: process.env.OPEN_AI_KEY });

export class AI {
  private model: LanguageModelV1;

  constructor(model: Model) {
    this.model = model === Model.GOOGLE ? google(process.env.GEMINI_MODEL!) : openai(process.env.OPEN_AI_MODEL!);
  }

  async generateJson(systemPrompt: string, prompt: string) {
    const result = await generateText({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });
    return JSON.parse(result.text);
  }

  async generateVoiceover(text: string) {
    const voices = ['alloy', 'ash', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer'];
    const randomVoice = voices[Math.floor(Math.random() * voices.length)] as SpeechCreateParams['voice'];

    return await speak({
      model: OpenAITTS.tts('tts-1', randomVoice, { response_format: 'opus' }),
      prompt: text,
    });
  }
}
