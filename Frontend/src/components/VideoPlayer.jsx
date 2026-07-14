import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getVideoById } from '../services/videoService';
import { getBookmarks, saveBookmark } from '../services/bookmarkService';
import ProtectionWrapper from '../components/ProtectionWrapper';
import { Bookmark as BookmarkIcon, Play } from 'lucide-react';

const VideoDetail = () => {
  const { id } = useParams();
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVideoById(id)
      .then(setVideo)
      .catch(() => setError("Failed to load video metadata."));

    getBookmarks(id)
      .then(setBookmarks)
      .catch(() => console.log("No bookmarks found."));
  }, [id]);

  const handleAddBookmark = async () => {
    if (!playerRef.current) return;

    // v3: currentTime is a property, not a getCurrentTime() method
    const time = playerRef.current.currentTime;
    const name = prompt("Name your bookmark:") || `Bookmark at ${Math.floor(time)}s`;

    try {
      const newB = await saveBookmark({ videoId: id, timestamp: time, bookmarkName: name });
      setBookmarks((prev) => [...prev, newB]);
    } catch (err) {
      alert("Error saving bookmark. Is the backend running?");
    }
  };

  const handleSeek = (time) => {
    if (playerRef.current) {
      // v3: set currentTime directly instead of calling seekTo()
      playerRef.current.currentTime = time;
    }
  };

  const formatTime = (sec) => new Date(sec * 1000).toISOString().substr(14, 5);

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!video) return <p className="p-10 text-center">Loading Lesson...</p>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex-[3] p-4">
        <ProtectionWrapper>
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
            <ReactPlayer
              ref={playerRef}
              src={video.videoUrl}
              controls
              width="100%"
              height="100%"
              onError={(e) => setError("This video link is broken or restricted by the provider.")}
            />
          </div>
        </ProtectionWrapper>
        <div className="mt-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <p className="text-gray-600 mt-1">{video.description}</p>
          </div>
          <button onClick={handleAddBookmark} className="bg-blue-600 text-white px-5 py-2 rounded-full flex items-center gap-2">
            <BookmarkIcon size={18} /> Save Bookmark
          </button>
        </div>
      </div>

      <div className="flex-[1] bg-white border-l p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Lesson Bookmarks</h2>
        {bookmarks.length === 0 && <p className="text-gray-400">No bookmarks saved yet.</p>}
        {bookmarks.map((b, i) => (
          <div key={b._id || i} onClick={() => handleSeek(b.timestamp)} className="p-4 mb-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-700">{b.bookmarkName}</p>
              <p className="text-xs text-gray-500">Timestamp: {formatTime(b.timestamp)}</p>
            </div>
            <Play size={16} className="text-blue-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetail;