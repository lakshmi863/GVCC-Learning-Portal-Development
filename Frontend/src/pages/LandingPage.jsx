import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, Search, LayoutDashboard, Film, Bookmark as BookmarkIcon, 
  User, Rocket, ArrowRight, Clock, Trash2, Filter
} from 'lucide-react';

const LandingPage = () => {
  // --- 1. STATES ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);   // Controls Left Nav Sidebar
  const [isBookmarkOpen, setBookmarkOpen] = useState(false); // Controls Right Bookmarks Panel
  const [myBookmarks, setMyBookmarks] = useState([]);        // Local Bookmarks data

  // --- 2. DATA LOADING ---
  // We use the same key used in your VideoDetail.js: 'bookmarks'
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setMyBookmarks(saved);
  }, [isBookmarkOpen]); // Re-load whenever panel is opened

  const deleteLocalBookmark = (id) => {
    const filtered = myBookmarks.filter(b => b._id !== id);
    setMyBookmarks(filtered);
    localStorage.setItem('bookmarks', JSON.stringify(filtered));
  };

  return (
    <div className="bg-[#0f111a] min-h-screen text-white font-sans overflow-hidden">
      
      {/* --- A. OVERLAYS (Dim the background when either panel is open) --- */}
      {(isSidebarOpen || isBookmarkOpen) && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => { setSidebarOpen(false); setBookmarkOpen(false); }}
        ></div>
      )}

      {/* --- B. LEFT SIDEBAR (The Navigation Drawer) --- */}
      <aside className={`fixed top-0 left-0 z-[60] h-screen w-80 bg-[#161b2a] border-r border-gray-800 p-8 transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-black italic tracking-tighter">GVCC <span className="text-blue-500 font-normal">Learning</span></div>
          <button onClick={() => setSidebarOpen(false)}><X className="text-gray-500" /></button>
        </div>

        <nav className="space-y-3">
          <Link to="/login" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-gray-400 font-bold"><LayoutDashboard size={20}/> Dashboard</Link>
          <Link to="/login" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-gray-400 font-bold"><Film size={20}/> All Videos</Link>
          
          {/* --- THIS BUTTON TRIGGERED THE ISSUE --- */}
          <button 
            onClick={() => { 
                setBookmarkOpen(true); // Open the bookmarks panel
                setSidebarOpen(false); // Close this sidebar
            }}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-blue-600/10 text-blue-500 font-bold text-left border border-blue-600/20"
          >
            <BookmarkIcon size={20}/> My Bookmarks
          </button>
          
          <Link to="/login" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-blue-600/10 text-gray-400 font-bold"><User size={20}/> Profile</Link>
        </nav>
      </aside>

      {/* --- C. RIGHT SIDEBAR (The Bookmarks Panel) --- */}
      <aside className={`fixed top-0 right-0 z-[60] h-screen w-full md:w-[450px] bg-[#1a1f2e] border-l border-gray-800 p-8 shadow-2xl transform transition-transform duration-500 ease-in-out ${isBookmarkOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <BookmarkIcon className="text-blue-500 fill-blue-500" /> Saved Content
          </h2>
          <button onClick={() => setBookmarkOpen(false)} className="bg-gray-800 p-2 rounded-xl hover:bg-red-500 transition-colors"><X size={20}/></button>
        </div>

        {/* List of Bookmarks */}
        <div className="space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar pr-2">
          {myBookmarks.length === 0 ? (
            <div className="py-20 text-center opacity-30 italic text-sm">You haven't saved any lessons yet.</div>
          ) : (
            myBookmarks.map((b) => (
              <div key={b._id} className="group bg-[#0f111a] p-5 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all relative">
                <Link to={`/video/${b.videoId}`} className="block">
                  <p className="font-bold text-gray-100 group-hover:text-blue-400 mb-2">{b.bookmarkName}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    <Clock size={12}/> {Math.floor(b.timestamp)}s
                    <span className="text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded">Saved Lesson</span>
                  </div>
                </Link>
                <button 
                   onClick={() => deleteLocalBookmark(b._id)}
                   className="absolute top-5 right-5 text-gray-700 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <Link 
          to="/register" 
          className="mt-10 block w-full bg-blue-600 text-center py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-600/20"
        >
          View More in Dashboard
        </Link>
      </aside>

      {/* --- D. TOP NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-[#0f111a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-blue-600 transition group">
              <Menu className="text-gray-300 group-hover:text-white" />
            </button>
            <div className="text-2xl font-black italic tracking-tighter uppercase hidden sm:block">GVCC</div>
          </div>
          
          {/* Central Search in Nav */}
          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
            <input type="text" placeholder="Search..." className="w-full bg-gray-900 border border-gray-800 py-2.5 pl-12 pr-4 rounded-2xl text-xs" />
          </div>

          <div className="flex gap-4">
             <button onClick={() => setBookmarkOpen(true)} className="text-gray-400 hover:text-white transition sm:flex hidden items-center gap-2 font-bold text-xs uppercase tracking-widest">
                <BookmarkIcon size={18}/> Bookmarks
             </button>
             <Link to="/login" className="bg-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* --- E. HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-10 text-center lg:text-left">
          <h1 className="text-6xl md:text-[6rem] font-black leading-[0.85] tracking-tighter uppercase italic">
            YOUR SAVED <br/> <span className="text-blue-500 not-italic">LEARNING.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Resume your training immediately. Access all your time-stamped bookmarks even without logging in.
          </p>
          <button 
            onClick={() => setBookmarkOpen(true)}
            className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto lg:mx-0"
          >
            Open Bookmarks <ArrowRight />
          </button>
        </div>
        <div className="flex-1">
          <img src="https://img.freepik.com/free-vector/modern-man-character-teaching-remotely_23-2148529285.jpg" className="rounded-[40px] shadow-2xl grayscale hover:grayscale-0 transition duration-500 border border-white/10" alt="Hero" />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;