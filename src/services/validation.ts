import { z } from 'zod';

export const apiResponseSchema = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: z.string()
    })
  }))
});

export const storyInitSchema = z.object({
  main_character: z.object({
    name: z.string(),
    description: z.string(),
    motivation: z.string(),
    relationship_to_protagonist: z.string()
  }),
  setting_details: z.string(),
  initial_situation: z.string()
});

export const choicesSchema = z.object({
  choices: z.array(z.string())
});

export const storyProgressSchema = z.object({
  narrative: z.string(),
  new_location: z.string().optional(),
  new_items: z.array(z.string()).optional()
});

export function validateResponse(type: string, data: unknown) {
  switch (type) {
    case 'story-init':
      return storyInitSchema.parse(data);
    case 'generate-choices':
      return choicesSchema.parse(data);
    case 'advance-story':
      return storyProgressSchema.parse(data);
    default:
      throw new Error(`Unknown response type: ${type}`);
  }
}