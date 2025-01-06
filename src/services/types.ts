export interface LLMResponse {
  choices: {
    text: string;
    confidence?: number;
  }[];
}

export interface StoryInitResponse {
  main_character: {
    name: string;
    description: string;
    motivation: string;
    relationship_to_protagonist: string;
  };
  setting_details: string;
  initial_situation: string;
}

export interface ChoicesResponse {
  choices: string[];
}

export interface StoryProgressResponse {
  narrative: string;
  new_location?: string;
  new_items?: string[];
}

export type ResponseType = 
  | StoryInitResponse 
  | ChoicesResponse 
  | StoryProgressResponse;