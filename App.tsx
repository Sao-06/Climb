
import React, { useState, useEffect, useRef } from 'react';
import { AppTab, UserProfile, Task, CharacterType } from './types';
import { Dashboard } from './components/Dashboard';
import { TaskBoard } from './components/TaskBoard';
import { Store } from './components/Store';
import { CharacterSelect } from './components/CharacterSelect';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionPointsLost, setDistractionPointsLost] = useState(0);
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);
  
  const [user, setUser] = useState<UserProfile>({
    name: 'Explorer',
    level: 1,
    points: 150,
    climbHeight: 0,
    totalFocusTime: 0,
    selectedCharacter: 'llama',
    avatar: {
      baseColor: '#e2e8f0',
      hat: 'none',
      gear: 'none',
    },
    isDistracted: false
  });

  const distractionStartTime = useRef<number | null>(null);

  // Distraction Monitoring Logic
  // Since we can't monitor other apps directly, we use Tab Visibility as a proxy.
  // If a focus session is active and the user leaves the tab (simulating social media use), they are distracted.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isFocusSessionActive) {
        // User left the tab - start tracking distraction
        setIsDistracted(true);
        distractionStartTime.current = Date.now();
      } else if (!document.hidden && isDistracted) {
        // User returned to the tab
        if (distractionStartTime.current) {
          const elapsedMinutes = Math.floor((Date.now() - distractionStartTime.current) / 60000);
          if (elapsedMinutes > 0) {
            updatePoints(-elapsedMinutes);
            setDistractionPointsLost(elapsedMinutes);
          }
          // Reset distraction status
          setIsDistracted(false);
          distractionStartTime.current = null;
          // Redirect to focus mode as requested
          setActiveTab(AppTab.DASHBOARD);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isFocusSessionActive, isDistracted]);

  // Point deduction ticker for sustained distraction while the app is open (simulated)
  useEffect(() => {
    let interval: any;
    if (isDistracted) {
      interval = setInterval(() => {
        updatePoints(-1);
        setDistractionPointsLost(prev => prev + 1);
      }, 60000); // 1 point per minute
    }
    return () => clearInterval(interval);
  }, [isDistracted]);

  // Calculate level based on points
  useEffect(() => {
    const newLevel = Math.max(1, Math.floor(user.points / 1000) + 1);
    if (newLevel !== user.level) {
      setUser(prev => ({ ...prev, level: newLevel }));
    }
  }, [user.points]);

  const updatePoints = (amount: number) => {
    setUser(prev => ({ ...prev, points: Math.max(0, prev.points + amount) }));
  };

  const updateHeight = (amount: number) => {
    setUser(prev => ({ ...prev, climbHeight: prev.climbHeight + amount }));
  };

  const spendPoints = (amount: number): boolean => {
    if (user.points >= amount) {
      setUser(prev => ({ ...prev, points: prev.points - amount }));
      return true;
    }
    return false;
  };

  const updateAvatar = (update: Partial<UserProfile['avatar']>) => {
    setUser(prev => ({
      ...prev,
      avatar: { ...prev.avatar, ...update }
    }));
  };

  const selectCharacter = (type: CharacterType) => {
    setUser(prev => ({ ...prev, selectedCharacter: type }));
  };

  const NavItem = ({ tab, label, icon }: { tab: AppTab, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center gap-1 px-4 py-3 transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {activeTab === tab && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      {/* Distraction Alert Overlay */}
      {distractionPointsLost > 0 && !isDistracted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl border-4 border-red-100">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 italic">EXPEDITION STALLED!</h2>
            <p className="text-slate-500 mb-6 font-medium">
              You wandered off the trail (Social Media detected). Your climber lost focus and you dropped <span className="text-red-600 font-black">-{distractionPointsLost} XP</span>.
            </p>
            <button 
              onClick={() => setDistractionPointsLost(0)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              RESUME CLIMB
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-[0_10px_20px_rgba(37,99,235,0.3)]">
              ⛰️
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-none">CLIMB</h1>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Productivity Expedition</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 bg-slate-50 px-6 py-2.5 rounded-2xl border border-slate-100 shadow-inner">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Wealth</span>
                  <span className="text-blue-600 font-black text-lg">{user.points} XP</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Explorer Lvl {user.level}</p>
                <p className="font-black text-slate-800 leading-none">{user.name}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center ring-2 ring-blue-100">
                <span className="text-2xl">
                  {user.selectedCharacter === 'llama' ? '🦙' : 
                   user.selectedCharacter === 'leopard' ? '🐆' :
                   user.selectedCharacter === 'guineapig' ? '🐹' : '🐘'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 pb-40">
        {activeTab === AppTab.DASHBOARD && (
          <Dashboard 
            user={user} 
            onPointsChange={updatePoints}
            onHeightChange={updateHeight}
            onSessionStateChange={setIsFocusSessionActive}
          />
        )}
        {activeTab === AppTab.TASKS && (
          <TaskBoard 
            tasks={tasks} 
            setTasks={setTasks} 
            onPointsChange={updatePoints}
          />
        )}
        {activeTab === AppTab.STORE && (
          <Store 
            user={user}
            onUpdateAvatar={updateAvatar}
            onSpendPoints={spendPoints}
          />
        )}
        {activeTab === AppTab.SETTINGS && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Team Selection</h2>
              <p className="text-slate-400 font-medium mb-8">Choose your partner for the upcoming ascent. Each explorer brings their own spirit.</p>
              <CharacterSelect selected={user.selectedCharacter} onSelect={selectCharacter} />
            </div>
            
            {/* Simulated App Monitoring Demo Control */}
            <div className="bg-amber-50 p-8 rounded-[2rem] shadow-inner border border-amber-100">
               <h3 className="text-xl font-black text-amber-800 mb-2">Guard System Demo</h3>
               <p className="text-amber-700/70 text-sm mb-6">In a real mobile environment, we track unproductive app launches. In this browser demo, switching tabs or clicking "Simulate Social Media" while climbing will trigger the penalty.</p>
               <button 
                  onClick={() => {
                    if (!isFocusSessionActive) {
                      alert("Start an Ascent on the Dashboard first!");
                      return;
                    }
                    setIsDistracted(true);
                    distractionStartTime.current = Date.now() - 300000; // Pretend 5 mins passed
                    // Re-trigger visibility logic manually for simulation
                    setTimeout(() => {
                      setIsDistracted(false);
                      updatePoints(-5);
                      setDistractionPointsLost(5);
                      setActiveTab(AppTab.DASHBOARD);
                    }, 500);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
               >
                 SIMULATE SOCIAL MEDIA DISTRACTION
               </button>
            </div>
          </div>
        )}
        {activeTab === AppTab.SOCIAL && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
             <div className="text-6xl mb-6">🤝</div>
             <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">Multiplayer Coming Soon</h2>
             <p className="text-slate-400 font-medium max-w-md mx-auto">Soon you'll be able to form climbing parties with friends and conquer the world's highest digital peaks together.</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-4 z-50 flex items-center gap-2">
        <NavItem tab={AppTab.DASHBOARD} label="Ascent" icon="🏔️" />
        <NavItem tab={AppTab.TASKS} label="Missions" icon="📜" />
        <NavItem tab={AppTab.STORE} label="Basecamp" icon="🎒" />
        <NavItem tab={AppTab.SOCIAL} label="Team" icon="🤝" />
        <NavItem tab={AppTab.SETTINGS} label="Gear" icon="⚙️" />
      </nav>
    </div>
  );
};

export default App;
