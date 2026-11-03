import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-brand-offwhite">
      <div className="bg-brand-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-brand-blue mb-2">Admin Portal</h2>
          <p className="text-brand-text-muted text-sm">Log in to manage reservations</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-brand-text mb-2">Email</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              // Added text-brand-text and placeholder-gray-400 here
              className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" 
              placeholder="mariamhotels@gmail.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-text mb-2">Password</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              // Added text-brand-text and placeholder-gray-400 here
              className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            {loading ? 'Logging in...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}