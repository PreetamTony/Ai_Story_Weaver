import { create } from 'zustand';
import { StoryState } from '../types/story';
import { generateStoryResponse } from '../services/llmService';

interface StoryStore extends StoryState {
  initializeStory: (genre: string, setting: string) => Promise<void>;
  generateChoices: () => Promise<string[]>;
  advanceStory: (choice: string) => Promise<void>;
  saveStory: () => void;
  loadStory: () => boolean;
  addCharacter: (characterType: string) => Promise<void>;
  setError: (error: string | null) => void;
}

const initialState: StoryState = {
  characters: [],
  currentLocation: '',
  inventory: [],
  plotPoints: [],
  currentChapter: 1,
  storyGenre: '',
  storySetting: '',
  saveDate: new Date().toISOString(),
  isLoading: false,
  error: null,
};

export const useStoryStore = create<StoryStore>((set, get) => ({
  ...initialState,

  initializeStory: async (genre: string, setting: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await generateStoryResponse(
        `Create a story beginning in the ${genre} genre, set in ${setting}`,
        'story-init'
      );
      
      set({
        storyGenre: genre,
        storySetting: setting,
        characters: [{ type: 'protagonist', ...response.main_character }],
        currentLocation: response.setting_details,
        plotPoints: [response.initial_situation],
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to initialize story', isLoading: false });
    }
  },

  generateChoices: async () => {
    const state = get();
    try {
      const context = `
        Current location: ${state.currentLocation}
        Recent events: ${state.plotPoints[state.plotPoints.length - 1] || 'Story beginning'}
        Characters present: ${state.characters.map(char => char.name).join(', ')}
        Genre: ${state.storyGenre}
      `;
      
      const response = await generateStoryResponse(context, 'generate-choices');
      return response.choices || ['Explore the area', 'Talk to companions', 'Check inventory'];
    } catch (error) {
      set({ error: 'Failed to generate choices' });
      return ['Explore the area', 'Talk to companions', 'Check inventory'];
    }
  },

  advanceStory: async (choice: string) => {
    set({ isLoading: true, error: null });
    const state = get();
    
    try {
      const response = await generateStoryResponse(
        `Continue the story based on choice: ${choice}`,
        'advance-story'
      );
      
      set(state => ({
        plotPoints: [...state.plotPoints, response.narrative],
        currentLocation: response.new_location || state.currentLocation,
        inventory: [...state.inventory, ...(response.new_items || [])],
        currentChapter: state.currentChapter + 1,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to advance story', isLoading: false });
    }
  },

  saveStory: () => {
    const state = get();
    const saveData = {
      ...state,
      saveDate: new Date().toISOString(),
    };
    localStorage.setItem('story_save', JSON.stringify(saveData));
  },

  loadStory: () => {
    try {
      const savedData = localStorage.getItem('story_save');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        set(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      set({ error: 'Failed to load story' });
      return false;
    }
  },

  addCharacter: async (characterType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await generateStoryResponse(
        `Create a new ${characterType} character`,
        'add-character'
      );
      
      set(state => ({
        characters: [...state.characters, { type: characterType, ...response }],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add character', isLoading: false });
    }
  },

  setError: (error: string | null) => set({ error }),
}));