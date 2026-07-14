import React, { useState, useEffect } from 'react';

const ProtectionWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide content ONLY when user switches tabs or minimizes the browser
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Deter common screenshot keys
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        alert("Screenshot/Print is disabled.");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative select-none">
      <div style={{ filter: isVisible ? 'none' : 'blur(50px)', transition: '0.4s' }}>
        {children}
      </div>
      {!isVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-50 text-center p-4">
           <h2 className="text-xl font-bold">Content Protected</h2>
           <p className="text-sm opacity-60">Please stay on the lesson tab to continue viewing.</p>
        </div>
      )}
    </div>
  );
};

export default ProtectionWrapper;