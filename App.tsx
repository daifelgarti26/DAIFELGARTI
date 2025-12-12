import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import PigeonManager from './components/PigeonManager';
import VelocityCalculator from './components/VelocityCalculator';
import AIAssistant from './components/AIAssistant';
import RaceResults from './components/RaceResults';
import Login from './components/Login';
import Profile from './components/Profile';
import { Pigeon, Status, Sex, User } from './types';
import { Award, TrendingUp, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pigeons, setPigeons] = useState<Pigeon[]>([]);

  // Initialize data on load
  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load Pigeons
    const savedPigeons = localStorage.getItem('pigeons');
    if (savedPigeons) {
      try {
        setPigeons(JSON.parse(savedPigeons));
      } catch (e) {
        console.error("Failed to parse saved pigeons", e);
      }
    } else {
      // Initialize dummy pigeon data only if no data exists
      setPigeons([
        { id: '1', ringNumber: 'MA-24-10025', color: 'أزرق', strain: 'جانسين', sex: Sex.Male, status: Status.Active, hatchDate: '2024-01-15', raceResults: [] },
        { id: '2', ringNumber: 'MA-24-10088', color: 'شامبانيا', strain: 'فاندينابيل', sex: Sex.Female, status: Status.Breeding, hatchDate: '2023-03-20', raceResults: [] },
        { id: '3', ringNumber: 'MA-24-11201', color: 'أسود', strain: 'مولر', sex: Sex.Male, status: Status.Active, hatchDate: '2024-02-10', raceResults: [] },
      ]);
    }
  }, []);

  // Save pigeons whenever they change
  useEffect(() => {
    if (pigeons.length > 0) {
      localStorage.setItem('pigeons', JSON.stringify(pigeons));
    }
  }, [pigeons]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const stats = {
    total: pigeons.length,
    active: pigeons.filter(p => p.status === Status.Active).length,
    breeding: pigeons.filter(p => p.status === Status.Breeding).length,
    males: pigeons.filter(p => p.sex === Sex.Male).length,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in pb-4">
            {/* Welcome Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">مرحباً، {user?.name}! 👋</h2>
                <p className="text-slate-500">نتمنى لك يوماً رائعاً مع طيورك في {user?.loftName}</p>
              </div>
              <div className="hidden md:block w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                <Activity size={32} />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Activity size={24} />
                </div>
                <div className="text-center md:text-right">
                  <p className="text-slate-500 text-xs md:text-sm font-medium">إجمالي الطيور</p>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">{stats.total}</h3>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <div className="text-center md:text-right">
                  <p className="text-slate-500 text-xs md:text-sm font-medium">جاهز للسباق</p>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">{stats.active}</h3>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Award size={24} />
                </div>
                <div className="text-center md:text-right">
                  <p className="text-slate-500 text-xs md:text-sm font-medium">قسم الإنتاج</p>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">{stats.breeding}</h3>
                </div>
              </div>
               <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Award size={24} />
                </div>
                <div className="text-center md:text-right">
                  <p className="text-slate-500 text-xs md:text-sm font-medium">ذكور</p>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">{stats.males}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">موسم السباقات 2025</h2>
                  <p className="text-slate-300 mb-6 max-w-md">استعد للموسم القادم بتنظيم جدول التدريبات ومراقبة صحة الطيور بدقة عالية.</p>
                  <button 
                    onClick={() => setActiveTab('expert')}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/30 w-full md:w-auto"
                  >
                    استشر الخبير الآن
                  </button>
                </div>
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-primary-500 rounded-full opacity-20 blur-3xl"></div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-800">أحدث الإضافات</h3>
                <div className="space-y-4">
                  {pigeons.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <div>
                          <p className="font-bold text-slate-700">{p.ringNumber}</p>
                          <p className="text-xs text-slate-400">{p.strain}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{p.status}</span>
                    </div>
                  ))}
                  {pigeons.length === 0 && <p className="text-slate-400 text-center py-4">لا توجد بيانات</p>}
                </div>
              </div>
            </div>
          </div>
        );
      case 'my-pigeons':
        return <PigeonManager pigeons={pigeons} setPigeons={setPigeons} />;
      case 'race-results':
        return <RaceResults pigeons={pigeons} setPigeons={setPigeons} />;
      case 'calculator':
        return <VelocityCalculator />;
      case 'expert':
        return <AIAssistant />;
      case 'profile':
        return user ? <Profile user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} /> : null;
      default:
        return <div>قريباً</div>;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      
      {/* Desktop Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile App Header (Android Style) */}
        <header className="md:hidden bg-primary-600 text-white p-4 flex items-center justify-between shrink-0 z-10 shadow-md">
          <span className="font-bold text-lg">الزاجل برو</span>
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full bg-white/20 p-0.5 border border-white/30 overflow-hidden"
          >
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="User" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
};

export default App;