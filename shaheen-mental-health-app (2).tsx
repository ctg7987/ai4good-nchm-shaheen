import React, { useState } from 'react';
import { Mic, ChevronRight, BookOpen, Feather, Plus, BookMarked, Wind, Heart, Sparkles } from 'lucide-react';

const ShaheenApp = () => {
  const [currentPage, setCurrentPage] = useState('feeling');
  const [userInput, setUserInput] = useState('');
  const [problemName, setProblemName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);
  const [generatedComic, setGeneratedComic] = useState(null);
  const [comicThoughts, setComicThoughts] = useState('');
  const [defianceStory, setDefianceStory] = useState('');
  const [strengthsPoints, setStrengthsPoints] = useState(42);
  const [feedPosts, setFeedPosts] = useState([
    { id: 1, username: 'Anonymous', comic: true, likes: 24, type: 'hope', comments: [{text: 'شكراً على المشاركة، أنت لست وحدك', author: 'سارة'}] },
    { id: 2, username: 'أحمد_123', comic: true, likes: 45, type: 'defiance', comments: [{text: 'قصة ملهمة جداً', author: 'Anonymous'}] },
    { id: 3, username: 'Anonymous', comic: true, likes: 18, type: 'resilience', comments: [{text: 'Your strength inspires me', author: 'Anonymous'}] },
  ]);
  const [featherText, setFeatherText] = useState('');
  const [coreValues, setCoreValues] = useState({
    family: 0,
    health: 0,
    faith: 0,
    growth: 0,
    community: 0
  });

  const characters = [
    { id: 0, name: 'ليلى / Layla', color: 'bg-emerald-100', trait: 'المرونة / Resilience' },
    { id: 1, name: 'عمر / Omar', color: 'bg-stone-100', trait: 'الصبر / Patience' },
    { id: 2, name: 'نور / Noor', color: 'bg-green-100', trait: 'الأمل / Hope' },
    { id: 3, name: 'فهد / Fahad', color: 'bg-slate-100', trait: 'الشجاعة / Courage' },
    { id: 4, name: 'سارة / Sara', color: 'bg-teal-100', trait: 'الحكمة / Wisdom' },
  ];

  const breathingExercises = [
    { 
      name: 'تنفس المراقبة / Muraqabah Breathing', 
      duration: '5 min', 
      description: 'Islamic mindfulness practice focused on inner awareness',
      technique: 'Inhale 4s, hold 7s, exhale 8s'
    },
    { 
      name: 'تنفس الذكر / Dhikr Breathing', 
      duration: '3 min', 
      description: 'Reflective breathing for gratitude and balance',
      technique: 'Equal 4 second counts'
    },
    { 
      name: 'إيقاع التهدئة / Soothing Rhythm', 
      duration: '2 min', 
      description: 'Gentle breathing for calm',
      technique: 'Slow deep breaths'
    },
  ];

  const handleGenerateComic = () => {
    setGeneratedComic({
      panels: [
        { stage: 'المواجهة / Challenge', emotion: 'overwhelmed' },
        { stage: 'التأمل / Reflection', emotion: 'contemplative' },
        { stage: 'التحدي / Defiance', emotion: 'determined' },
        { stage: 'الأمل / Hope', emotion: 'hopeful' }
      ]
    });
    setCurrentPage('comic-result');
  };

  const handlePost = () => {
    const newPost = {
      id: feedPosts.length + 1,
      username: 'Anonymous',
      comic: true,
      likes: 0,
      type: 'hope',
      comments: []
    };
    setFeedPosts([newPost, ...feedPosts]);
    setStrengthsPoints(prev => prev + 5);
    setCurrentPage('feed');
  };

  const renderFeelingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-900 p-8">
      <div className="w-full max-w-lg space-y-12">
        <div className="text-center space-y-6">
          <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
            <path d="M50,15 C45,18 38,25 35,35 C32,42 30,50 32,58 C35,68 42,75 50,78 C58,75 65,68 68,58 C70,50 68,42 65,35 C62,25 55,18 50,15 Z" 
                  fill="#f5f5f0" stroke="#9ca899" strokeWidth="2.5" opacity="0.9"/>
            <path d="M50,25 C47,30 45,38 46,46 C47,52 50,58 50,62" 
                  stroke="#9ca899" strokeWidth="2" fill="none" opacity="0.6"/>
          </svg>
          <h1 className="text-5xl font-light text-stone-100 tracking-wide">
            كيف تشعر؟
          </h1>
          <h2 className="text-3xl font-light text-stone-200 tracking-wide">
            How are you feeling?
          </h2>
          <p className="text-stone-300 text-sm font-light leading-relaxed max-w-md mx-auto">
            قبل أن تكمل الكتابة، توقف لثلاثة أنفاس
            <br />
            Before you continue, pause for three breaths
          </p>
        </div>
        
        <div className="space-y-6">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="شارك مشاعرك... / Share your feelings..."
            className="w-full h-40 p-6 rounded-3xl border-2 border-stone-300 focus:border-stone-400 focus:outline-none resize-none bg-stone-50 text-stone-800 placeholder-stone-400 text-lg"
            style={{lineHeight: '1.8'}}
          />
          
          <button className="w-full flex items-center justify-center gap-4 p-5 rounded-full bg-stone-50 border-2 border-stone-300 hover:bg-stone-100 hover:border-stone-400 transition-all duration-300">
            <Mic className="w-7 h-7 text-emerald-800" strokeWidth={1.5} />
            <span className="text-emerald-900 text-lg font-light tracking-wide">استخدم الصوت / Use Voice</span>
          </button>

          {userInput && (
            <button
              onClick={() => setCurrentPage('externalize')}
              className="w-full flex items-center justify-center gap-3 p-5 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-900 transition-all duration-300 border-2 border-transparent hover:border-stone-300"
            >
              <span className="text-lg font-light tracking-wide">التالي / Next</span>
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderExternalizePage = () => (
    <div className="min-h-screen bg-emerald-900 p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-stone-100 tracking-wide">
            سمِّ التحدي / Name Your Challenge
          </h1>
          <p className="text-stone-300 font-light leading-relaxed max-w-xl mx-auto">
            في العلاج السردي، نفصل المشكلة عن الهوية
            <br />
            In narrative therapy, we separate the problem from identity
          </p>
        </div>

        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-stone-700 font-light">ما تشعر به الآن:</label>
            <div className="bg-stone-100 rounded-2xl p-5 border-2 border-stone-200">
              <p className="text-stone-700 leading-loose">{userInput}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-stone-700 font-light">
              سمِّ هذا الزائر / Name this visitor
            </label>
            <input
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              placeholder="الزائر القلق..."
              className="w-full p-5 rounded-2xl border-2 border-stone-200 focus:border-stone-400 focus:outline-none bg-white text-stone-800 placeholder-stone-400 text-lg"
            />
          </div>

          {problemName && (
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
              <p className="text-emerald-900 leading-relaxed font-light">
                شكراً للفكرة على الزيارة
                <br />
                Thank the thought for visiting
              </p>
            </div>
          )}
        </div>

        {problemName && (
          <button
            onClick={() => setCurrentPage('values')}
            className="w-full py-5 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-900 text-lg font-light tracking-wide transition-all duration-300 border-2 border-stone-200"
          >
            استكشف قيمك / Explore Values
          </button>
        )}
      </div>
    </div>
  );

  const renderValuesPage = () => (
    <div className="min-h-screen bg-emerald-900 p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-stone-100 tracking-wide">
            قيمك الأساسية / Core Values
          </h1>
        </div>

        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-8 space-y-6">
          {Object.keys(coreValues).map((value) => (
            <div key={value} className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-800 font-light">
                  {value === 'family' && 'العائلة / Family'}
                  {value === 'health' && 'الصحة / Health'}
                  {value === 'faith' && 'الإيمان / Faith'}
                  {value === 'growth' && 'النمو / Growth'}
                  {value === 'community' && 'المجتمع / Community'}
                </span>
                <span className="text-emerald-800">{coreValues[value]}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={coreValues[value]}
                onChange={(e) => setCoreValues({...coreValues, [value]: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage('story')}
          className="w-full py-5 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-900 text-lg font-light tracking-wide transition-all"
        >
          احكِ قصتك / Tell Story
        </button>
      </div>
    </div>
  );

  const renderStoryPage = () => (
    <div className="min-h-screen bg-emerald-900 p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-stone-100 tracking-wide">
            رحلة البطل / Hero's Journey
          </h1>
        </div>
        
        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-stone-700 font-light">لحظة التحدي:</label>
            <textarea
              value={defianceStory}
              onChange={(e) => setDefianceStory(e.target.value)}
              placeholder="عندما شعرت بـ... قررت أن..."
              className="w-full p-5 rounded-2xl border-2 border-stone-200 focus:border-stone-400 focus:outline-none resize-none bg-white text-stone-800"
              rows="4"
            />
          </div>
        </div>

        <div>
          <p className="text-lg text-stone-200 mb-5 font-light">اختر شخصيتك:</p>
          <div className="flex gap-5 overflow-x-auto pb-6">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char.id)}
                className={`flex-shrink-0 rounded-3xl ${char.color} p-5 transition-all ${
                  selectedCharacter === char.id ? 'border-4 border-stone-200 scale-105' : 'border-2 border-stone-300'
                }`}
              >
                <div className="space-y-3">
                  <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100">
                    <circle cx="50" cy="40" r="18" fill="#6b7280" opacity="0.3"/>
                    <path d="M30,65 Q40,55 50,55 Q60,55 70,65" stroke="#6b7280" strokeWidth="3" fill="none" opacity="0.3"/>
                  </svg>
                  <div className="text-center">
                    <p className="text-xs text-stone-700 font-light">{char.name}</p>
                    <p className="text-xs text-stone-500">{char.trait}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <label className="flex items-start gap-4 p-6 bg-stone-50 rounded-2xl border-2 border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 w-6 h-6"
            />
            <span className="text-stone-700 leading-relaxed font-light text-sm">
              أوافق على مشاركة قصتي في أرشيف قصص الأمل
            </span>
          </label>

          <button
            onClick={handleGenerateComic}
            disabled={!consentChecked || !defianceStory}
            className={`w-full py-5 rounded-full text-lg font-light ${
              consentChecked && defianceStory
                ? 'bg-stone-100 hover:bg-stone-200 text-emerald-900' 
                : 'bg-stone-600 text-stone-400 cursor-not-allowed'
            }`}
          >
            إنشاء القصة المصورة
          </button>
        </div>
      </div>
    </div>
  );

  const renderComicResult = () => (
    <div className="min-h-screen bg-emerald-900 p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-4xl font-light text-center text-stone-100 tracking-wide">
          قصتك المرئية
        </h1>

        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-8">
          <div className="grid grid-cols-2 gap-6">
            {generatedComic?.panels.map((panel, idx) => (
              <div key={idx} className="aspect-square bg-stone-100 rounded-2xl border-2 border-stone-300 flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-3">
                  <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100">
                    {idx === 0 && <circle cx="50" cy="50" r="30" fill="#9ca899" opacity="0.2"/>}
                    {idx === 1 && <circle cx="50" cy="50" r="25" fill="#9ca899" opacity="0.3"/>}
                    {idx === 2 && <circle cx="50" cy="45" r="20" fill="#065f46" opacity="0.2"/>}
                    {idx === 3 && <circle cx="50" cy="50" r="28" fill="none" stroke="#9ca899" strokeWidth="2"/>}
                  </svg>
                  <p className="text-xs text-stone-600 font-light">{panel.stage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-6">
          <textarea
            value={comicThoughts}
            onChange={(e) => setComicThoughts(e.target.value)}
            placeholder="تأملاتك اللطيفة..."
            className="w-full p-5 rounded-2xl border-2 border-stone-200 focus:border-stone-400 focus:outline-none resize-none bg-white"
            rows="4"
          />
        </div>

        <button
          onClick={handlePost}
          className="w-full py-6 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-900 text-xl font-light flex items-center justify-center gap-3"
        >
          <Sparkles className="w-6 h-6" />
          <span>نشر على شاهين</span>
          <span className="text-sm">+5 ريش</span>
        </button>

        <button
          onClick={() => setCurrentPage('feed')}
          className="w-full text-center text-stone-300 hover:text-stone-100 font-light"
        >
          تخطي
        </button>
      </div>
    </div>
  );

  const renderFeed = () => (
    <div className="min-h-screen bg-emerald-900 pb-24">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-light text-stone-100">أرشيف قصص الأمل</h1>
          <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-full">
            <Feather className="w-5 h-5 text-emerald-800" />
            <span className="text-emerald-900 font-light">{strengthsPoints}</span>
          </div>
        </div>

        {feedPosts.map((post) => (
          <div key={post.id} className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-light text-stone-600">{post.username}</p>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {post.type === 'hope' && 'أمل'}
                {post.type === 'defiance' && 'تحدي'}
                {post.type === 'resilience' && 'مرونة'}
              </span>
            </div>
            <div className="aspect-square bg-stone-100 rounded-2xl mb-6 flex items-center justify-center border-2 border-stone-200 p-8">
              <p className="text-stone-500 font-light">Comic panels</p>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <button className="flex items-center gap-2 text-stone-600">
                <Heart className="w-5 h-5" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-stone-600">
                <Feather className="w-5 h-5" />
                <span className="text-sm">{post.comments.length}</span>
              </button>
            </div>
            {post.comments[0] && (
              <div className="bg-stone-100 rounded-2xl p-5 border-2 border-stone-200">
                <p className="text-xs font-light text-stone-600 mb-2">{post.comments[0].author}</p>
                <p className="text-sm text-stone-700 font-light">{post.comments[0].text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeathers = () => (
    <div className="min-h-screen bg-emerald-900 pb-24">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <h1 className="text-4xl font-light text-center text-stone-100">ريش الأمل</h1>

        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-6">
          <textarea
            value={featherText}
            onChange={(e) => setFeatherText(e.target.value)}
            placeholder="شارك رسالة أمل..."
            maxLength={1000}
            className="w-full p-5 rounded-2xl border-2 border-stone-200 focus:border-stone-400 focus:outline-none resize-none bg-white"
            rows="5"
          />
          <button className="mt-5 w-full py-4 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-900 font-light">
            إضافة ريشة
          </button>
        </div>

        <div className="space-y-6">
          {['الأيام الصعبة تمر، والأمل يبقى', 'Tomorrow is a new beginning', 'أنت أقوى مما تظن'].map((text, idx) => (
            <div key={idx} className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-7 flex items-start gap-5">
              <Feather className="w-7 h-7 text-emerald-800 flex-shrink-0" />
              <p className="text-stone-700 leading-loose font-light">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="min-h-screen bg-emerald-900 pb-24">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <h1 className="text-4xl font-light text-center text-stone-100">يومياتي الخاصة</h1>
        <div className="bg-stone-50 rounded-3xl border-2 border-stone-200 p-8">
          <textarea
            placeholder="اكتب أفكارك الخاصة..."
            className="w-full h-80 p-6 rounded-2xl border-2 border-stone-200 focus:border-stone-400 focus:outline-none resize-none bg-white"
          />
          <button className="mt-6 w-full py-4 rounded-full bg-stone-100 hover:bg-stone-200 text-emerald-900 font-light">
            حفظ
          </button>
        </div>
      </div>
    </div>
  );

  const renderBreathing = () => (
    <div className="min-h-screen bg-emerald-900 pb-24">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <h1 className="text-4xl font-light text-center text-stone-100">تمارين التنفس</h1>
        <div className="space-y-6">
          {breathingExercises.map((ex, idx) => (
            <button key={idx} className="w-full bg-stone-50 rounded-3xl border-2 border-stone-200 p-8 hover:border-stone-300 text-left">
              <div className="flex items-start gap-6">
                <Wind className="w-10 h-10 text-emerald-800 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-light text-stone-800 mb-3">{ex.name}</h3>
                  <p className="text-stone-600 mb-3 font-light">{ex.description}</p>
                  <span className="text-sm text-emerald-800">{ex.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch(currentPage) {
      case 'feeling': return renderFeelingPage();
      case 'externalize': return renderExternalizePage();
      case 'values': return renderValuesPage();
      case 'story': return renderStoryPage();
      case 'comic-result': return renderComicResult();
      case 'feed': return renderFeed();
      case 'feathers': return renderFeathers();
      case 'journal': return renderJournal();
      case 'breathing': return renderBreathing();
      default: return renderFeelingPage();
    }
  };

  return (
    <div className="relative">
      {renderPage()}
      
      {['feed', 'feathers', 'journal', 'breathing'].includes(currentPage) && (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-50 border-t-2 border-stone-200">
          <div className="max-w-3xl mx-auto flex justify-around items-center py-4">
            <button
              onClick={() => setCurrentPage('feed')}
              className={`p-3 ${currentPage === 'feed' ? 'text-emerald-800' : 'text-stone-400'}`}
            >
              <BookOpen className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCurrentPage('feathers')}
              className={`p-3 ${currentPage === 'feathers' ? 'text-emerald-800' : 'text-stone-400'}`}
            >
              <Feather className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCurrentPage('feeling')}
              className="p-4 bg-emerald-800 hover:bg-emerald-900 rounded-full text-stone-50 -mt-8"
            >
              <Plus className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCurrentPage('journal')}
              className={`p-3 ${currentPage === 'journal' ? 'text-emerald-800' : 'text-stone-400'}`}
            >
              <BookMarked className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCurrentPage('breathing')}
              className={`p-3 ${currentPage === 'breathing' ? 'text-emerald-800' : 'text-stone-400'}`}
            >
              <Wind className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShaheenApp;