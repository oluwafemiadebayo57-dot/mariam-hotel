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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-luxury-charcoal p-8 rounded-2xl border border-luxury-gold/20 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-luxury-gold mb-2">Admin Portal</h2>
          <p className="text-gray-400 text-sm">Log in to manage reservations</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors" placeholder="admin@mariamhotel.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-luxury-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors" placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-royal hover:bg-royal-dark text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(10,61,145,0.4)] disabled:opacity-50">
            {loading ? 'Logging in...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}