import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Feather } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { ContentModerationBadge } from '../components/ContentModeration';

interface FeedPost {
  id: string;
  username?: string;
  isAnonymous: boolean;
  character: {
    id: string;
    name: string;
    nameAr: string;
  };
  storyText: string;
  thoughts: string;
  image?: string;
  timestamp: Date;
  comments: Array<{
    id: string;
    text: string;
    isAnonymous: boolean;
    likes: number;
    isLiked: boolean;
  }>;
  featherCount: number;
  isLiked: boolean;
}

// Mock data for the feed
const MOCK_POSTS: FeedPost[] = [
  {
    id: '1',
    isAnonymous: true,
    character: { id: 'comic1', name: 'Sara', nameAr: 'سارة' },
    storyText: 'Today I felt overwhelmed with school work, but I talked to my friend and felt better.',
    thoughts: 'It\'s okay to ask for help when you need it.',
    image: '/comic1.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    comments: [
      { id: '1', text: 'شكراً على المشاركة، أنت لست وحدك 💚', isAnonymous: true, likes: 5, isLiked: false }
    ],
    featherCount: 19,
    isLiked: false
  },
  {
    id: '2',
    username: 'أحمد_123',
    isAnonymous: false,
    character: { id: 'comic2', name: 'Ahmed', nameAr: 'أحمد' },
    storyText: 'I was nervous about my presentation, but I practiced and it went well.',
    thoughts: 'Preparation helped me turn nerves into confidence.',
    image: '/comic2.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    comments: [
      { id: '2', text: 'قصة ملهمة جداً', isAnonymous: true, likes: 3, isLiked: false }
    ],
    featherCount: 35,
    isLiked: false
  },
  {
    id: '3',
    isAnonymous: true,
    character: { id: 'comic3', name: 'Layla', nameAr: 'ليلى' },
    storyText: 'Sometimes I feel lonely, but I remember that many people care about me.',
    thoughts: 'Loneliness is temporary, but love is forever.',
    image: '/comic3.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    comments: [
      { id: '3', text: 'I feel the same way sometimes', isAnonymous: true, likes: 2, isLiked: false }
    ],
    featherCount: 18,
    isLiked: false
  },
  // Additional mock posts with likeable comments
  {
    id: '4',
    isAnonymous: true,
    character: { id: 'falcon', name: 'Noor', nameAr: 'نور' },
    storyText: 'Had a great day helping my family with chores.',
    thoughts: 'Acts of service make my heart feel lighter.',
    image: '/comic1.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    comments: [
      { id: '4', text: 'شكراً لك على مشاركة قصتك 💚', isAnonymous: true, likes: 4, isLiked: false }
    ],
    featherCount: 32,
    isLiked: false
  },
  {
    id: '5',
    isAnonymous: true,
    character: { id: 'falcon', name: 'Omar', nameAr: 'عمر' },
    storyText: 'I feel the same way sometimes',
    thoughts: 'Shared feelings remind me we are connected.',
    image: '/comic2.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    comments: [
      { id: '5', text: 'أنت لست وحدك في هذا', isAnonymous: true, likes: 6, isLiked: false }
    ],
    featherCount: 28,
    isLiked: false
  },
  {
    id: '6',
    isAnonymous: true,
    character: { id: 'falcon', name: 'Fahad', nameAr: 'فهد' },
    storyText: 'This really helped me today',
    thoughts: 'Grateful for the guidance I received.',
    image: '/comic3.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
    comments: [
      { id: '6', text: 'قصة ملهمة جداً', isAnonymous: true, likes: 7, isLiked: false }
    ],
    featherCount: 41,
    isLiked: false
  },
  {
    id: '7',
    isAnonymous: true,
    character: { id: 'falcon', name: 'Sara', nameAr: 'سارة' },
    storyText: 'Learning new things every day!',
    thoughts: 'Curiosity keeps my spirit bright.',
    image: '/comic1.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    comments: [
      { id: '7', text: 'Keep going! 💪', isAnonymous: true, likes: 3, isLiked: false }
    ],
    featherCount: 19,
    isLiked: false
  },
  {
    id: '8',
    isAnonymous: true,
    character: { id: 'falcon', name: 'Ahmed', nameAr: 'أحمد' },
    storyText: 'Grateful for all the support from friends.',
    thoughts: 'Supportive friends are my strength.',
    image: '/comic2.png',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42), // 42 hours ago
    comments: [
      { id: '8', text: 'You deserve all the support! ❤️', isAnonymous: true, likes: 5, isLiked: false }
    ],
    featherCount: 35,
    isLiked: false
  }
];

export const Feed: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    const shuffled = [...MOCK_POSTS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');

  // Add new post if coming from comic generation
  React.useEffect(() => {
    if (location.state?.comic) {
      const comicData = location.state.comic;
      const newPostId = `comic-${comicData.timestamp?.getTime() || Date.now()}`;
      
      // Check if post already exists to prevent duplicates
      setPosts(prev => {
        const postExists = prev.some(post => post.id === newPostId);
        if (postExists) {
          return prev; // Don't add duplicate
        }
        
        const newPost: FeedPost = {
          id: newPostId,
          isAnonymous: true,
          character: comicData.character,
          storyText: comicData.storyText,
          thoughts: comicData.thoughts && comicData.thoughts.length > 0 ? comicData.thoughts : comicData.storyText,
          image: comicData.image,
          timestamp: comicData.timestamp,
          comments: [],
          featherCount: 0,
          isLiked: false
        };
        const updated = [newPost, ...prev.filter(post => post.id !== newPostId)];
        for (let i = updated.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [updated[i], updated[j]] = [updated[j], updated[i]];
        }
        return updated;
      });
      
      // Clear the location state to prevent re-processing
      navigate('/feed', { replace: true });
    }
  }, [location.state?.comic, navigate]);

  const handleLikeClick = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            featherCount: post.isLiked ? post.featherCount - 1 : post.featherCount + 1
          }
        : post
    ));
  };

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  const handleAddComment = (postId: string) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        isAnonymous: true,
        likes: 0,
        isLiked: false
      };
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ));
      
      setNewComment('');
      setSelectedPostId(null);
    }
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                  }
                : comment
            )
          }
        : post
    ));
  };

  const isArabicLanguage = (text: string) => {
    return /[\u0600-\u06FF]/.test(text);
  };

  return (
    <PhoneFrame>
      <div className="h-full bg-[#0E4A3B] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-[#0E4A3B] pt-4 pb-2 px-6 z-10">
          <h1 className="text-3xl font-light text-center text-white">
            شاهين / Shaheen Feed
          </h1>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/10 rounded-3xl border border-white/10 overflow-hidden shadow-lg backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-white/90">{post.isAnonymous ? 'Anonymous' : post.username}</p>
                    <ContentModerationBadge safetyScore={95} isApproved={true} />
                  </div>
                  <div className="aspect-square bg-white rounded-2xl mb-4 flex items-center justify-center border border-white/20 overflow-hidden">
                    {(() => {
                      const imageSrc = post.image || `/${post.character.id}.png`;
                      return (
                    <img 
                      src={imageSrc} 
                      alt={post.character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-text text-gray-600 text-center p-8';
                          fallback.innerHTML = `<div class="text-4xl mb-2">🎨</div><div class="text-sm">${post.character.name}'s Story</div>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    );
                    })()}
                  </div>
                  <p className="text-sm text-white mb-3 leading-relaxed">
                    {post.thoughts && post.thoughts.trim().length > 0 ? post.thoughts : post.storyText}
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <button 
                      onClick={() => handleLikeClick(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        post.isLiked ? 'text-red-400' : 'text-white/80'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.featherCount}</span>
                    </button>
                    <button 
                      onClick={() => handleCommentClick(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        selectedPostId === post.id ? 'text-[#FCD34D]' : 'text-white/80'
                      }`}
                    >
                      <Feather className="w-5 h-5" />
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                  </div>
                  {/* Show top comment by default OR show all comments when selected */}
                  {selectedPostId === post.id ? (
                    /* Show all comments when expanded */
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      {/* All comments */}
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-lg p-3 border border-white/30 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-700">{comment.isAnonymous ? 'Anonymous' : 'User'}</p>
                              <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                            </div>
                            <button
                              onClick={() => handleCommentLike(post.id, comment.id)}
                              className={`ml-3 flex items-center gap-1 transition-colors ${
                                comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                              <span className="text-xs">{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add comment form */}
                      <div className="bg-white rounded-lg p-3 border border-white/30 shadow-sm">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="أضف تعليقاً... / Add a comment..."
                          className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:border-[#0E4A3B] focus:outline-none resize-none"
                          rows={2}
                          dir="auto"
                          style={{ textAlign: isArabicLanguage(newComment) ? 'right' : 'left' }}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment.trim()}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              newComment.trim()
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                                     إرسال / Send
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Show top comment by default when not expanded */
                    post.comments[0] && (
                      <div className="bg-white rounded-lg p-3 border border-white/30 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-700">{post.comments[0].isAnonymous ? 'Anonymous' : 'User'}</p>
                            <p className="text-sm text-gray-600 mt-1">{post.comments[0].text}</p>
                          </div>
                          <button
                            onClick={() => handleCommentLike(post.id, post.comments[0].id)}
                            className={`ml-3 flex items-center gap-1 transition-colors ${
                              post.comments[0].isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.comments[0].isLiked ? 'fill-current' : ''}`} />
                            <span className="text-xs">{post.comments[0].likes}</span>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};
