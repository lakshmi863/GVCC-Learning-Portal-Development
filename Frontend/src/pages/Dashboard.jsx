import React, { useEffect, useState } from 'react';
import { getVideos } from '../services/videoService';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LayoutDashboard, Film, Bookmark, User, LogOut, PlayCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getVideos().then(setVideos);
  }, []);

  // SEARCH FILTER LOGIC
  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f3f5f9] overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0f111a] text-gray-400 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-12 italic border-b border-gray-800 pb-6">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-xs not-italic">G</div> GVCC
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-white rounded-xl border-l-4 border-blue-600">
             <LayoutDashboard size={20} className="text-blue-500"/><span className="font-semibold text-sm">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition rounded-xl"><Film size={20}/><span className="text-sm">All Videos</span></button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition rounded-xl"><Bookmark size={20}/><span className="text-sm">Bookmarks</span></button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition rounded-xl"><User size={20}/><span className="text-sm">Profile</span></button>
        </nav>
        <button onClick={() => { dispatch(logout()); navigate('/login'); }} className="flex items-center gap-3 p-3 hover:text-red-400 transition text-sm font-bold border-t border-gray-800 pt-6">
          <LogOut size={20}/> Logout
        </button>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* --- TOP HEADER --- */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
           <div className="relative w-full max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
             <input type="text" placeholder="Search videos..." className="w-full pl-12 pr-4 py-2.5 bg-[#f3f5f9] rounded-xl outline-none" onChange={(e) => setSearch(e.target.value)} />
           </div>
           <div className="flex items-center gap-6">
              <Bell className="text-gray-400 hover:text-blue-600 cursor-pointer" size={20}/>
              <div className="flex items-center gap-3 border-l pl-6">
                <div className="text-right hidden sm:block leading-none">
                  <p className="text-sm font-black text-gray-800">{user?.name || "Vasu"}</p>
                  <p className="text-[10px] text-blue-500 font-bold uppercase mt-1">Premium Student</p>
                </div>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-10 h-10 rounded-xl bg-gray-100 border p-0.5" />
              </div>
           </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f3f5f9]">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-gray-800 tracking-tight uppercase">Featured Lessons</h2>
              <button className="text-blue-600 bg-white border px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm">View All</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
             {filteredVideos.map(v => (
               <Link key={v._id} to={`/video/${v._id}`} className="group bg-white p-3 rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-100">
                  <div className="relative overflow-hidden rounded-[24px] aspect-video">
                    <img src={v.thumbnailUrl} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" alt={v.title} />
                    <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-black px-2 py-1 rounded-lg"> {v.duration} </span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                       <PlayCircle className="text-white" size={48} />
                    </div>
                  </div>
                  <div className="p-4 pt-6 space-y-3">
                     <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest group-hover:text-blue-600 line-clamp-1 leading-snug">{v.title}</h3>
                     <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">{v.description}</p>
                     <div className="pt-4 border-t flex justify-between items-center text-[10px] font-bold">
                        <span className="text-gray-400 uppercase tracking-tighter">1k+ Learning</span>
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded uppercase">Active</span>
                     </div>
                  </div>
               </Link>
             ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;