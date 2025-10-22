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
  thoughts?: string;
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
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    comments: [
      { id: '1', text: 'شكراً على المشاركة، أنت لست وحدك 💚', isAnonymous: true, likes: 5, isLiked: false }
    ],
    featherCount: 24,
    isLiked: false
  },
  {
    id: '2',
    username: 'أحمد_123',
    isAnonymous: false,
    character: { id: 'comic2', name: 'Ahmed', nameAr: 'أحمد' },
    storyText: 'I was nervous about my presentation, but I practiced and it went well.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    comments: [
      { id: '2', text: 'قصة ملهمة جداً', isAnonymous: true, likes: 3, isLiked: false }
    ],
    featherCount: 45,
    isLiked: false
  },
  {
    id: '3',
    isAnonymous: true,
    character: { id: 'comic3', name: 'Layla', nameAr: 'ليلى' },
    storyText: 'Sometimes I feel lonely, but I remember that many people care about me.',
    thoughts: 'Loneliness is temporary, but love is forever.',
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
    character: { id: 'noor', name: 'Noor', nameAr: 'نور' },
    storyText: 'Had a great day helping my family with chores.',
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
    character: { id: 'omar', name: 'Omar', nameAr: 'عمر' },
    storyText: 'I feel the same way sometimes',
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
    character: { id: 'fahad', name: 'Fahad', nameAr: 'فهد' },
    storyText: 'This really helped me today',
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
    character: { id: 'sara2', name: 'Sara', nameAr: 'سارة' },
    storyText: 'Learning new things every day!',
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
    character: { id: 'ahmed2', name: 'Ahmed', nameAr: 'أحمد' },
    storyText: 'Grateful for all the support from friends.',
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
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
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
          thoughts: comicData.thoughts,
          timestamp: comicData.timestamp,
          comments: [],
          featherCount: 0,
          isLiked: false
        };
        return [newPost, ...prev];
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

  return (
    <PhoneFrame>
      <div className="h-full bg-amber-50 flex flex-col">
        {/* Fixed Header */}
        <div className="bg-amber-50 pt-4 pb-2 px-6 z-10">
          <h1 className="text-3xl font-light text-center text-gray-800">
            شاهين / Shaheen Feed
          </h1>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">{post.isAnonymous ? 'Anonymous' : post.username}</p>
                    <ContentModerationBadge safetyScore={95} isApproved={true} />
                  </div>
                  <div className="aspect-square bg-amber-100 rounded-xl mb-4 flex items-center justify-center border-2 border-gray-300 overflow-hidden">
                    <img 
                      src={`/${post.character.id}.png`} 
                      alt={post.character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <button 
                      onClick={() => handleLikeClick(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-gray-700'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.featherCount}</span>
                    </button>
                    <button 
                      onClick={() => handleCommentClick(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        selectedPostId === post.id ? 'text-green-800' : 'text-gray-700'
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
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-700">{comment.isAnonymous ? 'Anonymous' : 'User'}</p>
                              <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                            </div>
                            <button
                              onClick={() => handleCommentLike(post.id, comment.id)}
                              className={`ml-3 flex items-center gap-1 transition-colors ${
                                comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                              <span className="text-xs">{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add comment form */}
                      <div className="bg-white rounded-lg p-3 border border-gray-300">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                                 placeholder="أضف تعليقاً... / Add a comment..."
                          className="w-full p-2 border border-gray-200 rounded-lg focus:border-green-800 focus:outline-none resize-none"
                          rows={2}
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
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-700">{post.comments[0].isAnonymous ? 'Anonymous' : 'User'}</p>
                            <p className="text-sm text-gray-600 mt-1">{post.comments[0].text}</p>
                          </div>
                          <button
                            onClick={() => handleCommentLike(post.id, post.comments[0].id)}
                            className={`ml-3 flex items-center gap-1 transition-colors ${
                              post.comments[0].isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
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
