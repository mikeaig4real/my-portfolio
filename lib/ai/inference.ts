import OpenAI from 'openai';
import config from '@/config';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface InferenceOptions {
  apiKey?: string;
  provider?: 'openrouter' | 'openai' | 'ollama';
  model?: string;
  temperature?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response_format?: any;
  returnRaw?: boolean;
}

export async function runInference(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  opts: InferenceOptions = {}
): Promise<string | OpenAI.Chat.Completions.ChatCompletion> {
  const provider = opts.provider || config.ai.provider || 'openrouter';
  const apiKey = opts.apiKey || config.ai.openrouterApiKey || process.env.OPENROUTER_API_KEY || 'dummy_key';

  let modelId = opts.model || config.ai.model;
  if (!modelId) {
    if (provider === 'openai') {
      modelId = 'gpt-4o-mini';
    } else if (provider === 'ollama') {
      modelId = 'llama3.2';
    } else {
      modelId = 'google/gemini-2.5-flash';
    }
  }
  const temperature = opts.temperature ?? 0.2;
  const responseFormat = opts.response_format || { type: 'json_object' };

  let baseURL = OPENROUTER_BASE_URL;
  let headers: Record<string, string> = {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Neobrutalist Bento Portfolio',
  };

  if (provider === 'ollama') {
    baseURL = `${config.ai.ollamaBaseUrl || 'http://127.0.0.1:11434'}/v1`;
    headers = {};
  } else if (provider === 'openai') {
    baseURL = 'https://api.openai.com/v1';
    headers = {};
  }

  const client = new OpenAI({
    baseURL,
    apiKey,
    defaultHeaders: headers,
  });

  const completion = await client.chat.completions.create({
    model: modelId,
    messages,
    temperature,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response_format: responseFormat as any,
  });

  if (opts.returnRaw) {
    return completion;
  }

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Received empty response from AI inference provider.');
  }

  return content;
}
