import React from 'react';
import { LayoutDashboard, Bird, Calculator, MessageSquareText, Trophy, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'my-pigeons', label: 'طيوري', icon: Bird },
    { id: 'race-results', label: 'نتائج السباقات', icon: Trophy },
    { id: 'calculator', label: 'حاسبة السرعة', icon: Calculator },
    { id: 'expert', label: 'المستشار الذكي', icon: MessageSquareText },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-white h-full shadow-xl z-30">
        {/* User Profile Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-14 h-14 rounded-full border-2 border-primary-500 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
               {user.photoUrl ? (
                 <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="text-slate-400" />
               )}
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-white truncate">{user.name}</h3>
               <p className="text-xs text-primary-400 truncate">{user.loftName || 'مربي حمام'}</p>
             </div>
           </div>
           <button 
             onClick={() => setActiveTab('profile')}
             className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${activeTab === 'profile' ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}
           >
             <Settings size={14} />
             تعديل الملف الشخصي
           </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
             <LogOut size={20} />
             <span className="font-medium">تسجيل الخروج</span>
          </button>
          <p className="text-[10px] text-slate-600 text-center mt-4">
             الإصدار 1.0.0 <br/> الزاجل برو
          </p>
        </div>
      </aside>
  );
};

export default Sidebar;