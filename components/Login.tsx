import React, { useState } from 'react';
import { Hexagon, ArrowRight, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (username: string) => void;
  users: User[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <Hexagon size={24} fill="currentColor" className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">NovaTask Enterprise</h1>
          <p className="text-slate-400 text-sm mt-1">内部协作系统</p>
        </div>

        {users.length > 0 && (
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              快速登录
            </label>
            <div className="grid grid-cols-2 gap-3">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user.name)}
                  className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left"
                >
                  <img src={user.avatar} className="w-8 h-8 rounded-full bg-slate-200" alt={user.name} />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 truncate">{user.name}</span>
                </button>
              ))}
            </div>
            <div className="relative my-6 text-center">
              <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100"></div>
              <span className="relative bg-white px-2 text-xs text-slate-400">或输入新账号</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              账号姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={users.length > 0 ? "输入姓名注册或登录..." : "请输入您的姓名开始使用"}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-800 placeholder-slate-400"
              autoFocus={users.length === 0}
            />
          </div>
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>进入系统</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-slate-400">© 2024 NovaTask Enterprise System</p>
    </div>
  );
};