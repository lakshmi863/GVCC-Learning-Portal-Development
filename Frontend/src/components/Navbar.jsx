import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null; // Hide if not logged in

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <img src="/Gvcc.png" alt="GVCC Logo" className="h-9 w-auto object-contain" />
      </Link>
      <div className="flex items-center gap-6">
        <span className="text-gray-600 hidden sm:block">Hello, <b>{user.name}</b></span>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-medium hover:text-red-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;