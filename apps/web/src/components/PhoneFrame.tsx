import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '' }) => {
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
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-200 to-stone-300 p-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Phone Frame - Made Bigger */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[4rem] p-3 shadow-2xl">
          {/* Phone Screen */}
          <div className="bg-black rounded-[3.5rem] p-2">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-10"></div>
            
            {/* Screen Content - Bigger */}
            <div className="bg-white rounded-[3.4rem] overflow-hidden relative" style={{ width: '450px', height: '950px' }}>
               {/* Status Bar */}
               <div className="absolute top-0 left-0 right-0 h-16 bg-white z-20 flex items-center justify-between px-8 pt-8">
                 {/* Left side - Network & Signal */}
                 <div className="flex items-center space-x-2">
                   {/* Cellular Signal */}
                   <div className="flex items-end space-x-1">
                     <div className="w-1 h-1 bg-black rounded-full"></div>
                     <div className="w-1 h-2 bg-black rounded-full"></div>
                     <div className="w-1 h-3 bg-black rounded-full"></div>
                     <div className="w-1 h-4 bg-black rounded-full"></div>
                   </div>
                   {/* WiFi Signal */}
                   <div className="flex items-center">
                     <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                     </svg>
                   </div>
                 </div>
                 
                 {/* Center - Time */}
                 <div className="text-lg font-semibold text-black">9:41</div>
                 
                 {/* Right side - Battery & Other indicators */}
                 <div className="flex items-center space-x-2">
                   {/* Battery */}
                   <div className="flex items-center">
                     <div className="w-8 h-4 border-2 border-black rounded-sm relative">
                       <div className="w-6 h-2 bg-green-500 rounded-sm m-0.5"></div>
                     </div>
                     <div className="w-1 h-2 bg-black rounded-r-sm -ml-1"></div>
                   </div>
                   {/* Battery percentage */}
                   <div className="text-sm font-medium text-black">100%</div>
                 </div>
               </div>

              {/* Main Content */}
              <div className="pt-16 h-full overflow-hidden relative flex flex-col">
                {children}
                
                {/* Bottom Navigation Inside Phone */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 z-30">
                  <div className="max-w-2xl mx-auto flex justify-around items-center py-4">
                    <button 
                      onClick={() => handleNavigation('/feed')}
                      className={`p-4 ${isActive('/feed') ? 'text-green-800' : 'text-gray-500'}`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/feathers')}
                      className={`p-4 ${isActive('/feathers') ? 'text-green-800' : 'text-gray-500'}`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 110 2h-1v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6H4a1 1 0 110-2h3zM9 6v10h6V6H9z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/')}
                      className="p-6 bg-green-800 rounded-full text-white -mt-8 shadow-lg hover:bg-green-900 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/journal')}
                      className={`p-4 ${isActive('/journal') ? 'text-green-800' : 'text-gray-500'}`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/breathing')}
                      className={`p-4 ${isActive('/breathing') ? 'text-green-800' : 'text-gray-500'}`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gray-400 rounded-full"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-amber-300 rounded-full opacity-60"></div>
        <div className="absolute -top-3 -right-8 w-8 h-8 bg-green-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-6 -left-8 w-14 h-14 bg-pink-300 rounded-full opacity-60"></div>
        <div className="absolute -bottom-3 -right-6 w-10 h-10 bg-blue-300 rounded-full opacity-60"></div>
      </motion.div>
    </div>
  );
};
