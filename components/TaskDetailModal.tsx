import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, User as UserIcon, Check, ShieldCheck, Clock, Flag, Image as ImageIcon, Save, Upload } from 'lucide-react';
import { Task, TaskStatus, User, Priority } from '../types';
import { PROJECTS } from '../constants';
import { UserSelector } from './UserSelector';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  users: User[];
  onComplete: (id: string) => void;
  onVerify: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
  currentUser: User;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, users, onComplete, onVerify, onUpdate, currentUser }) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!task || !editedTask) return null;

  const isCompleted = editedTask.status === TaskStatus.COMPLETED;
  const isVerified = editedTask.status === TaskStatus.VERIFIED;
  const isPending = editedTask.status === TaskStatus.PENDING;

  // Permissions
  const canComplete = isPending && editedTask.executorIds?.includes(currentUser.id);
  const canVerify = isCompleted && editedTask.responsibleId === currentUser.id;

  const handleSave = () => {
    if (editedTask) {
      onUpdate(editedTask);
      onClose();
    }
  };

  const handleFieldChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Image Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleFieldChange('images', [...(editedTask.images || []), reader.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = editedTask.images?.filter((_, i) => i !== index) || [];
    handleFieldChange('images', newImages);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="flex-1 mr-4">
             <div className="flex items-center gap-2 mb-3">
               <select 
                  value={editedTask.priority}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border appearance-none outline-none cursor-pointer
                  ${editedTask.priority === Priority.HIGH ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                    editedTask.priority === Priority.MEDIUM ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-blue-50 text-blue-600 border-blue-100'}`}
               >
                 <option value={Priority.HIGH}>P0 高优先级</option>
                 <option value={Priority.MEDIUM}>P1 中优先级</option>
                 <option value={Priority.LOW}>P2 普通</option>
               </select>

                <select 
                  value={editedTask.projectName}
                  onChange={(e) => handleFieldChange('projectName', e.target.value)}
                  className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 outline-none appearance-none cursor-pointer"
                >
                  {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                {isVerified && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><Check size={12}/> 已归档</span>}
             </div>
             
             <input 
              type="text" 
              value={editedTask.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="text-2xl font-bold text-slate-800 leading-tight bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none w-full transition-colors"
             />
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200/50 text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  任务描述
                </h3>
                <textarea 
                  value={editedTask.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={5}
                  className="w-full text-slate-600 leading-relaxed text-sm bg-slate-50 border border-slate-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </section>

              {/* Images Section with Add/Remove */}
              <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ImageIcon size={16} /> 附件图片 ({editedTask.images?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {editedTask.images?.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt={`Attachment ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors bg-slate-50 hover:bg-indigo-50/50"
                    >
                      <Upload size={18} />
                      <span className="text-[10px] mt-1">添加</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
              </section>

              {/* Activity Log */}
              <section className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4">执行记录</h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                         <div className="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
                         <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                      </div>
                      <div className="pb-4">
                         <p className="text-xs text-slate-400">创建时间</p>
                         <p className="text-sm font-medium text-slate-700">{new Date(editedTask.createdAt).toLocaleString()}</p>
                      </div>
                   </div>
                   {editedTask.completedAt && (
                     <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                           <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                        </div>
                        <div className="pb-4">
                           <p className="text-xs text-slate-400">完成时间</p>
                           <p className="text-sm font-medium text-slate-700">{new Date(editedTask.completedAt).toLocaleString()}</p>
                        </div>
                     </div>
                   )}
                   {editedTask.verifiedAt && (
                     <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                        </div>
                        <div>
                           <p className="text-xs text-slate-400">核验归档</p>
                           <p className="text-sm font-medium text-slate-700">{new Date(editedTask.verifiedAt).toLocaleString()}</p>
                        </div>
                     </div>
                   )}
                </div>
              </section>
            </div>

            <div className="col-span-1 space-y-6">
               <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <UserSelector 
                    label="执行人"
                    users={users}
                    mode="multiple"
                    selectedIds={editedTask.executorIds || []}
                    onChange={(ids) => handleFieldChange('executorIds', ids)}
                    placeholder="选择执行人"
                  />
                  
                  <div className="w-full h-px bg-slate-200 my-4"></div>

                  <UserSelector 
                    label="核验人"
                    users={users}
                    mode="single"
                    selectedIds={editedTask.responsibleId ? [editedTask.responsibleId] : []}
                    onChange={(ids) => handleFieldChange('responsibleId', ids[0] || '')}
                    placeholder="选择核验人"
                  />
               </div>

               <div>
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">截止日期</label>
                 <div className="flex items-center gap-2 text-slate-700 font-medium bg-white border border-slate-200 px-4 py-3 rounded-xl relative">
                   <Calendar size={18} className="text-slate-400 pointer-events-none" />
                   <input 
                    type="date"
                    value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFieldChange('dueDate', val ? new Date(val) : undefined);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                   />
                   <span className="pointer-events-none">{editedTask.dueDate ? new Date(editedTask.dueDate).toLocaleDateString() : '无截止日期'}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between gap-3">
           <button 
             onClick={handleSave}
             className="px-6 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold hover:bg-slate-300 transition-colors flex items-center gap-2"
           >
              <Save size={18} />
              保存修改
           </button>

           <div className="flex gap-3">
             {canComplete && (
              <button 
                onClick={() => { onComplete(task.id); onClose(); }}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-200"
              >
                <Check size={18} />
                标记完成
              </button>
             )}
             {canVerify && (
              <button 
                onClick={() => { onVerify(task.id); onClose(); }}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 font-medium transition-all shadow-lg shadow-emerald-200"
              >
                <ShieldCheck size={18} />
                通过核验
              </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};