import React, { useEffect, useState } from 'react';

// Simple mobile-vs-desktop detector based on viewport width.
// Adjust the breakpoint if your design system uses a different one.
const MOBILE_BREAKPOINT = 768;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
};

const OfflineScreen = () => {
  const isOnline = useOnlineStatus();
  const isMobile = useIsMobile();

  if (isOnline) return null;

  const imageSrc = isMobile ? '/offline-mobile.png' : '/offline-desktop.png';

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
      <img
        src={imageSrc}
        alt="No internet connection"
        className="max-w-xs w-full mb-6"
      />
      <h2 className="text-xl font-bold text-gray-800">No Internet Connection</h2>
      <p className="text-gray-500 mt-2 max-w-sm">
        Please check your Wi-Fi or mobile data and try again. This page will
        reconnect automatically once you're back online.
      </p>
    </div>
  );
};

export default OfflineScreen;
