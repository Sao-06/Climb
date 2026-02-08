
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, PomodoroPreset } from '../types';
import { Climber } from './Climber';
import { PRESETS } from '../constants';
import { getCoachAdvice } from '../geminiService';

interface DashboardProps {
  user: UserProfile;
  onPointsChange: (amount: number) => void;
  onHeightChange: (amount: number) => void;
  onSessionStateChange?: (isActive: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onPointsChange, onHeightChange, onSessionStateChange }) => {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>(PRESETS[0]);
  const [advice, setAdvice] = useState("Loading motivation...");
  const [isMoving, setIsMoving] = useState(false);
  const prevHeight = useRef(user.climbHeight);

  useEffect(() => {
    const fetchAdvice = async () => {
      const msg = await getCoachAdvice(user.points, user.climbHeight);
      setAdvice(msg);
    };
    fetchAdvice();
  }, [user.level]);

  useEffect(() => {
    if (user.climbHeight !== prevHeight.current) {
      setIsMoving(true);
      const timer = setTimeout(() => setIsMoving(false), 2000);
      prevHeight.current = user.climbHeight;
      return () => clearTimeout(timer);
    }
  }, [user.climbHeight]);

  useEffect(() => {
    let interval: any;
    if (activeTimer) {
      onSessionStateChange?.(true);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setActiveTimer(null);
            onSessionStateChange?.(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      onSessionStateChange?.(false);
    }
    return () => clearInterval(interval);
  }, [activeTimer, onSessionStateChange]);

  const startSession = (preset: PomodoroPreset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.focusMin * 60);
    setActiveTimer(Date.now());
  };

  const handleSessionComplete = () => {
    const reward = 100;
    const heightGain = 50;
    onPointsChange(reward);
    onHeightChange(heightGain);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const mountainProgress = Math.min((user.climbHeight / 5000) * 100, 95);
  
  // Parallax offsets based on height (5000m is the target)
  // Higher altitude = Background layers move downward to simulate climbing up
  const farLayerOffset = (user.climbHeight / 5000) * 80; 
  const midLayerOffset = (user.climbHeight / 5000) * 180;
  const nearLayerOffset = (user.climbHeight / 5000) * 350;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: The Mountain (Enhanced with Parallax) */}
      <div className="lg:col-span-2 relative bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 min-h-[600px]">
        
        {/* Layer 1: Far Background (Distant Peaks) */}
        <div 
          className="absolute inset-0 transition-transform duration-[2500ms] ease-out pointer-events-none"
          style={{ transform: `translateY(${farLayerOffset}px)` }}
        >
          <svg className="absolute bottom-[-5%] left-0 w-full h-1/2 opacity-20 fill-indigo-200" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M0,500 L150,150 L350,380 L550,80 L800,420 L1000,250 L1000,500 Z" />
          </svg>
        </div>

        {/* Layer 2: Mid Background (Large Clouds & Secondary Peaks) */}
        <div 
          className="absolute inset-0 transition-transform duration-[2000ms] ease-out pointer-events-none"
          style={{ transform: `translateY(${midLayerOffset}px)` }}
        >
          {/* Drifting Clouds */}
          <div className="absolute top-[15%] left-[20%] w-40 h-12 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[40%] right-[10%] w-56 h-20 bg-white/10 rounded-full blur-[40px]" />
          
          <svg className="absolute bottom-[-15%] left-0 w-full h-3/5 opacity-30 fill-indigo-400" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M0,500 L200,250 L400,480 L600,120 L800,450 L1000,200 L1000,500 Z" />
          </svg>
        </div>

        {/* Layer 3: Near Background (Mist & Small Atmospheric Detail) */}
        <div 
          className="absolute inset-0 transition-transform duration-[1500ms] ease-out pointer-events-none"
          style={{ transform: `translateY(${nearLayerOffset}px)` }}
        >
          <div className="absolute top-[25%] left-[45%] w-24 h-8 bg-white/40 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }} />
          <div className="absolute top-[65%] left-[10%] w-32 h-10 bg-white/30 rounded-full blur-2xl" />
          <div className="absolute top-[85%] right-[25%] w-16 h-6 bg-white/50 rounded-full blur-lg opacity-60" />
        </div>
        
        {/* Summit Label */}
        <div className="absolute top-0 w-full text-center pt-10 z-30">
           <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/20 shadow-xl">
              <span className="text-white font-black tracking-[0.3em] text-[10px] uppercase drop-shadow-lg">Peak Expedition • Target: 5000m</span>
           </div>
        </div>

        {/* The Main Path and Climber */}
        <div className="absolute inset-0 flex flex-col justify-end items-center pointer-events-none z-20">
           <div className="relative w-full h-[85%] max-w-lg">
             {/* Character Position */}
             <div 
               className={`absolute left-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-in-out z-40`}
               style={{ bottom: `${mountainProgress}%` }}
             >
               <Climber type={user.selectedCharacter} avatar={user.avatar} isMoving={isMoving} size="md" />
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-6 py-2.5 rounded-2xl text-[10px] font-black shadow-2xl border-2 border-blue-500 whitespace-nowrap text-blue-600 uppercase tracking-widest ring-4 ring-blue-500/5">
                 {user.name} • {user.climbHeight}m
               </div>
             </div>
             
             {/* Dotted Path */}
             <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
                <path d="M 250,500 L 220,430 L 330,350 L 210,240 L 290,130 L 250,30" stroke="white" strokeWidth="6" fill="none" strokeDasharray="18 18" strokeLinecap="round" />
             </svg>
           </div>
        </div>

        {/* HUD Log & Progress Bar */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-30">
           <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 text-white shadow-2xl max-w-[280px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <p className="text-[9px] font-black opacity-50 uppercase tracking-[0.2em]">Navigator's Feedback</p>
              </div>
              <p className="text-sm font-medium italic leading-relaxed text-blue-50">"{advice}"</p>
           </div>
           
           <div className="text-right">
              <p className="text-white font-black text-[10px] uppercase tracking-widest mb-4 drop-shadow-xl opacity-90">Expedition Phase Progress</p>
              <div className="w-64 h-3.5 bg-black/40 rounded-full overflow-hidden border border-white/20 backdrop-blur-md shadow-inner p-[2px]">
                 <div 
                   className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.9)] transition-all duration-1000 rounded-full" 
                   style={{ width: `${(user.climbHeight % 1000) / 10}%` }} 
                 />
              </div>
              <div className="flex justify-between mt-2 px-1">
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-tighter">Current: {user.climbHeight}m</span>
                <span className="text-white/60 text-[9px] font-bold uppercase tracking-tighter">Basecamp: {Math.ceil((user.climbHeight + 1) / 1000) * 1000}m</span>
              </div>
           </div>
        </div>
      </div>

      {/* Right Column: Timer & Expedition Management */}
      <div className="space-y-6 flex flex-col">
        {/* XP Panel */}
        <div className="bg-white p-7 rounded-[2.5rem] shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-3 h-9 bg-blue-600 rounded-full shadow-[0_6px_15px_rgba(37,99,235,0.4)]" />
            EXPEDITION STATS
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center group hover:bg-blue-50 transition-all duration-300">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">XP EARNED</p>
              <p className="text-4xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{user.points}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center group hover:bg-sky-50 transition-all duration-300">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">MAX ALT</p>
              <p className="text-4xl font-black text-slate-800 group-hover:text-sky-600 transition-colors">{user.climbHeight}m</p>
            </div>
          </div>
        </div>

        {/* Timer Panel */}
        <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center relative overflow-hidden">
          {activeTimer ? (
            <div className="text-center w-full z-10 py-8">
              <div className="relative inline-block mb-10">
                 <div className="text-8xl font-black font-mono text-blue-600 tracking-tighter drop-shadow-lg">
                   {formatTime(timeLeft)}
                 </div>
                 <div className="absolute -inset-8 bg-blue-100 rounded-full -z-10 animate-pulse opacity-40 scale-110" />
              </div>
              <p className="text-slate-400 mb-12 uppercase tracking-[0.3em] text-[10px] font-black">ACTIVE ROUTE: <span className="text-blue-600">{selectedPreset.name}</span></p>
              <button 
                onClick={() => setActiveTimer(null)}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[1.8rem] transition-all shadow-2xl active:scale-95 text-xs tracking-[0.2em] uppercase"
              >
                ABORT TO BASECAMP
              </button>
            </div>
          ) : (
            <div className="w-full z-10 flex flex-col h-full">
              <h3 className="text-lg font-black text-slate-800 mb-8 text-center uppercase tracking-[0.15em]">Prepare Ascent</h3>
              <div className="grid grid-cols-1 gap-4 mb-10 flex-1 overflow-y-auto pr-1">
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPreset(p)}
                    className={`w-full text-left p-6 rounded-[1.8rem] border-2 transition-all relative overflow-hidden group ${selectedPreset.id === p.id ? 'border-blue-600 bg-blue-50/60 ring-4 ring-blue-600/5' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <span className="font-black text-slate-800 block text-base tracking-tight mb-1">{p.name}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{p.focusMin}m DEPTH • {p.shortBreakMin}m RECOVERY</span>
                      </div>
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${selectedPreset.id === p.id ? 'bg-blue-600 border-blue-600 shadow-xl' : 'border-slate-200 group-hover:border-slate-400'}`}>
                        {selectedPreset.id === p.id && <div className="w-3 h-3 bg-white rounded-full shadow-inner" />}
                      </div>
                    </div>
                    {selectedPreset.id === p.id && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => startSession(selectedPreset)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[1.8rem] transition-all shadow-[0_20px_45px_rgba(37,99,235,0.35)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.5)] transform active:scale-[0.96] group text-sm tracking-[0.25em] uppercase"
              >
                BEGIN ASCENT
                <span className="ml-4 group-hover:translate-x-2 inline-block transition-transform duration-300 text-lg">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
