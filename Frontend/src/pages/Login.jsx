import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { setUser } from '../features/authSlice';
import { Loader2 } from 'lucide-react'; // Optional: if you have lucide-react installed

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 1. Added loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 2. Start loading
    setError('');     // Clear previous errors
    
    try {
      const data = await login(formData);
      dispatch(setUser(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // 3. Stop loading regardless of success or failure
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Login to your account to continue</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required
              disabled={loading} // Disable while loading
              className="w-full p-3 border rounded-lg mt-1 outline-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              disabled={loading} // Disable while loading
              className="w-full p-3 border rounded-lg mt-1 outline-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} // 4. Disable button while loading
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold mt-8 hover:bg-blue-700 transition-all flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> 
              Authenticating...
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="mt-6 text-center text-gray-500">
          New here? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Join our community</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;