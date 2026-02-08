
import React from 'react';
import { UserProfile } from '../types';
import { Climber } from './Climber';

interface StoreProps {
  user: UserProfile;
  onUpdateAvatar: (update: Partial<UserProfile['avatar']>) => void;
  onSpendPoints: (amount: number) => boolean;
}

const ITEMS = [
  { id: 'hat-1', name: 'Mountaineer Hat', type: 'hat', color: '#ef4444', price: 200 },
  { id: 'hat-2', name: 'Winter Beanie', type: 'hat', color: '#3b82f6', price: 350 },
  { id: 'hat-3', name: 'Golden Helmet', type: 'hat', color: '#fbbf24', price: 1000 },
  { id: 'gear-1', name: 'Pro Harness', type: 'gear', color: '#10b981', price: 500 },
  { id: 'gear-2', name: 'Heavy Pack', type: 'gear', color: '#6b7280', price: 400 },
  { id: 'skin-1', name: 'Ice Skin', type: 'baseColor', color: '#93c5fd', price: 600 },
  { id: 'skin-2', name: 'Lava Skin', type: 'baseColor', color: '#f87171', price: 600 },
];

export const Store: React.FC<StoreProps> = ({ user, onUpdateAvatar, onSpendPoints }) => {
  const buyItem = (item: typeof ITEMS[0]) => {
    if (onSpendPoints(item.price)) {
      onUpdateAvatar({ [item.type]: item.color });
      alert(`Equipped ${item.name}!`);
    } else {
      alert("Not enough points to reach this peak!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Preview Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-800 p-8 rounded-3xl flex flex-col items-center shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                 <path d="M0,100 L50,0 L100,100 Z" />
              </svg>
           </div>
           <h3 className="text-white font-bold mb-8 text-xl z-10">Current Style</h3>
           {/* Fix: Added the required 'type' prop and ensured 'avatar' is passed to Climber */}
           <Climber type={user.selectedCharacter} avatar={user.avatar} size="lg" className="z-10" />
           <div className="mt-8 text-center z-10">
              <p className="text-slate-400 text-sm">Wealth</p>
              <p className="text-3xl font-bold text-blue-400">{user.points} XP</p>
           </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="lg:col-span-3">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Basecamp Outfitters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ITEMS.map(item => (
            <div key={item.id} className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center group">
              <div 
                className="w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner"
                style={{ backgroundColor: item.color }}
              />
              <h4 className="font-bold text-slate-800 text-center">{item.name}</h4>
              <p className="text-xs text-slate-500 uppercase font-bold mb-4">{item.type}</p>
              <button 
                onClick={() => buyItem(item)}
                className="w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 font-bold py-2 rounded-xl transition-all"
              >
                {item.price} XP
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
