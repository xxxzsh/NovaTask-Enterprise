import React from 'react';
import { LayoutDashboard, FolderKanban, CheckCircle2, Settings, Plus, Hexagon, LogOut } from 'lucide-react';
import { TabView, User } from '../types';

interface SidebarProps {
  currentTab: TabView;
  onChangeTab: (tab: TabView) => void;
  onNewTask: () => void;
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onChangeTab, onNewTask, currentUser, onLogout }) => {
  const navItems: { id: TabView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: '工作台', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: '项目试图', icon: <FolderKanban size={20} /> },
    { id: 'completed', label: '已归档', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col shadow-sm sticky top-0 left-0 z-10 transition-all">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3 mb-10 group cursor-default">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-slate-200 shadow-lg transition-transform duration-500 group-hover:rotate-12">
            <Hexagon size={18} fill="currentColor" className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 tracking-tight leading-none">企业协作</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-1">Enterprise Task</span>
          </div>
        </div>

        <button 
          onClick={onNewTask}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Plus size={18} />
          <span className="font-medium relative z-10">发布待办</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden
              ${currentTab === item.id 
                ? 'text-slate-900 bg-slate-50 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            {currentTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full"></div>
            )}
            <span className={`transition-colors duration-200 ${currentTab === item.id ? 'text-slate-900' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-600 transition-colors text-sm font-medium rounded-xl hover:bg-slate-50 mb-2"
        >
          <LogOut size={20} />
          退出登录
        </button>
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-100 bg-slate-50/50">
            <img src={currentUser.avatar} className="w-8 h-8 rounded-full bg-white ring-2 ring-white" alt="Profile" />
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-700 truncate">{currentUser.name}</span>
                <span className="text-[10px] text-emerald-500 font-medium">Online</span>
            </div>
        </div>
      </div>
    </div>
  );
};