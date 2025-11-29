import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ChevronDown, Check, User as UserIcon, X } from 'lucide-react';

interface UserSelectorProps {
  users: User[];
  selectedIds: string[]; // Always an array, even for single mode
  onChange: (ids: string[]) => void;
  mode: 'single' | 'multiple';
  placeholder?: string;
  label?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  users, 
  selectedIds, 
  onChange, 
  mode, 
  placeholder = "选择人员...",
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (userId: string) => {
    if (mode === 'single') {
      onChange([userId]);
      setIsOpen(false);
    } else {
      if (selectedIds.includes(userId)) {
        onChange(selectedIds.filter(id => id !== userId));
      } else {
        onChange([...selectedIds, userId]);
      }
    }
  };

  const selectedUsers = users.filter(u => selectedIds.includes(u.id));

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full min-h-[42px] bg-white border rounded-xl flex items-center justify-between px-3 py-2 cursor-pointer transition-all
          ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selectedUsers.length > 0 ? (
            selectedUsers.map(u => (
              <div key={u.id} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-medium border border-slate-200">
                <img src={u.avatar} className="w-4 h-4 rounded-full" alt="" />
                <span>{u.name}</span>
                {mode === 'multiple' && (
                  <span 
                    onClick={(e) => { e.stopPropagation(); handleSelect(u.id); }}
                    className="hover:text-rose-500 cursor-pointer p-0.5"
                  >
                    <X size={10} />
                  </span>
                )}
              </div>
            ))
          ) : (
            <span className="text-slate-400 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar p-1">
          {users.length === 0 ? (
             <div className="p-3 text-center text-xs text-slate-400">无可选人员</div>
          ) : (
            users.map(user => {
              const isSelected = selectedIds.includes(user.id);
              return (
                <div 
                  key={user.id}
                  onClick={() => handleSelect(user.id)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm
                    ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}
                  `}
                >
                  <img src={user.avatar} className="w-6 h-6 rounded-full border border-white shadow-sm" alt="" />
                  <span className="flex-1 font-medium">{user.name}</span>
                  {isSelected && <Check size={14} className="text-indigo-600" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};