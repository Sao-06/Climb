
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, PomodoroPreset } from '../types';
import { Climber } from './Climber';
import { PRESETS } from '../constants';
import { getCoachAdvice } from '../geminiService';

interface DashboardProps {
  user: UserProfile;
  onPointsChange: (amount: number) => void;
  onHeightChange: (amount: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onPointsChange, onHeightChange }) => {
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
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setActiveTimer(null);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: The Mountain */}
      <div className="lg:col-span-2 relative bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 min-h-[600px]">
        {/* Dynamic Background Elements */}
        <div className="absolute top-10 left-[15%] w-24 h-8 bg-white/60 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-[20%] w-40 h-12 bg-white/30 rounded-full blur-2xl" />
        
        {/* Summit Decoration */}
        <div className="absolute top-0 w-full text-center pt-8">
           <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <span className="text-white font-bold tracking-widest text-sm">THE SUMMIT: 5000m</span>
           </div>
        </div>

        {/* The Path and Climber */}
        <div className="absolute inset-0 flex flex-col justify-end items-center pointer-events-none">
           <div className="relative w-full h-[80%] max-w-lg">
             {/* Character */}
             <div 
               className={`absolute left-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-in-out z-20`}
               style={{ bottom: `${mountainProgress}%` }}
             >
               <Climber type={user.selectedCharacter} isMoving={isMoving} size="md" />
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-2xl text-xs font-black shadow-xl border-2 border-blue-500 whitespace-nowrap text-blue-600 uppercase tracking-tight">
                 {user.name} • {user.climbHeight}m
               </div>
             </div>
             
             {/* Path SVG */}
             <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                <path d="M 250,500 L 200,400 L 300,300 L 250,150 L 250,50" stroke="white" strokeWidth="4" fill="none" strokeDasharray="12 12" />
             </svg>
           </div>
        </div>

        {/* HUD Info */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
           <div className="bg-black/30 backdrop-blur-lg p-4 rounded-2xl border border-white/10 text-white">
              <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Current Motivation</p>
              <p className="text-sm italic leading-tight max-w-[200px]">"{advice}"</p>
           </div>
           
           <div className="text-right">
              <p className="text-white/60 text-[10px] font-bold uppercase">Expedition Progress</p>
              <div className="w-48 h-2 bg-black/20 rounded-full mt-2 overflow-hidden border border-white/10">
                 <div 
                   className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all duration-1000" 
                   style={{ width: `${(user.climbHeight % 500) / 5}%` }} 
                 />
              </div>
           </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full" />
            Vitals & XP
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Experience</p>
              <p className="text-2xl font-black text-slate-800">{user.points}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Alt Gain</p>
              <p className="text-2xl font-black text-slate-800">+{user.climbHeight}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center relative overflow-hidden">
          {activeTimer ? (
            <div className="text-center w-full z-10 py-4">
              <div className="relative inline-block mb-6">
                 <div className="text-6xl font-black font-mono text-blue-600 tracking-tighter">
                   {formatTime(timeLeft)}
                 </div>
                 <div className="absolute -inset-4 bg-blue-100 rounded-full -z-10 animate-ping opacity-20" />
              </div>
              <p className="text-slate-400 mb-8 uppercase tracking-widest text-[10px] font-bold">Currently Ascending: {selectedPreset.name}</p>
              <button 
                onClick={() => setActiveTimer(null)}
                className="w-full bg-slate-800 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                REST AT CAMP
              </button>
            </div>
          ) : (
            <div className="w-full z-10">
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Prepare Your Route</h3>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPreset(p)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedPreset.id === p.id ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/10' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{p.focusMin}m Focus • {p.shortBreakMin}m Break</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPreset.id === p.id ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                        {selectedPreset.id === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => startSession(selectedPreset)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transform active:scale-95 group"
              >
                BEGIN EXPEDITION
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
