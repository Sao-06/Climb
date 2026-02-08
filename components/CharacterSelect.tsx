
import React from 'react';
import { CharacterType } from '../types';
import { CHARACTERS } from '../constants';
import { Climber } from './Climber';

interface CharacterSelectProps {
  selected: CharacterType;
  onSelect: (type: CharacterType) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {CHARACTERS.map(char => (
        <button
          key={char.id}
          onClick={() => onSelect(char.id)}
          className={`relative bg-white rounded-3xl p-6 border-4 transition-all overflow-hidden flex flex-col items-center group ${selected === char.id ? 'border-blue-600 shadow-2xl ring-4 ring-blue-600/10' : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}
        >
          {selected === char.id && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-20 shadow-lg">
              ✓
            </div>
          )}
          
          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
             <Climber type={char.id} size="md" />
          </div>
          
          <h3 className="text-xl font-black text-slate-800 mb-1">{char.name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Elite Explorer</p>
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            {char.description}
          </p>
          
          <div className="mt-6 w-full pt-4 border-t border-slate-50">
             <div className="flex justify-between items-center text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                <span>Stamina: HIGH</span>
                <span>Focus: ULTRA</span>
             </div>
          </div>
        </button>
      ))}
    </div>
  );
};
