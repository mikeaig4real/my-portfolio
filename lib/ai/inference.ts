import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from '@/config';
import { logger } from '@/lib/logger';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const HTTP_REFERER = 'https://github.com/mikeaig4real/my-portfolio';
const X_TITLE = 'Michael Aigbovbiosa Portfolio - LLM Engine';

export interface ModelCapability {
  supportsTools: boolean;
  supportsStructuredOutputs: boolean;
  recommendedFallbackForTools?: string;
  recommendedFallbackForStructured?: string;
}

export const VERIFIED_CAPABLE_MODELS: Record<string, ModelCapability> = {
  // ── OpenRouter Models ───────────────────────────────────────────────────────────
  'google/gemini-2.5-flash': { supportsTools: true, supportsStructuredOutputs: true },
  'google/gemini-2.5-pro': { supportsTools: true, supportsStructuredOutputs: true },
  'google/gemini-2.0-flash-exp:free': { supportsTools: true, supportsStructuredOutputs: true },
  'openai/gpt-4o-mini': { supportsTools: true, supportsStructuredOutputs: true },
  'openai/gpt-4o': { supportsTools: true, supportsStructuredOutputs: true },
  'anthropic/claude-3.5-sonnet': { supportsTools: true, supportsStructuredOutputs: true },
  'anthropic/claude-3.5-haiku': { supportsTools: true, supportsStructuredOutputs: true },
  'meta-llama/llama-3.3-70b-instruct': { supportsTools: true, supportsStructuredOutputs: true },
  'qwen/qwen-2.5-72b-instruct': { supportsTools: true, supportsStructuredOutputs: true },

  // ── OpenAI Native Models ───────────────────────────────────────────────────────
  'gpt-4o-mini': { supportsTools: true, supportsStructuredOutputs: true },
  'gpt-4o': { supportsTools: true, supportsStructuredOutputs: true },
  'gpt-4-turbo': { supportsTools: true, supportsStructuredOutputs: true },

  // ── Ollama Local Verified Models ───────────────────────────────────────────────
  'llama3.2': { supportsTools: true, supportsStructuredOutputs: true },
  'llama3.2:latest': { supportsTools: true, supportsStructuredOutputs: true },
  'llama3.3': { supportsTools: true, supportsStructuredOutputs: true },
  'llama3.3:latest': { supportsTools: true, supportsStructuredOutputs: true },
  'qwen2.5': { supportsTools: true, supportsStructuredOutputs: true },
  'qwen2.5:latest': { supportsTools: true, supportsStructuredOutputs: true },
  'mistral-nemo': { supportsTools: true, supportsStructuredOutputs: true },

  // ── Known Incompatible / Non-Tool Calling Models in Ollama or OpenRouter ───────
  'gemma3': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'llama3.2:latest' },
  'gemma3:4b': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'llama3.2:latest' },
  'gemma2': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'llama3.2:latest' },
  'deepseek-r1': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'qwen2.5' },
  'deepseek-r1:8b': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'qwen2.5' },
  'deepseek-coder': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'qwen2.5' },
  'llama2': { supportsTools: false, supportsStructuredOutputs: false, recommendedFallbackForTools: 'llama3.2:latest' },
};

/**
 * Validates and dynamically resolves the most capable model based on provider and tool requirements.
 */
export function resolveCapableModel(
  requestedModel: string | undefined,
  provider: 'openrouter' | 'openai' | 'ollama',
  requiresTools: boolean = false
): string {
  const defaultModel =
    provider === 'openai'
      ? 'gpt-4o-mini'
      : provider === 'ollama'
      ? 'llama3.2:latest'
      : 'google/gemini-2.5-flash';

  const modelId = requestedModel || config.ai.model || defaultModel;
  const capability = VERIFIED_CAPABLE_MODELS[modelId];

  // If tools are required and model is known not to support tools, fall back to a capable model
  if (requiresTools && capability && !capability.supportsTools) {
    const fallback =
      capability.recommendedFallbackForTools ||
      (provider === 'ollama' ? 'llama3.2:latest' : provider === 'openai' ? 'gpt-4o-mini' : 'google/gemini-2.5-flash');

    logger.warn(
      `⚠️ Model "${modelId}" configured in environment does not support native Tool Calling. Automatically falling back to "${fallback}" for agent execution.`
    );
    return fallback;
  }

  return modelId;
}

export const OLLAMA_MODELS_SET = new Set<string>([
  'llama3.2',
  'llama3.2:latest',
  'llama3.3',
  'llama3.3:latest',
  'gemma3:4b',
  'deepseek-r1',
  'deepseek-r1:8b',
  'qwen2.5',
  'qwen2.5:latest',
  'mistral-nemo',
]);

export interface InferenceOptions {
  apiKey?: string;
  provider?: 'openrouter' | 'openai' | 'ollama';
  model?: string;
  temperature?: number;
  max_tokens?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response_format?: any;
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  tool_choice?: OpenAI.Chat.Completions.ChatCompletionToolChoiceOption;
  stream?: boolean;
  streamCb?: (chunk: string) => void;
  returnRaw?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
}

export interface StructuredInferenceOptions<T> {
  schema: z.ZodType<T>;
  schemaName: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  provider?: 'openrouter' | 'openai' | 'ollama';
  apiKey?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  maxRepairAttempts?: number;
}


/**
 * Utility to sleep with exponential backoff and random jitter.
 */
async function sleepWithJitter(baseDelayMs: number, attempt: number): Promise<void> {
  const delay = Math.min(baseDelayMs * Math.pow(2, attempt) + Math.random() * 400, 8000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Robust JSON cleaner: Strips markdown code fences, comments, and extra leading/trailing non-JSON characters.
 */
export function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();

  // Strip ```json ... ``` or ``` ... ``` code blocks
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.search(/[\{\[]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

/**
 * Helper to check if a buffered output is a raw JSON tool wrapper from small local models (like Llama 3.2).
 */
export function handleInterceptedJsonWrapper(
  buffer: string,
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[]
): { content: string | null; toolCall?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall } | null {
  const trimmed = buffer.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && parsed.name) {
      const toolName = parsed.name;
      const toolArgs = parsed.parameters || parsed.arguments || {};
      const isRegisteredTool =
        tools && tools.some((t) => 'function' in t && t.function?.name === toolName);


      if (isRegisteredTool) {
        return {
          content: null,
          toolCall: {
            id: `call_intercepted_${Math.random().toString(36).substring(2, 9)}`,
            type: 'function',
            function: {
              name: toolName,
              arguments: typeof toolArgs === 'string' ? toolArgs : JSON.stringify(toolArgs),
            },
          },
        };
      }
    }
  } catch {
    // Not valid JSON
  }

  return null;
}

/**
 * Agnostic, modular helper to check, parse, and execute tool calls requested by an LLM.
 * Updates the chat message history in-place with Assistant calls and Tool responses.
 */
export async function handleToolCalls(
  completion: OpenAI.Chat.Completions.ChatCompletion,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  toolMap: Record<string, Function>
): Promise<boolean> {
  const choice = completion.choices[0];
  const toolCalls = choice?.message?.tool_calls;

  if (!toolCalls || toolCalls.length === 0) {
    return false;
  }

  // Push assistant request containing the tool calls
  messages.push(choice.message);

  for (const toolCall of toolCalls) {
    if (toolCall.type === 'function') {
      const { name, arguments: rawArgs } = toolCall.function;
      let parsedArgs: Record<string, unknown> = {};
      try {
        parsedArgs = JSON.parse(rawArgs || '{}');
      } catch {
        parsedArgs = {};
      }

      logger.info(`[Tool Invocation] Calling "${name}"`, { args: parsedArgs });

      try {
        const func = toolMap[name];
        if (!func) {
          throw new Error(`Tool function "${name}" not found in toolMap.`);
        }

        const result = await func(parsedArgs);
        logger.info(`[Tool Result] Successfully executed "${name}"`);

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: typeof result === 'string' ? result : JSON.stringify(result),
        });
      } catch (err: unknown) {
        const error = err as Error;
        logger.error(`[Tool Error] Failed calling "${name}"`, { error: error.message });
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: error.message }),
        });
      }
    }
  }

  return true;
}

/**
 * Core LLM inference executor with automatic retry, jittered backoff, streaming callback,
 * generational constraints, Ollama tool fallbacks, and multi-provider headers.
 */
export async function runInference(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  opts: InferenceOptions = {}
): Promise<string | OpenAI.Chat.Completions.ChatCompletion> {
  const provider = opts.provider || config.ai.provider || 'openrouter';
  const apiKey = opts.apiKey || config.ai.openrouterApiKey || process.env.OPENROUTER_API_KEY || 'dummy_key';

  const requiresTools = Boolean(opts.tools && opts.tools.length > 0);
  const activeModelId = resolveCapableModel(opts.model, provider, requiresTools);
  const isTargetOllama = OLLAMA_MODELS_SET.has(activeModelId) || provider === 'ollama';


  const temperature = opts.temperature ?? 0.2;
  const maxRetries = opts.maxRetries ?? 3;

  let baseURL = OPENROUTER_BASE_URL;
  let headers: Record<string, string> = {
    'HTTP-Referer': HTTP_REFERER,
    'X-Title': X_TITLE,
  };

  if (isTargetOllama) {
    baseURL = `${config.ai.ollamaBaseUrl || 'http://127.0.0.1:11434'}/v1`;
    headers = {};
  } else if (provider === 'openai') {
    baseURL = 'https://api.openai.com/v1';
    headers = {};
  }

  const client = new OpenAI({
    baseURL,
    apiKey: isTargetOllama ? 'ollama' : apiKey,
    defaultHeaders: headers,
    timeout: opts.timeoutMs ?? 60000,
  });

  let lastError: unknown = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestPayload: any = {
        model: activeModelId,
        messages,
        temperature,
        max_tokens: opts.max_tokens,
        tools: opts.tools,
        tool_choice: opts.tool_choice,
        response_format: opts.response_format,
        stream: opts.stream ?? false,
      };

      if (isTargetOllama) {
        requestPayload.options = {
          num_ctx: 4096,
          ...(requestPayload.options || {}),
        };
      }

      const completion = await client.chat.completions.create(requestPayload);

      if (opts.returnRaw) {
        return completion as OpenAI.Chat.Completions.ChatCompletion;
      }

      // Handle Streaming Callback
      if (opts.stream && opts.streamCb) {
        let fullStreamText = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for await (const chunk of completion as any) {
          const deltaContent = chunk.choices[0]?.delta?.content || '';
          fullStreamText += deltaContent;
          if (opts.streamCb && deltaContent) {
            opts.streamCb(deltaContent);
          }
        }
        return fullStreamText;
      }

      // Handle Regular Completion
      if ('choices' in completion) {
        const content = completion.choices[0]?.message?.content;
        if (content === undefined || content === null) {
          // If tool calls are present but content is null, return empty or raw
          if (completion.choices[0]?.message?.tool_calls) {
            return '';
          }
          throw new Error('Received empty response from AI inference provider.');
        }
        return content;
      }

      return '';
    } catch (err: unknown) {
      lastError = err;
      const errorObj = err as { status?: number; code?: string; message?: string };
      const status = errorObj.status;

      // Check if error is retryable (429 Rate Limit, 500-599 server overloads, or network timeout)
      const isRetryable =
        !status || status === 429 || (status >= 500 && status <= 599) || errorObj.code === 'ETIMEDOUT';

      if (isRetryable && attempt < maxRetries - 1) {
        const backoffMs = 1000 * Math.pow(2, attempt);
        logger.warn(
          `AI Inference request attempt ${attempt + 1} failed (${errorObj.message || status}). Retrying in ${backoffMs}ms...`
        );
        await sleepWithJitter(1000, attempt);
        continue;
      }

      break;
    }
  }

  logger.error('AI Inference exhausted all retry attempts', { error: lastError });
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/**
 * Structured LLM Inference with Native Zod Schema enforcement and an automated
 * Self-Correction / Reflection Repair Loop.
 */
export async function runStructuredInference<T>(
  opts: StructuredInferenceOptions<T>
): Promise<T> {
  const {
    schema,
    schemaName,
    messages,
    provider,
    apiKey,
    model,
    temperature = 0.2,
    max_tokens,
    maxRepairAttempts = 2,
  } = opts;

  const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [...messages];

  // 1. First Attempt: Try native zodResponseFormat
  let rawText = '';
  try {
    rawText = (await runInference(conversation, {
      provider,
      apiKey,
      model,
      temperature,
      max_tokens,
      response_format: zodResponseFormat(schema, schemaName),
    })) as string;
  } catch (initialFormatError) {
    logger.warn('Native zodResponseFormat failed or unsupported by provider, falling back to json_object mode', {
      error: (initialFormatError as Error).message,
    });

    // Fallback: standard json_object format
    rawText = (await runInference(conversation, {
      provider,
      apiKey,
      model,
      temperature,
      max_tokens,
      response_format: { type: 'json_object' },
    })) as string;
  }

  // 2. Validation & Self-Healing Reflection Loop
  for (let repairAttempt = 0; repairAttempt <= maxRepairAttempts; repairAttempt++) {
    try {
      const cleaned = cleanJsonText(rawText);
      const parsedJson = JSON.parse(cleaned);
      const validationResult = schema.safeParse(parsedJson);

      if (validationResult.success) {
        logger.info(`Successfully parsed and validated ${schemaName} structured output.`);
        return validationResult.data;
      }

      // If validation failed and we have repair attempts left, perform a self-correction turn
      if (repairAttempt < maxRepairAttempts) {
        const errorDetails = JSON.stringify(validationResult.error.flatten().fieldErrors, null, 2);
        logger.warn(
          `Structured Output validation failed on attempt ${repairAttempt + 1}. Triggering self-correction loop...`,
          { errorDetails }
        );

        // Append assistant's flawed response and a reflection repair instruction
        conversation.push({ role: 'assistant', content: rawText });
        conversation.push({
          role: 'user',
          content: `Your previous JSON output failed Zod schema validation with the following issues:\n${errorDetails}\n\nPlease correct these specific errors and return ONLY a valid JSON object strictly matching the required schema.`,
        });

        rawText = (await runInference(conversation, {
          provider,
          apiKey,
          model,
          temperature: 0.1, // slightly lower temperature for deterministic repair
          max_tokens,
          response_format: { type: 'json_object' },
        })) as string;

        continue;
      }

      // If exhausted repair attempts, throw descriptive error
      throw new Error(
        `Schema validation failed after ${maxRepairAttempts} self-repair passes: ${JSON.stringify(
          validationResult.error.flatten().fieldErrors
        )}`
      );
    } catch (parseOrValidationError: unknown) {
      if (repairAttempt === maxRepairAttempts) {
        logger.error(`Critical error in structured inference for ${schemaName}`, {
          error: parseOrValidationError,
          rawOutput: rawText,
        });
        throw parseOrValidationError;
      }

      // JSON parse error self-repair
      logger.warn(`JSON Parse failed on attempt ${repairAttempt + 1}. Attempting repair turn...`);
      conversation.push({ role: 'assistant', content: rawText });
      conversation.push({
        role: 'user',
        content: `Your previous response could not be parsed as valid JSON (Error: ${
          (parseOrValidationError as Error).message
        }). Output ONLY the raw valid JSON object.`,
      });

      rawText = (await runInference(conversation, {
        provider,
        apiKey,
        model,
        temperature: 0.1,
        max_tokens,
        response_format: { type: 'json_object' },
      })) as string;
    }
  }

  throw new Error(`Failed to generate valid structured data for ${schemaName}.`);
}

/**
 * Agentic execution helper: Runs an interactive agent loop with tool execution.
 */
export async function runAgentLoop(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  tools: OpenAI.Chat.Completions.ChatCompletionTool[],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  toolMap: Record<string, Function>,
  opts: Omit<InferenceOptions, 'tools' | 'returnRaw'> = {},
  maxTurns: number = 5
): Promise<string> {
  let turns = 0;

  while (turns < maxTurns) {
    turns++;
    const completion = (await runInference(messages, {
      ...opts,
      tools,
      returnRaw: true,
    })) as OpenAI.Chat.Completions.ChatCompletion;

    const hasToolCalls = await handleToolCalls(completion, messages, toolMap);

    // If no tool calls were made, return final text content
    if (!hasToolCalls) {
      const finalContent = completion.choices[0]?.message?.content || '';
      return finalContent;
    }
  }

  // If reached max turns, do one final synthesis pass without tools
  const finalCompletion = (await runInference(messages, {
    ...opts,
    returnRaw: false,
  })) as string;

  return finalCompletion;
}
