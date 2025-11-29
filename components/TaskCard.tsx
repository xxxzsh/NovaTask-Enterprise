import React from 'react';
import { Calendar, Check, ShieldCheck, Clock, User as UserIcon, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Task, TaskStatus, User } from '../types';

interface TaskCardProps {
  task: Task;
  users: User[];
  onComplete: (id: string) => void;
  onVerify: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onComplete, onVerify }) => {
  const responsible = users.find(u => u.id === task.responsibleId);
  const executor = users.find(u => u.id === task.executorId);

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isVerified = task.status === TaskStatus.VERIFIED;
  const isPending = task.status === TaskStatus.PENDING;

  // Project colors
  const getProjectColor = (name: string) => {
    if (name.includes('低空')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (name.includes('思政')) return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  // Status visual config
  const statusConfig = {
    [TaskStatus.PENDING]: { label: '进行中', dotColor: 'bg-amber-400' },
    [TaskStatus.COMPLETED]: { label: '待核验', dotColor: 'bg-indigo-400' },
    [TaskStatus.VERIFIED]: { label: '已完成', dotColor: 'bg-emerald-400' },
  };

  const currentConfig = statusConfig[task.status];

  return (
    <div className={`
      group relative bg-white rounded-2xl p-6 border border-slate-100/80 
      shadow-[0_2px_10px_-4px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(6,81,237,0.1)] 
      transition-all duration-300 ease-out 
      hover:-translate-y-1
      ${isVerified ? 'bg-slate-50/50' : 'bg-white'}
    `}>
      {/* Top Row: Project & Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${getProjectColor(task.projectName)}`}>
          {task.projectName}
        </span>
        
        {/* Animated Status Indicator */}
        <div className="flex items-center gap-2">
           {!isVerified && (
             <span className="relative flex h-2 w-2">
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentConfig.dotColor}`}></span>
               <span className={`relative inline-flex rounded-full h-2 w-2 ${currentConfig.dotColor}`}></span>
             </span>
           )}
           <span className={`text-xs font-semibold ${isVerified ? 'text-slate-400' : 'text-slate-600'}`}>
             {currentConfig.label}
           </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-6">
        <h3 className={`text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-slate-900 ${isVerified ? 'text-slate-500 line-through decoration-slate-300' : ''}`}>
          {task.title}
        </h3>
        <p className={`text-sm text-slate-500 leading-relaxed line-clamp-2 ${isVerified ? 'text-slate-400' : ''}`}>
          {task.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex items-center gap-5">
          {/* People */}
          <div className="flex items-center -space-x-2.5">
             {responsible ? (
               <img src={responsible.avatar} className="w-7 h-7 rounded-full border-2 border-white ring-1 ring-slate-100" title={`负责人: ${responsible.name}`} />
             ) : (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-400 ring-1 ring-slate-100">?</div>
             )}
             <div className="z-10 w-4 flex justify-center">
                <ArrowRight size={10} className="text-slate-300" />
             </div>
             {executor ? (
               <img src={executor.avatar} className="w-7 h-7 rounded-full border-2 border-white ring-1 ring-slate-100" title={`执行人: ${executor.name}`} />
             ) : (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-400 ring-1 ring-slate-100">?</div>
             )}
          </div>

          {/* Dates */}
          <div className="flex flex-col">
            {task.dueDate && !isVerified && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Calendar size={12} />
                <span>{new Date(task.dueDate).toLocaleDateString()} 截止</span>
              </div>
            )}
            {task.completedAt && (isCompleted || isVerified) && (
              <div className="flex items-center gap-1.5 text-emerald-600/80 text-xs font-medium">
                <Clock size={12} />
                <span>{new Date(task.completedAt).toLocaleDateString()} 完成</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          {isPending && (
            <button 
              onClick={() => onComplete(task.id)}
              className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
            >
              <Check size={14} />
              执行完成
            </button>
          )}

          {isCompleted && (
            <button 
              onClick={() => onVerify(task.id)}
              className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow-md shadow-slate-200 transition-all hover:-translate-y-0.5"
            >
              <ShieldCheck size={14} />
              核验通过
            </button>
          )}

          {isVerified && (
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ShieldCheck size={16} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};