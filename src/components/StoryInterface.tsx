import React, { useState } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { Book, Loader2, Save, Upload } from 'lucide-react';
import { Layout } from './Layout';
import { StoryCard } from './StoryCard';
import { ChoiceButton } from './ChoiceButton';

export function StoryInterface() {
  const [genre, setGenre] = useState('');
  const [setting, setSetting] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  
  const {
    initializeStory,
    generateChoices,
    advanceStory,
    saveStory,
    loadStory,
    currentChapter,
    currentLocation,
    characters,
    inventory,
    plotPoints,
    isLoading,
    error,
  } = useStoryStore();

  const handleNewStory = async () => {
    if (!genre || !setting) return;
    await initializeStory(genre, setting);
    const newChoices = await generateChoices();
    setChoices(newChoices);
  };

  const handleChoice = async (choice: string) => {
    await advanceStory(choice);
    const newChoices = await generateChoices();
    setChoices(newChoices);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!currentChapter || currentChapter === 1 ? (
        <div className="max-w-md mx-auto">
          <StoryCard title="Begin Your Journey" className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           placeholder-white/30"
                  placeholder="fantasy, sci-fi, mystery..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-purple-300 mb-2">Setting</label>
                <input
                  type="text"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           placeholder-white/30"
                  placeholder="Enter story setting..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleNewStory}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg
                           transition-colors duration-200 font-medium"
                >
                  Start New Story
                </button>
                <button
                  onClick={loadStory}
                  className="flex items-center gap-2 px-6 py-3 border border-purple-500/30 rounded-lg
                           hover:bg-purple-500/10 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4" />
                  Load
                </button>
              </div>
            </div>
          </StoryCard>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-300">Chapter {currentChapter}</h2>
            <button
              onClick={saveStory}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700
                       text-white rounded-lg transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              Save Story
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StoryCard title="Location" className="md:col-span-2">
              <p className="text-gray-300">{currentLocation}</p>
            </StoryCard>

            <StoryCard title="Characters">
              <ul className="space-y-2">
                {characters.map((char, idx) => (
                  <li key={idx} className="text-gray-300">
                    {char.name} - <span className="text-purple-400">{char.type}</span>
                  </li>
                ))}
              </ul>
            </StoryCard>
          </div>

          {inventory.length > 0 && (
            <StoryCard title="Inventory" className="mb-8">
              <ul className="flex flex-wrap gap-2">
                {inventory.map((item, idx) => (
                  <li key={idx} className="bg-purple-500/20 px-3 py-1 rounded-full text-sm text-purple-200">
                    {item}
                  </li>
                ))}
              </ul>
            </StoryCard>
          )}

          <StoryCard title="Story" className="mb-8 prose prose-invert max-w-none">
            {plotPoints.map((point, idx) => (
              <p key={idx} className="mb-4 text-gray-300 leading-relaxed">
                {point}
              </p>
            ))}
          </StoryCard>

          <StoryCard title="What would you like to do?">
            <div className="space-y-3">
              {choices.map((choice, idx) => (
                <ChoiceButton key={idx} onClick={() => handleChoice(choice)}>
                  {choice}
                </ChoiceButton>
              ))}
            </div>
          </StoryCard>
        </div>
      )}
    </Layout>
  );
}