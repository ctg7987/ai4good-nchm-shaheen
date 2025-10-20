import React from 'react';

export const FalconComic: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Shaheen's Journey: Learning to Flow with the Winds
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Panel 1: Falcon struggling against strong winds */}
        <div className="bg-gradient-to-b from-blue-200 to-gray-300 p-4 rounded-lg border-2 border-gray-400">
          <svg viewBox="0 0 300 250" className="w-full h-64">
            {/* Storm clouds */}
            <path d="M20 50 Q50 20 80 50 Q110 20 140 50 Q170 20 200 50 Q230 20 260 50 Q290 20 320 50" 
                  fill="#666" stroke="#444" strokeWidth="2"/>
            <path d="M40 80 Q70 50 100 80 Q130 50 160 80 Q190 50 220 80 Q250 50 280 80" 
                  fill="#777" stroke="#555" strokeWidth="2"/>
            
            {/* Strong wind lines */}
            <line x1="50" y1="120" x2="120" y2="100" stroke="#8B4513" strokeWidth="3" opacity="0.8"/>
            <line x1="80" y1="140" x2="150" y2="120" stroke="#8B4513" strokeWidth="3" opacity="0.8"/>
            <line x1="110" y1="160" x2="180" y2="140" stroke="#8B4513" strokeWidth="3" opacity="0.8"/>
            <line x1="140" y1="180" x2="210" y2="160" stroke="#8B4513" strokeWidth="3" opacity="0.8"/>
            
            {/* Falcon struggling (angled against wind) */}
            <g transform="translate(180, 150) rotate(-30)">
              {/* Falcon body */}
              <ellipse cx="0" cy="0" rx="25" ry="15" fill="#8B4513"/>
              {/* Falcon head */}
              <circle cx="-15" cy="-5" r="12" fill="#8B4513"/>
              {/* Beak */}
              <polygon points="-25,-8 -35,-5 -25,-2" fill="#FFA500"/>
              {/* Wings spread wide, struggling */}
              <path d="M10,0 Q30,-20 50,-10 Q40,-30 60,-20" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              <path d="M10,0 Q30,20 50,10 Q40,30 60,20" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              {/* Tail feathers */}
              <path d="M25,0 Q35,10 45,5 Q40,15 50,10" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
            </g>
            
            {/* Stress lines around falcon */}
            <path d="M160,140 Q170,130 180,140" stroke="#FF0000" strokeWidth="2" fill="none"/>
            <path d="M175,135 Q185,125 195,135" stroke="#FF0000" strokeWidth="2" fill="none"/>
          </svg>
          <p className="text-center mt-2 text-sm font-medium text-gray-700">
            Panel 1: Fighting the Storm
          </p>
        </div>

        {/* Panel 2: Falcon being tossed around more violently */}
        <div className="bg-gradient-to-b from-gray-300 to-gray-500 p-4 rounded-lg border-2 border-gray-400">
          <svg viewBox="0 0 300 250" className="w-full h-64">
            {/* Darker storm clouds */}
            <path d="M20 50 Q50 20 80 50 Q110 20 140 50 Q170 20 200 50 Q230 20 260 50 Q290 20 320 50" 
                  fill="#444" stroke="#222" strokeWidth="2"/>
            <path d="M40 80 Q70 50 100 80 Q130 50 160 80 Q190 50 220 80 Q250 50 280 80" 
                  fill="#555" stroke="#333" strokeWidth="2"/>
            
            {/* Even stronger wind lines */}
            <line x1="40" y1="100" x2="110" y2="80" stroke="#654321" strokeWidth="4" opacity="0.9"/>
            <line x1="70" y1="120" x2="140" y2="100" stroke="#654321" strokeWidth="4" opacity="0.9"/>
            <line x1="100" y1="140" x2="170" y2="120" stroke="#654321" strokeWidth="4" opacity="0.9"/>
            <line x1="130" y1="160" x2="200" y2="140" stroke="#654321" strokeWidth="4" opacity="0.9"/>
            
            {/* Falcon being tossed (more dramatic angle) */}
            <g transform="translate(200, 180) rotate(-60)">
              {/* Falcon body */}
              <ellipse cx="0" cy="0" rx="25" ry="15" fill="#8B4513"/>
              {/* Falcon head */}
              <circle cx="-15" cy="-5" r="12" fill="#8B4513"/>
              {/* Beak */}
              <polygon points="-25,-8 -35,-5 -25,-2" fill="#FFA500"/>
              {/* Wings in distress position */}
              <path d="M10,0 Q20,-25 30,-15 Q25,-35 35,-25" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              <path d="M10,0 Q20,25 30,15 Q25,35 35,25" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              {/* Tail feathers */}
              <path d="M25,0 Q30,15 35,10 Q32,25 37,20" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
            </g>
            
            {/* More stress lines */}
            <path d="M180,160 Q190,150 200,160" stroke="#FF0000" strokeWidth="2" fill="none"/>
            <path d="M185,155 Q195,145 205,155" stroke="#FF0000" strokeWidth="2" fill="none"/>
            <path d="M190,170 Q200,160 210,170" stroke="#FF0000" strokeWidth="2" fill="none"/>
          </svg>
          <p className="text-center mt-2 text-sm font-medium text-gray-700">
            Panel 2: Being Tossed Around
          </p>
        </div>

        {/* Panel 3: Falcon starting to observe and understand the wind */}
        <div className="bg-gradient-to-b from-blue-300 to-blue-400 p-4 rounded-lg border-2 border-blue-500">
          <svg viewBox="0 0 300 250" className="w-full h-64">
            {/* Lighter clouds - storm calming */}
            <path d="M20 50 Q50 20 80 50 Q110 20 140 50 Q170 20 200 50 Q230 20 260 50 Q290 20 320 50" 
                  fill="#87CEEB" stroke="#4682B4" strokeWidth="2"/>
            <path d="M40 80 Q70 50 100 80 Q130 50 160 80 Q190 50 220 80 Q250 50 280 80" 
                  fill="#98D8E8" stroke="#5F9EA0" strokeWidth="2"/>
            
            {/* Wind lines showing direction */}
            <line x1="60" y1="120" x2="90" y2="115" stroke="#4682B4" strokeWidth="2" opacity="0.7"/>
            <line x1="80" y1="140" x2="110" y2="135" stroke="#4682B4" strokeWidth="2" opacity="0.7"/>
            <line x1="100" y1="160" x2="130" y2="155" stroke="#4682B4" strokeWidth="2" opacity="0.7"/>
            <line x1="120" y1="180" x2="150" y2="175" stroke="#4682B4" strokeWidth="2" opacity="0.7"/>
            
            {/* Falcon in observation pose (more stable) */}
            <g transform="translate(150, 140) rotate(-10)">
              {/* Falcon body */}
              <ellipse cx="0" cy="0" rx="25" ry="15" fill="#8B4513"/>
              {/* Falcon head looking around */}
              <circle cx="-15" cy="-5" r="12" fill="#8B4513"/>
              {/* Beak */}
              <polygon points="-25,-8 -35,-5 -25,-2" fill="#FFA500"/>
              {/* Wings partially spread, learning position */}
              <path d="M10,0 Q25,-15 40,-8 Q35,-20 50,-15" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              <path d="M10,0 Q25,15 40,8 Q35,20 50,15" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              {/* Tail feathers */}
              <path d="M25,0 Q30,10 35,8 Q32,18 37,15" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
            </g>
            
            {/* Lightbulb or realization symbol */}
            <circle cx="220" cy="100" r="15" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
            <path d="M220,85 Q225,75 230,85" stroke="#FFA500" strokeWidth="2" fill="none"/>
          </svg>
          <p className="text-center mt-2 text-sm font-medium text-blue-800">
            Panel 3: Understanding the Wind
          </p>
        </div>

        {/* Panel 4: Falcon flowing gracefully with the wind */}
        <div className="bg-gradient-to-b from-blue-400 to-green-300 p-4 rounded-lg border-2 border-green-500">
          <svg viewBox="0 0 300 250" className="w-full h-64">
            {/* Clear sky with gentle clouds */}
            <path d="M20 50 Q50 20 80 50 Q110 20 140 50 Q170 20 200 50 Q230 20 260 50 Q290 20 320 50" 
                  fill="#E0F6FF" stroke="#87CEEB" strokeWidth="1"/>
            
            {/* Gentle wind lines showing flow */}
            <line x1="50" y1="100" x2="80" y2="95" stroke="#87CEEB" strokeWidth="2" opacity="0.6"/>
            <line x1="70" y1="120" x2="100" y2="115" stroke="#87CEEB" strokeWidth="2" opacity="0.6"/>
            <line x1="90" y1="140" x2="120" y2="135" stroke="#87CEEB" strokeWidth="2" opacity="0.6"/>
            <line x1="110" y1="160" x2="140" y2="155" stroke="#87CEEB" strokeWidth="2" opacity="0.6"/>
            
            {/* Falcon soaring gracefully with the wind */}
            <g transform="translate(120, 120) rotate(15)">
              {/* Falcon body */}
              <ellipse cx="0" cy="0" rx="25" ry="15" fill="#8B4513"/>
              {/* Falcon head */}
              <circle cx="-15" cy="-5" r="12" fill="#8B4513"/>
              {/* Beak */}
              <polygon points="-25,-8 -35,-5 -25,-2" fill="#FFA500"/>
              {/* Wings spread wide in soaring position */}
              <path d="M10,0 Q35,-25 60,-15 Q50,-35 75,-25" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              <path d="M10,0 Q35,25 60,15 Q50,35 75,25" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
              {/* Tail feathers spread for control */}
              <path d="M25,0 Q35,15 45,10 Q40,25 50,20" fill="#654321" stroke="#8B4513" strokeWidth="2"/>
            </g>
            
            {/* Success symbols */}
            <text x="200" y="80" fontSize="20" fill="#00AA00">✨</text>
            <text x="180" y="100" fontSize="16" fill="#00AA00">🌟</text>
            <text x="220" y="90" fontSize="14" fill="#00AA00">⭐</text>
          </svg>
          <p className="text-center mt-2 text-sm font-medium text-green-800">
            Panel 4: Soaring with the Wind
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg text-gray-700 italic">
          "Like Shaheen, we too can learn to flow with life's storms instead of fighting them."
        </p>
        <p className="text-sm text-gray-600 mt-2">
          A metaphor for emotional resilience and adaptive coping strategies
        </p>
      </div>
    </div>
  );
};

export default FalconComic;

