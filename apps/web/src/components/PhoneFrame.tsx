import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(1.0); // 0.0 to 1.0

  useEffect(() => {
    // Update time immediately
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(formattedTime);
    };

    updateTime();
    // Update time every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate battery level (in a real app, you'd get this from navigator.getBattery())
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level);
        });
      });
    }
  }, []);

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
               <div className="absolute top-0 left-0 right-0 h-16 bg-white z-20 flex items-center justify-between px-6 pt-8">
                 {/* Left side - Cellular Signal & WiFi */}
                 <div className="flex items-center gap-1.5">
                   {/* Cellular Signal - iOS style bars */}
                   <div className="flex items-end gap-[2px]">
                     <div className="w-[3px] h-[4px] bg-black rounded-[0.5px]"></div>
                     <div className="w-[3px] h-[6px] bg-black rounded-[0.5px]"></div>
                     <div className="w-[3px] h-[8px] bg-black rounded-[0.5px]"></div>
                     <div className="w-[3px] h-[10px] bg-black rounded-[0.5px]"></div>
                   </div>
                   {/* WiFi Signal - iOS style */}
                   <svg className="w-[15px] h-[11px] text-black" fill="currentColor" viewBox="0 0 640 512">
                     <path d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.09 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"/>
                   </svg>
                 </div>
                 
                 {/* Center - Time */}
                 <div className="text-[15px] font-semibold text-black tracking-tight">{currentTime || '9:41'}</div>
                 
                 {/* Right side - Battery Icon (iOS style) */}
                 <div className="flex items-center gap-0">
                   {/* Battery body */}
                   <div className="relative">
                     <div className="w-[22px] h-[11px] border-[1.5px] border-black/90 rounded-[2.5px] bg-white relative overflow-hidden">
                       <div 
                         className={`absolute inset-[2px] rounded-[1px] transition-all ${
                           batteryLevel > 0.2 ? 'bg-green-500' : 'bg-red-500'
                         }`}
                         style={{ width: `${Math.max(2, (batteryLevel * 100) - 4)}%` }}
                       ></div>
                     </div>
                   </div>
                   {/* Battery tip */}
                   <div className="w-[1.5px] h-[7px] bg-black/60 rounded-r-[1px]"></div>
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
