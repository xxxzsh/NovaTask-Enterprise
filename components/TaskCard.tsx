import React from 'react';
import { Calendar, Check, ShieldCheck, Clock, ArrowRight, Flag, AlertCircle, Image as ImageIcon, XCircle } from 'lucide-react';
import { Task, TaskStatus, User, ViewMode, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  users: User[];
  onComplete: (id: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  viewMode: ViewMode;
  onClick: () => void;
  currentUser: User;
  onImagePreview: (url: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onComplete, onVerify, onReject, viewMode, onClick, currentUser, onImagePreview }) => {
  const responsible = users.find(u => u.id === task.responsibleId);
  
  // Map all executors
  const executors = task.executorIds 
    ? task.executorIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[]
    : [];

  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isVerified = task.status === TaskStatus.VERIFIED;
  const isPending = task.status === TaskStatus.PENDING;

  // Permissions
  const canComplete = isPending && task.executorIds?.includes(currentUser.id);
  const canVerify = isCompleted && task.responsibleId === currentUser.id;

  // Visual Helpers
  const getProjectColor = (name: string) => {
    if (name.includes('低空')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (name.includes('思政')) return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const getPriorityConfig = (priority: Priority) => {
    switch(priority) {
      case Priority.HIGH: return { label: 'P0', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: AlertCircle };
      case Priority.MEDIUM: return { label: 'P1', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Flag };
      default: return { label: 'P2', color: 'text-slate-500 bg-slate-100 border-slate-200', icon: Flag };
    }
  };

  const PriorityBadge = () => {
    const config = getPriorityConfig(task.priority);
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${config.color}`}>
        <Icon size={10} />
        {config.label}
      </div>
    );
  };

  const ActionButtons = () => (
    <div className="flex items-center gap-2">
      {canComplete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
          className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
        >
          <Check size={14} />
          完成
        </button>
      )}
      {canVerify && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onReject(task.id); }}
            className="flex items-center gap-1.5 text-xs font-bold bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
          >
            <XCircle size={14} />
            驳回
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onVerify(task.id); }}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 shadow-md shadow-slate-200 transition-all hover:-translate-y-0.5"
          >
            <ShieldCheck size={14} />
            核验
          </button>
        </>
      )}
      {isVerified && (
        <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
          <Check size={12} /> 已归档
        </span>
      )}
    </div>
  );

  const AvatarGroup = () => (
    <div className="flex items-center">
      <div className="flex -space-x-2 mr-2">
        {responsible ? (
          <img src={responsible.avatar} className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-slate-100" title={`核验人: ${responsible.name}`} />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 ring-1 ring-slate-100">?</div>
        )}
      </div>
      
      <ArrowRight size={10} className="text-slate-300 mr-2" />
      
      <div className="flex -space-x-2">
        {executors.length > 0 ? (
          executors.map((ex, i) => (
             <img key={i} src={ex.avatar} className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-slate-100" title={`执行人: ${ex.name}`} />
          ))
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 ring-1 ring-slate-100">?</div>
        )}
      </div>
    </div>
  );

  // --- VIEW: LIST ---
  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick}
        className={`
        group flex items-center gap-4 p-4 bg-white border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all cursor-pointer
      `}>
        {/* Status Stripe */}
        <div className={`w-1 h-8 rounded-full ${isVerified ? 'bg-emerald-400' : isCompleted ? 'bg-indigo-400' : 'bg-amber-400'}`}></div>
        
        {/* Main Info */}
        <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5">
             <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getProjectColor(task.projectName)}`}>
                  {task.projectName}
                </span>
                <PriorityBadge />
             </div>
             <h3 className={`text-sm font-bold text-slate-800 truncate`}>
               {task.title}
             </h3>
          </div>

          <div className="col-span-3 text-xs text-slate-500 flex items-center gap-2">
            {task.images && task.images.length > 0 ? (
               <div className="flex -space-x-2 hover:space-x-1 transition-all duration-300 py-1">
                  {task.images.slice(0, 4).map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      className="w-8 h-8 rounded-lg border-2 border-white object-cover shadow-sm cursor-zoom-in hover:scale-150 hover:z-20 hover:border-indigo-100 transition-all"
                      onClick={(e) => { e.stopPropagation(); onImagePreview(img); }}
                    />
                  ))}
                  {task.images.length > 4 && (
                    <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                      +{task.images.length - 4}
                    </div>
                  )}
               </div>
            ) : (
              <span className="truncate" title={task.description}>{task.description}</span>
            )}
          </div>

          <div className="col-span-2 flex justify-center">
             <AvatarGroup />
          </div>

          <div className="col-span-2 flex justify-end">
             <ActionButtons />
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: GRID ---
  return (
    <div 
      onClick={onClick}
      className={`
      group relative bg-white rounded-2xl p-6 border border-slate-100/80 
      shadow-[0_2px_10px_-4px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(6,81,237,0.1)] 
      transition-all duration-300 ease-out 
      hover:-translate-y-1 cursor-pointer
      ${isVerified ? 'bg-slate-50/30' : 'bg-white'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${getProjectColor(task.projectName)}`}>
            {task.projectName}
          </span>
          <PriorityBadge />
        </div>
        
        {/* Status Dot */}
        <div className="flex items-center gap-2">
           {!isVerified && (
             <span className="relative flex h-2 w-2">
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCompleted ? 'bg-indigo-400' : 'bg-amber-400'}`}></span>
               <span className={`relative inline-flex rounded-full h-2 w-2 ${isCompleted ? 'bg-indigo-400' : 'bg-amber-400'}`}></span>
             </span>
           )}
           {isVerified && (
             <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
           )}
        </div>
      </div>

      <div className="mb-6 relative">
        <h3 className={`text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-indigo-600`}>
          {task.title}
        </h3>
        <p className={`text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3`}>
          {task.description}
        </p>
        
        {/* Task Images in Grid View */}
        {task.images && task.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
             {task.images.map((img, idx) => (
                <div key={idx} className="relative flex-shrink-0 group/img">
                   <img 
                     src={img} 
                     className="h-16 w-24 object-cover rounded-lg border border-slate-100 cursor-zoom-in hover:opacity-90 transition-opacity" 
                     onClick={(e) => { e.stopPropagation(); onImagePreview(img); }}
                   />
                </div>
             ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <AvatarGroup />
          <div className="flex flex-col">
            {task.dueDate && !isVerified && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Calendar size={12} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
             {task.completedAt && (isCompleted || isVerified) && (
              <div className="flex items-center gap-1.5 text-emerald-600/80 text-xs font-medium">
                <Clock size={12} />
                <span>{new Date(task.completedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        <ActionButtons />
      </div>
    </div>
  );
};