export interface Character {
  type: string;
  name: string;
  description: string;
  motivation: string;
  relationship_to_protagonist: string;
}

export interface StoryState {
  characters: Character[];
  currentLocation: string;
  inventory: string[];
  plotPoints: string[];
  currentChapter: number;
  storyGenre: string;
  storySetting: string;
  saveDate: string;
  isLoading: boolean;
  error: string | null;
}

export interface Choice {
  id: number;
  text: string;
}