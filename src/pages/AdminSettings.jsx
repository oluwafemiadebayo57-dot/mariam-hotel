import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    bankName: 'GTBank',
    accountName: 'Mariam Hotel & Bar',
    accountNumber: '0123456789',
    phone1: '0708 309 3585',
    phone2: '0803 364 3328',
    email: 'hello@mariamhotel.com',
    address: '14 Lafe Road, beside Lafe Inn Road, Akure 340271, Ondo State, Nigeria.'
  });

  // Fetch existing settings when the page loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "hotelInfo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save to Firebase in the "settings" collection, "hotelInfo" document
      await setDoc(doc(db, "settings", "hotelInfo"), settings);
      alert("Settings updated successfully! The website will now reflect these changes.");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-brand-blue font-bold">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[85vh] bg-brand-offwhite">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-blue mb-2">Site Settings</h1>
          <p className="text-brand-text-muted text-sm">Update payment details and contact information.</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="text-brand-text-muted hover:text-brand-blue border border-gray-300 bg-brand-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm">
          &larr; Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* PAYMENT SETTINGS */}
        <div className="bg-brand-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl text-brand-blue font-serif mb-6 border-b border-gray-100 pb-3">Payment Details (Bank Transfer)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-text mb-2">Bank Name</label>
              <input required type="text" name="bankName" value={settings.bankName} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:border-brand-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-text mb-2">Account Name</label>
              <input required type="text" name="accountName" value={settings.accountName} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:border-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-brand-text mb-2">Account Number</label>
              <input required type="text" name="accountNumber" value={settings.accountNumber} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text font-bold tracking-wider focus:border-brand-blue outline-none" />
            </div>
          </div>
        </div>

        {/* CONTACT SETTINGS */}
        <div className="bg-brand-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl text-brand-blue font-serif mb-6 border-b border-gray-100 pb-3">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-text mb-2">Primary Phone Number</label>
              <input required type="text" name="phone1" value={settings.phone1} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:border-brand-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-text mb-2">Secondary Phone Number</label>
              <input type="text" name="phone2" value={settings.phone2} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:border-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-brand-text mb-2">Email Address</label>
              <input required type="email" name="email" value={settings.email} onChange={handleChange} className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:border-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-brand-text mb-2">Full Address</label>
              <textarea required name="address" value={settings.address} onChange={handleChange} rows="2" className="w-full bg-brand-offwhite border border-gray-300 rounded-lg px-4 py-3 text-brand-text focus:border-brand-blue outline-none"></textarea>
            </div>
          </div>
        </div>

        <button disabled={saving} type="submit" className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold py-4 rounded-lg transition-all shadow-md disabled:opacity-50">
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}