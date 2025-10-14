import React from 'react';

export const NonClinicalBanner: React.FC = () => {
  return (
    <div 
      className="bg-accent-100 border-b border-accent-200 py-2 px-4"
      role="banner"
      aria-label="تنبيه غير سريري"
    >
      <div className="container mx-auto text-center">
        <p className="text-accent-800 font-medium text-sm" role="alert">
          غير سريري — أداة للتعلم العاطفي فقط
        </p>
      </div>
    </div>
  );
};
