
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
  
  // Parallax offsets based on height
  const farLayerOffset = (user.climbHeight / 5000) * 50; // Moves 50px total
  const midLayerOffset = (user.climbHeight / 5000) * 150; // Moves 150px total
  const nearLayerOffset = (user.climbHeight / 5000) * 300; // Moves 300px total

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: The Mountain (Enhanced with Parallax) */}
      <div className="lg:col-span-2 relative bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 min-h-[600px]">
        
        {/* Layer 1: Far Background (Distant Peaks) */}
        <div 
          