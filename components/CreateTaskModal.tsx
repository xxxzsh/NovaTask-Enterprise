import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';
import { User, TaskStatus, Priority } from '../types';
import { PROJECTS } from '../constants';
import { UserSelector } from './UserSelector';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  users: User[];
  currentUser: User;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSubmit, users, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState(PROJECTS[0]);
  const [responsibleId, setResponsibleId] = useState<string>(''); // Verifier (Single)
  const [executorIds, setExecutorIds] = useState<string[]>([]); // Executors (Multiple)
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [images, setImages] = useState<string[]>([]);
  const [isPasting, setIsPasting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default Verifier (dongdong)
  useEffect(() => {
    if (isOpen) {
      const dongdong = users.find(u => u.name === 'dongdong');
      if (dongdong) {
        setResponsibleId(dongdong.id);
      } else {
         // Fallback default
         setResponsibleId(''); 
      }
      setExecutorIds([]);
    }
  }, [isOpen, users]);

  // Paste Event Listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          setIsPasting(true);
          
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (typeof event.target?.result === 'string') {
                setImages(prev => [...prev, event.target!.result as string]);
                setTimeout(() => setIsPasting(false), 500);
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now().toString(),
      title,
      description,
      projectName: project,
      status: TaskStatus.PENDING,
      priority,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      responsibleId: responsibleId || undefined,
      executorIds: executorIds, // Array
      images,
    });
    // Reset
    setTitle('');
    setDescription('');
    setExecutorIds([]);
    setDueDate('');
    setPriority(Priority.MEDIUM);
    setImages([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all scale-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Paste Overlay Indicator */}
        <div className={`absolute inset-0 bg-indigo-500/10 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${isPasting ? 'opacity-100' : 'opacity-0'}`}>
           <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl animate-bounce">
              正在粘贴图片...
           </div>
        </div>

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800">新建项目待办</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">任务标题</label>
                <input 
                  required
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：完成 Q3 季度汇报 PPT"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">任务描述</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述具体的执行要求..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">附件图片</label>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100"
                    >
                      {/* Image Thumbnail */}
                      <img 
                        src={img} 
                        alt="preview" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      
                      {/* Click Area for Zoom */}
                      <div 
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-zoom-in"
                        onClick={() => setPreviewImage(img)}
                      ></div>

                      {/* Delete Button - Top Right */}
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                        className="absolute top-1 right-1 p-1 bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="删除图片"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors bg-slate-50 hover:bg-indigo-50/50 relative overflow-hidden group"
                  >
                    <Upload size={18} />
                    <span className="text-[10px] mt-1">上传</span>
                    <div className="absolute inset-x-0 bottom-0 bg-indigo-50 text-[8px] text-indigo-500 text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      支持 Ctrl+V
                    </div>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-5 border-l border-slate-100 pl-6">
               <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">所属项目</label>
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                >
                  {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

               <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">优先级</label>
                <div className="flex flex-col gap-2">
                   {[Priority.HIGH, Priority.MEDIUM, Priority.LOW].map(p => (
                     <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`w-full py-2 rounded-lg text-xs font-bold border transition-all flex items-center px-3
                        ${priority === p 
                          ? (p === Priority.HIGH ? 'bg-rose-50 border-rose-200 text-rose-600 ring-1 ring-rose-200' : 
                             p === Priority.MEDIUM ? 'bg-amber-50 border-amber-200 text-amber-600 ring-1 ring-amber-200' : 
                             'bg-slate-100 border-slate-200 text-slate-600 ring-1 ring-slate-200')
                          : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}
                      `}
                     >
                       <div className={`w-2 h-2 rounded-full mr-2 ${p === Priority.HIGH ? 'bg-rose-500' : p === Priority.MEDIUM ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                       {p === Priority.HIGH ? 'P0 高优先级' : p === Priority.MEDIUM ? 'P1 中优先级' : 'P2 普通'}
                     </button>
                   ))}
                </div>
              </div>

              <UserSelector 
                label="核验人"
                users={users}
                mode="single"
                selectedIds={responsibleId ? [responsibleId] : []}
                onChange={(ids) => setResponsibleId(ids[0] || '')}
                placeholder="选择核验人"
              />

              <UserSelector 
                label="执行人 (可多选)"
                users={users}
                mode="multiple"
                selectedIds={executorIds}
                onChange={setExecutorIds}
                placeholder="选择执行人"
              />
              
               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">截止日期</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
            >
              创建任务
            </button>
          </div>
        </form>
      </div>

       {/* Lightbox Overlay */}
       {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <img 
            src={previewImage} 
            alt="Full preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};