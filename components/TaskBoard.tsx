
import React, { useState } from 'react';
import { Task, SubTask } from '../types';
import { breakdownTask } from '../geminiService';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onPointsChange: (amount: number) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks, onPointsChange }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    setIsBreakingDown(true);
    const subtasks = await breakdownTask(newTaskTitle);
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      subtasks: subtasks,
      points: subtasks.reduce((acc, s) => acc + s.points, 0),
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsBreakingDown(false);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newSubtasks = task.subtasks.map(s => {
          if (s.id === subtaskId) {
            if (!s.completed) onPointsChange(s.points);
            return { ...s, completed: !s.completed };
          }
          return s;
        });
        const allCompleted = newSubtasks.every(s => s.completed);
        return { ...task, subtasks: newSubtasks, completed: allCompleted };
      }
      return task;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mission Control</h2>
        
        <div className="flex gap-4">
          <input 
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What mountain are we moving today? (e.g., 'Learn React Hooks')"
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-400 outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            disabled={isBreakingDown}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-8 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            {isBreakingDown ? 'PLANNING...' : 'BREAK DOWN'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tasks.map(task => (
          <div key={task.id} className={`bg-white rounded-3xl p-6 shadow-lg border-l-8 ${task.completed ? 'border-emerald-400 opacity-75' : 'border-blue-400'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">Potential: {task.points} XP</p>
              </div>
              {task.completed && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Peak Conquered
                </span>
              )}
            </div>

            <div className="space-y-3">
              {task.subtasks.map(sub => (
                <div 
                  key={sub.id}
                  onClick={() => toggleSubtask(task.id, sub.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${sub.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${sub.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {sub.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`flex-1 font-medium ${sub.completed ? 'line-through' : ''}`}>{sub.title}</span>
                  <span className="text-xs font-bold opacity-60">+{sub.points}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No active expeditions. Start by breaking down a task!</p>
          </div>
        )}
      </div>
    </div>
  );
};
