import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LanguageService } from '../lib/language';
import { PhoneFrame } from '../components/PhoneFrame';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: string;
}

export const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'A Good Day',
      content: 'Today I felt really good about myself. I completed my project and felt proud of what I accomplished.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      mood: 'happy'
    },
    {
      id: '2',
      title: 'Feeling Overwhelmed',
      content: 'Sometimes life feels like too much. But I know this feeling will pass and I will feel better.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      mood: 'anxious'
    }
  ]);
  
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });
  
  const currentLanguage = LanguageService.getCurrentLanguage();

  const handleStartWriting = () => {
    setIsWriting(true);
    setNewEntry({
      title: '',
      content: '',
      mood: 'neutral'
    });
  };

  const handleSaveEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        date: new Date(),
        mood: newEntry.mood
      };
      
      setEntries(prev => [entry, ...prev]);
      setIsWriting(false);
      setNewEntry({ title: '', content: '', mood: 'neutral' });
    }
  };

  const handleCancelWriting = () => {
    setIsWriting(false);
    setNewEntry({ title: '', content: '', mood: 'neutral' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      excited: '🤩',
      calm: '😌',
      neutral: '😐'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <PhoneFrame>
      <div className="h-full bg-amber-50 flex flex-col pb-24">
        <div className="w-full max-w-3xl mx-auto flex-1 overflow-y-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-light text-stone-800 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            يومياتي الخاصة / My Private Journal
          </h1>
          <div className="w-16 h-1 bg-green-800 mx-auto rounded-full mb-4"></div>
          <p className="text-stone-600 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            هذا مكان آمن لكتابة أفكارك ومشاعرك / A safe space to write your thoughts and feelings
          </p>
        </motion.div>

        {/* New Entry Button */}
        {!isWriting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <button
              onClick={handleStartWriting}
              className="bg-green-800 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition-colors duration-300 shadow-lg"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              كتابة جديدة / New Entry
            </button>
          </motion.div>
        )}

        {/* Writing Interface */}
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-lg border-2 border-stone-200 p-8 mb-8"
          >
            <h2 className="text-xl font-medium text-stone-700 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              اكتب يومياتك / Write Your Journal
            </h2>

            {/* Title Input */}
            <input
              type="text"
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              placeholder="عنوان اليومية... / Journal title..."
              className="w-full p-4 text-lg border-0 rounded-2xl mb-4 focus:outline-none bg-stone-50"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            />

            {/* Mood Selection */}
            <div className="mb-6">
              <p className="text-stone-700 text-sm mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                مزاجك اليوم: / Your mood today:
              </p>
              <div className="flex gap-2 flex-wrap">
                {['happy', 'sad', 'anxious', 'angry', 'excited', 'calm', 'neutral'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setNewEntry(prev => ({ ...prev, mood }))}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      newEntry.mood === mood
                        ? 'bg-green-800 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="mr-2">{getMoodEmoji(mood)}</span>
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <textarea
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              placeholder="اكتب عن يومك، مشاعرك، أفكارك... / Write about your day, feelings, thoughts..."
              className={`w-full h-48 p-4 text-lg border-0 rounded-2xl resize-none focus:outline-none transition-all duration-300 ${
                currentLanguage === 'ar' ? 'text-right' : 'text-left'
              }`}
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6'
              }}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEntry}
                disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                className={`flex-1 py-3 rounded-full font-medium transition-all duration-300 ${
                  newEntry.title.trim() && newEntry.content.trim()
                    ? 'bg-green-800 text-white hover:bg-green-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                حفظ / Save
              </button>
              <button
                onClick={handleCancelWriting}
                className="flex-1 py-3 rounded-full font-medium bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors duration-300"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                إلغاء / Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Journal Entries */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6"
            >
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <h3 className="text-lg font-medium text-stone-800" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {entry.title}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Entry Content */}
              <p className="text-stone-700 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6' }}>
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {entries.length === 0 && !isWriting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-stone-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              لا توجد يوميات بعد. ابدأ بكتابة أول يومية لك! / No entries yet. Start writing your first journal entry!
            </p>
          </motion.div>
        )}
        </div>
      </div>
    </PhoneFrame>
  );
};
