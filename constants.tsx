
import React from 'react';
import { PomodoroPreset, CharacterType } from './types';

export const PRESETS: PomodoroPreset[] = [
  { id: 'classic', name: "Classic", focusMin: 25, shortBreakMin: 5, longBreakMin: 15, longBreakAfter: 4 },
  { id: 'short', name: "Short", focusMin: 15, shortBreakMin: 3, longBreakMin: 10, longBreakAfter: 4 },
  { id: 'deep', name: "Deep Work", focusMin: 50, shortBreakMin: 10, longBreakMin: 20, longBreakAfter: 2 },
  { id: 'study', name: "Study Mode", focusMin: 30, shortBreakMin: 5, longBreakMin: 15, longBreakAfter: 3 },
];

export interface CharacterData {
  id: CharacterType;
  name: string;
  description: string;
  color: string;
  emoji: string;
}

export const CHARACTERS: CharacterData[] = [
  { id: 'llama', name: 'Luna the Llama', description: 'Graceful and steady, Luna loves high-altitude ponchos.', color: '#F3E5AB', emoji: '🦙' },
  { id: 'leopard', name: 'Leo the Leopard', description: 'Fast and focused, Leo uses the latest high-tech climbing gear.', color: '#FFD700', emoji: '🐆' },
  { id: 'guineapig', name: 'Gina the Guinea Pig', description: 'Small but mighty, Gina climbs in her favorite polka-dot dress.', color: '#C19A6B', emoji: '🐹' },
  { id: 'elephant', name: 'Ellie the Elephant', description: 'Wise and strong, Ellie wears traditional climbing silks.', color: '#A9A9A9', emoji: '🐘' },
];

export const COLORS = {
  primary: '#2563eb',
  secondary: '#10b981',
  danger: '#ef4444',
  mountain: '#334155',
};
