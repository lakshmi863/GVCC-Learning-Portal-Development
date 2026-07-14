import React, { useEffect, useState } from 'react';
import { getVideos } from '../services/videoService';
import { Link } from 'react-router-dom';
import { PlayCircle, History } from 'lucide-react';

const PROGRESS_KEY = 'watchProgress';
const RECENT_KEY = 'recentVideos';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    getVideos()
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    try {
      setProgressMap(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'));
      setRecentIds(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
    } catch {
      // ignore corrupted localStorage
    }
  }, []);

  const handleImageError = (e) => {
    if (e.target.src.includes('maxresdefault')) {
      e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
    } else {
      e.target.src = 'https://via.placeholder.com/640x360?text=Preview+Unavailable';
    }
  };

  const getProgressPct = (videoId) => {
    const p = progressMap[videoId];
    if (!p || !p.duration) return 0;
    return Math.min(100, Math.round((p.time / p.duration) * 100));
  };

  // Videos with meaningful progress that isn't "finished"
  const continueWatching = videos.filter((v) => {
    const pct = getProgressPct(v._id);
    return pct > 3 && pct < 95;
  });

  // Recently watched, most-recent-first, mapped to full video objects
  const recentlyWatched = recentIds
    .map((id) => videos.find((v) => v._id === id))
    .filter(Boolean);

  const VideoCard = ({ v, showProgress = true }) => (
    <Link
      key={v._id}
      to={`/video/${v._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={v.thumbnailUrl}
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
          alt={v.title}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <PlayCircle className="text-white drop-shadow-lg" size={48} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[11px] px-2 py-1 rounded-md font-bold">
          {v.duration}
        </div>
      </div>

      <div className="p-5 flex-grow">
        <h3 className="font-bold text-gray-800 text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition">
          {v.title}
        </h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 italic">
          {v.description || 'Start learning the core concepts of this lesson.'}
        </p>
      </div>

      {showProgress && (
        <div className="w-full h-1 bg-gray-100 group-hover:bg-blue-100">
          <div
            className="h-full bg-blue-600 transition-all duration-700"
            style={{ width: `${getProgressPct(v._id)}%` }}
          />
        </div>
      )}
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Continue Your <span className="text-blue-600">Learning</span>
          </h1>
          <p className="text-gray-500 mt-2">Pick up exactly where you left off in your bookmarks.</p>
        </header>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlayCircle size={20} className="text-blue-600" /> Continue Watching
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {continueWatching.map((v) => (
                <VideoCard key={v._id} v={v} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Watched */}
        {recentlyWatched.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-blue-600" /> Recently Watched
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentlyWatched.map((v) => (
                <Link
                  key={v._id}
                  to={`/video/${v._id}`}
                  className="group flex-shrink-0 w-56 bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={v.thumbnailUrl}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                      alt={v.title}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{v.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Videos */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Lessons</h2>
          {videos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
              <p className="text-gray-400 text-lg">No lessons available in the database yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((v) => (
                <VideoCard key={v._id} v={v} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;