import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Camera, Save, User as UserIcon, Home, Mail, LogOut } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    alert('تم تحديث البيانات بنجاح!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">الملف الشخصي</h2>
        <p className="text-slate-500">إدارة معلومات المربي وصورة البروفايل</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <UserIcon size={64} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2.5 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
              >
                <Camera size={20} />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
            <p className="mt-4 text-sm text-slate-500">اضغط على الكاميرا لتغيير الصورة</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <UserIcon size={18} className="text-primary-500" />
                اسم المربي
              </label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-black"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Home size={18} className="text-primary-500" />
                اسم اللوفت (المسكن)
              </label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-black"
                value={formData.loftName}
                onChange={e => setFormData({...formData, loftName: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail size={18} className="text-primary-500" />
                البريد الإلكتروني
              </label>
              <input 
                type="email" 
                disabled
                className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={20} />
              حفظ التغييرات
            </button>
            
            <button 
              type="button"
              onClick={onLogout}
              className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold text-lg hover:bg-red-100 transition-all border border-red-100 flex items-center justify-center gap-2 md:hidden"
            >
              <LogOut size={20} />
              تسجيل الخروج
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;