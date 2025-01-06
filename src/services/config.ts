export const API_CONFIG = {
  // Updated to the correct Groq API endpoint according to docs
  baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'mixtral-8x7b-32768',
  temperature: 0.8,
  maxTokens: 2048,
  retries: 3,
  initialDelay: 1000,
} as const;

export const SYSTEM_PROMPTS = {
  'story-init': `You are a creative storytelling assistant. Create an engaging story beginning with the following parameters. 
    Return ONLY a JSON object in this exact format, with no additional text or explanation:
    {
      "main_character": {
        "name": "string",
        "description": "string",
        "motivation": "string",
        "relationship_to_protagonist": "string"
      },
      "setting_details": "string",
      "initial_situation": "string"
    }`,
  'generate-choices': `You are a creative storytelling assistant. Generate meaningful choices for the current story situation.
    Return ONLY a JSON object in this exact format, with no additional text or explanation:
    {
      "choices": ["string", "string", "string"]
    }`,
  'advance-story': `You are a creative storytelling assistant. Continue the story based on the chosen action.
    Return ONLY a JSON object in this exact format, with no additional text or explanation:
    {
      "narrative": "string",
      "new_location": "string",
      "new_items": ["string"]
    }`,
} as const;

export const FALLBACK_CHOICES = [
  'Explore the surroundings carefully',
  'Engage with nearby characters',
  'Review your inventory and resources',
  'Take a moment to strategize',
] as const;