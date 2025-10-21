import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Feather, Plus, BookMarked, Wind } from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelAr: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'feed',
    icon: BookOpen,
    label: 'Feed',
    labelAr: 'الخلاصة',
    path: '/feed'
  },
  {
    id: 'feathers',
    icon: Feather,
    label: 'Feathers',
    labelAr: 'ريش الأمل',
    path: '/feathers'
  },
  {
    id: 'create',
    icon: Plus,
    label: 'Create',
    labelAr: 'إنشاء',
    path: '/'
  },
  {
    id: 'journal',
    icon: BookMarked,
    label: 'Journal',
    labelAr: 'اليوميات',
    path: '/journal'
  },
  {
    id: 'breathing',
    icon: Wind,
    label: 'Breathe',
    labelAr: 'تنفس',
    path: '/breathing'
  }
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/story' || location.pathname === '/comic';
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300">
      <div className="max-w-2xl mx-auto flex justify-around items-center py-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`p-3 ${isActive(item.path) ? 'text-green-800' : 'text-gray-500'}`}
          >
            {item.id === 'create' ? (
              <div className="p-4 bg-green-800 rounded-full text-white -mt-6">
                <item.icon className="w-6 h-6" />
              </div>
            ) : (
              <item.icon className="w-6 h-6" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
