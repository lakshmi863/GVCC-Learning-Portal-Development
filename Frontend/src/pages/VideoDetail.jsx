import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getVideoById } from '../services/videoService';
import {
  getBookmarks,
  saveBookmark,
  updateBookmark,
  deleteBookmark,
} from '../services/bookmarkService';
import ProtectionWrapper from '../components/ProtectionWrapper';
import {
  Bookmark as BookmarkIcon,
  Play,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';

const RECENT_KEY = 'recentVideos';
const PROGRESS_KEY = 'watchProgress';
const MAX_RECENT = 5;

const VideoDetail = () => {
  const { id } = useParams();
  const playerRef = useRef(null);
  const lastSavedRef = useRef(0); // throttle localStorage writes

  const [video, setVideo] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);

  // Watch progress
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Add-bookmark inline form
  const [showAddForm, setShowAddForm] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  // Edit-bookmark inline state
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');

  useEffect(() => {
    getVideoById(id)
      .then(setVideo)
      .catch(() => setError('Failed to load video metadata.'));

    getBookmarks(id)
      .then(setBookmarks)
      .catch(() => console.log('No bookmarks found.'));

    // --- Recently Watched ---
    try {
      const history = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      const updated = [id, ...history.filter((v) => v !== id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable / corrupted — ignore, non-critical feature
    }

    // Reset per-video player state when navigating between videos
    setCurrentTime(0);
    setDuration(0);
  }, [id]);

  // --- Continue Watching: resume from saved position once the player is ready ---
  const handleReady = (player) => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')[id];
      if (saved && saved.time > 5 && (!saved.duration || saved.time < saved.duration - 5)) {
        player.currentTime = saved.time;
      }
    } catch {
      // ignore
    }
  };

  // --- Watch progress indicator + periodic save ---
  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player) return;

    setCurrentTime(player.currentTime);

    // Throttle localStorage writes to roughly once a second
    if (player.currentTime - lastSavedRef.current >= 1) {
      lastSavedRef.current = player.currentTime;
      try {
        const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
        all[id] = {
          time: player.currentTime,
          duration: player.duration || duration,
          updatedAt: Date.now(),
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
      } catch {
        // ignore
      }
    }
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (player?.duration) setDuration(player.duration);
  };

  const handleSeek = (time) => {
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  // --- Add bookmark ---
  const handleAddBookmark = async () => {
    if (!playerRef.current) return;
    const time = playerRef.current.currentTime;
    const name = noteDraft.trim() || `Bookmark at ${Math.floor(time)}s`;

    try {
      const newB = await saveBookmark({ videoId: id, timestamp: time, bookmarkName: name });
      setBookmarks((prev) => [...prev, newB]);
      setNoteDraft('');
      setShowAddForm(false);
    } catch (err) {
      alert('Error saving bookmark. Is the backend running?');
    }
  };

  // --- Edit bookmark ---
  const startEdit = (b) => {
    setEditingId(b._id);
    setEditDraft(b.bookmarkName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft('');
  };

  const saveEdit = async (bId) => {
    const trimmed = editDraft.trim();
    if (!trimmed) return cancelEdit();
    try {
      const updated = await updateBookmark(bId, trimmed);
      setBookmarks((prev) =>
        prev.map((b) => (b._id === bId ? { ...b, bookmarkName: updated.bookmarkName } : b))
      );
    } catch (err) {
      alert('Error updating bookmark.');
    } finally {
      cancelEdit();
    }
  };

  // --- Delete bookmark ---
  const handleDelete = async (bId) => {
    if (!window.confirm('Delete this bookmark?')) return;
    try {
      await deleteBookmark(bId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bId));
    } catch (err) {
      alert('Error deleting bookmark.');
    }
  };

  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return '00:00';
    return new Date(sec * 1000).toISOString().substr(14, 5);
  };

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!video) return <p className="p-10 text-center">Loading Lesson...</p>;

  if (!video.videoUrl) {
    return (
      <div className="p-10 text-center text-red-500">
        This video has no playable URL. Check the API response (see console).
      </div>
    );
  }

  const progressPct = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex-[3] p-4">
        <ProtectionWrapper>
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
            <ReactPlayer
              key={video._id}
              ref={playerRef}
              src={video.videoUrl}
              controls
              width="100%"
              height="100%"
              onReady={handleReady}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onError={(e) => {
                console.error('ReactPlayer error:', e);
                setError('This video link is broken or restricted by the provider.');
              }}
            />
          </div>
        </ProtectionWrapper>

        {/* Watch progress indicator */}
        <div className="mt-3">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <p className="text-gray-600 mt-1">{video.description}</p>
          </div>
          <button
            onClick={() => setShowAddForm((s) => !s)}
            className="bg-blue-600 text-white px-5 py-2 rounded-full flex items-center gap-2 shrink-0"
          >
            <BookmarkIcon size={18} /> Add Bookmark
          </button>
        </div>

        {/* Inline add-bookmark form */}
        {showAddForm && (
          <div className="mt-4 flex gap-2">
            <input
              autoFocus
              type="text"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBookmark()}
              placeholder={`Note for ${formatTime(playerRef.current?.currentTime || 0)}...`}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddBookmark}
              className="bg-blue-600 text-white px-4 rounded-lg text-sm font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNoteDraft('');
              }}
              className="px-3 rounded-lg text-sm text-gray-500 border"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex-[1] bg-white border-l p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Lesson Bookmarks</h2>
        {bookmarks.length === 0 && <p className="text-gray-400">No bookmarks saved yet.</p>}

        {bookmarks.map((b) => (
          <div
            key={b._id}
            className="p-4 mb-3 border rounded-lg hover:bg-blue-50 transition flex items-center justify-between group"
          >
            {editingId === b._id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(b._id)}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <Check
                  size={18}
                  className="text-green-600 cursor-pointer"
                  onClick={() => saveEdit(b._id)}
                />
                <X size={18} className="text-gray-400 cursor-pointer" onClick={cancelEdit} />
              </div>
            ) : (
              <>
                <div className="cursor-pointer flex-1" onClick={() => handleSeek(b.timestamp)}>
                  <p className="font-medium text-blue-700">{b.bookmarkName}</p>
                  <p className="text-xs text-gray-500">Timestamp: {formatTime(b.timestamp)}</p>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
                  <Pencil
                    size={16}
                    className="text-gray-400 hover:text-blue-600 cursor-pointer"
                    onClick={() => startEdit(b)}
                  />
                  <Trash2
                    size={16}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => handleDelete(b._id)}
                  />
                  <Play size={16} className="text-blue-600" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetail;