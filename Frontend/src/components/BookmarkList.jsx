import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';

const BookmarkList = ({ bookmarks, onSeek }) => {
  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={20} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Video Timeline</h2>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {bookmarks.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No bookmarks added for this lesson.</p>
        ) : (
          bookmarks.map((b) => (
            <button
              key={b._id}
              onClick={() => onSeek(b.timestamp)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <PlayCircle className="text-gray-300 group-hover:text-blue-600 transition" size={20} />
                <span className="text-sm font-semibold text-gray-700">{b.bookmarkName}</span>
              </div>
              <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">
                {formatTime(b.timestamp)}
              </span>
            </button>
          ))
        )}
      </div>
      
      <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest text-center">
        Click to resume playback
      </p>
    </div>
  );
};

export default BookmarkList;