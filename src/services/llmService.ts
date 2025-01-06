import { API_CONFIG, SYSTEM_PROMPTS, FALLBACK_CHOICES } from './config';
import { apiResponseSchema, validateResponse } from './validation';
import { retry, formatError, isValidJSON } from './utils';
import type { ResponseType } from './types';

async function makeAPIRequest(prompt: string, type: string) {
  const requestBody = {
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPTS[type as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS['generate-choices']
      },
      { role: 'user', content: prompt }
    ],
    model: API_CONFIG.model,
    temperature: API_CONFIG.temperature,
    max_tokens: API_CONFIG.maxTokens,
  };

  try {
    console.log('Making API request:', { url: API_CONFIG.baseUrl, type, requestBody });
    
    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log('Raw API Response:', responseData);
    
    if (!responseData.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', responseData);
      throw new Error('Invalid API response structure');
    }

    console.log('LLM Response content:', responseData.choices[0].message.content);
    return responseData;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export async function generateStoryResponse(prompt: string, type: string): Promise<ResponseType> {
  console.log('Generating story response:', { type, prompt });
  
  try {
    const data = await retry(() => makeAPIRequest(prompt, type), API_CONFIG.retries, API_CONFIG.initialDelay);
    const content = data.choices[0].message.content;
    
    if (!isValidJSON(content)) {
      console.error('Invalid JSON response:', content);
      if (type === 'generate-choices') {
        return { choices: FALLBACK_CHOICES };
      }
      throw new Error('Invalid JSON response from LLM');
    }

    const parsedContent = JSON.parse(content);
    console.log('Parsed Content:', parsedContent);
    
    const validatedResponse = validateResponse(type, parsedContent);
    console.log('Validated Response:', validatedResponse);
    
    return validatedResponse;
  } catch (error) {
    console.error('Story generation failed:', {
      error: formatError(error),
      type,
      prompt,
    });
    
    if (type === 'generate-choices') {
      return { choices: FALLBACK_CHOICES };
    }
    throw error;
  }
}