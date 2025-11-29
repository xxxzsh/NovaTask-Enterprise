import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { StatsCard } from './components/StatsCard';
import { INITIAL_TASKS, MOCK_USERS, PROJECTS } from './constants';
import { Task, TabView, TaskStatus } from './types';
import { CheckCircle2, Clock, ListTodo, Layers, Search } from 'lucide-react';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentTab, setCurrentTab] = useState<TabView>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  
  // Current user logic
  const currentUser = MOCK_USERS[0]; // xxxzsh

  // Actions
  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: TaskStatus.COMPLETED, completedAt: new Date() } 
        : t
    ));
  };

  const handleVerifyTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: TaskStatus.VERIFIED, verifiedAt: new Date() } 
        : t
    ));
  };

  // Derived State
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING);
  const completedTasks = tasks.filter(t => t.status !== TaskStatus.PENDING);
  
  const stats = {
    total: tasks.length,
    pending: pendingTasks.length,
    reviewing: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    verified: tasks.filter(t => t.status === TaskStatus.VERIFIED).length,
  };

  const filteredTasks = useMemo(() => {
    let baseTasks = tasks;
    
    if (currentTab === 'dashboard') {
      // Dashboard shows pending and reviewing, hides verified
      baseTasks = baseTasks.filter(t => t.status !== TaskStatus.VERIFIED);
    } else if (currentTab === 'completed') {
      baseTasks = baseTasks.filter(t => t.status === TaskStatus.VERIFIED);
    } else if (currentTab === 'projects') {
       if (selectedProjectFilter !== 'All') {
         baseTasks = baseTasks.filter(t => t.projectName === selectedProjectFilter);
       }
    }

    // Sort: Pending first, then by date
    return baseTasks.sort((a, b) => {
      // Priority: Pending > Completed > Verified
      const score = (status: TaskStatus) => {
        if (status === TaskStatus.PENDING) return 3;
        if (status === TaskStatus.COMPLETED) return 2;
        return 1;
      };
      
      const scoreA = score(a.status);
      const scoreB = score(b.status);
      
      if (scoreA !== scoreB) return scoreB - scoreA;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, currentTab, selectedProjectFilter]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-600">
      <Sidebar 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        onNewTask={() => setIsModalOpen(true)}
      />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen relative">
        {/* Decorative Background Blob */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <header className="flex justify-between items-end mb-10">
          <div>
             <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {currentTab === 'dashboard' && '工作看板'}
              {currentTab === 'projects' && '项目概览'}
              {currentTab === 'completed' && '归档任务'}
             </h1>
             <p className="text-slate-400 text-sm mt-2 font-medium">你好, {currentUser.name}。今天也是充满活力的一天！</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="搜索任务..." className="text-sm bg-transparent outline-none placeholder:text-slate-400 w-48" />
            </div>
            <div className="text-sm font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
              {new Date().toLocaleDateString('zh-CN', { weekday: 'short', month: 'numeric', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Dashboard Stats Row */}
        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatsCard 
              label="待办事项" 
              value={stats.pending} 
              icon={<ListTodo className="text-white" size={24} />}
              colorClass="bg-slate-900 shadow-slate-200"
            />
             <StatsCard 
              label="待核验" 
              value={stats.reviewing} 
              icon={<Clock className="text-white" size={24} />}
              colorClass="bg-indigo-500 shadow-indigo-200"
            />
             <StatsCard 
              label="已完成" 
              value={stats.verified} 
              icon={<CheckCircle2 className="text-white" size={24} />}
              trend="+3 本周"
              colorClass="bg-emerald-500 shadow-emerald-200"
            />
             <StatsCard 
              label="活跃项目" 
              value={PROJECTS.length} 
              icon={<Layers className="text-white" size={24} />}
              colorClass="bg-blue-500 shadow-blue-200"
            />
          </div>
        )}

        {/* Project Filter Toolbar */}
        {currentTab === 'projects' && (
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setSelectedProjectFilter('All')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                ${selectedProjectFilter === 'All' 
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 scale-105' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
            >
              全部项目
            </button>
            {PROJECTS.map(p => (
              <button 
                key={p}
                onClick={() => setSelectedProjectFilter(p)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                  ${selectedProjectFilter === p 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Task List Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              users={MOCK_USERS} 
              onComplete={handleCompleteTask}
              onVerify={handleVerifyTask}
            />
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <ListTodo size={40} className="text-slate-300" />
               </div>
               <p className="font-medium">暂无相关任务</p>
               <p className="text-xs mt-1 text-slate-400">点击左侧 "发布待办" 创建新任务</p>
            </div>
          )}
        </div>
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddTask}
        users={MOCK_USERS}
      />
    </div>
  );
};

export default App;