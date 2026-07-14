import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { setUser } from '../features/authSlice';
import { Loader2 } from 'lucide-react'; // For the loading spinner

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // 1. Added loading state
  const [error, setError] = useState(''); // 2. Added error state for better UI
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 3. Start loading
    setError('');

    try {
      const data = await register(formData);
      dispatch(setUser(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false); // 4. Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-blue-600 text-center">Student Sign Up</h2>
        <p className="text-center text-gray-400 mb-8">Create an account to start learning</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg outline-blue-400 disabled:bg-gray-50"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg outline-blue-400 disabled:bg-gray-50"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input 
            type="password" 
            placeholder="Create Password" 
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg outline-blue-400 disabled:bg-gray-50"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold mt-8 hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Creating Account...
            </>
          ) : (
            'Register'
          )}
        </button>

        <p className="mt-6 text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;