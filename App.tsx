import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { StatsCard } from './components/StatsCard';
import { Login } from './components/Login';
import { INITIAL_TASKS, MOCK_USERS, PROJECTS } from './constants';
import { Task, TabView, TaskStatus, ViewMode, Priority, User } from './types';
import { CheckCircle2, Clock, ListTodo, Layers, Search, LayoutGrid, List as ListIcon, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentTab, setCurrentTab] = useState<TabView>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('All');
  
  // Login Handler
  const handleLogin = (name: string) => {
    // Check if user exists (case-insensitive for better UX, but storing as entered)
    let user = users.find(u => u.name === name);
    
    if (!user) {
      // Create new user if not found
      user = {
        id: `u${Date.now()}`,
        name: name,
        avatar: `https://api.dicebear.com/9.x/micah/svg?seed=${name}&backgroundColor=f1f5f9`
      };
      setUsers(prev => [...prev, user!]);
    }
    
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Actions
  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    // If the currently selected task is updated, update the selection state too
    if (selectedTask?.id === updatedTask.id) {
        setSelectedTask(updatedTask);
    }
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
  
  const stats = {
    total: tasks.length,
    pending: pendingTasks.length,
    reviewing: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    verified: tasks.filter(t => t.status === TaskStatus.VERIFIED).length,
  };

  // Filter tasks based on current view/tab
  const { activeTasks, doneTasks } = useMemo(() => {
    let baseTasks = tasks;

    // 1. Filter by User (Assignee/Executor or Verifier)
    if (selectedUserFilter !== 'All') {
      baseTasks = baseTasks.filter(t => 
        (t.executorIds && t.executorIds.includes(selectedUserFilter)) || 
        t.responsibleId === selectedUserFilter
      );
    }
    
    // 2. Filter by Project (Applied to 'projects' AND 'completed' tabs now)
    if ((currentTab === 'projects' || currentTab === 'completed') && selectedProjectFilter !== 'All') {
       baseTasks = baseTasks.filter(t => t.projectName === selectedProjectFilter);
    }
    
    // 3. Split based on Tabs
    if (currentTab === 'completed') {
       // In Archive, show ONLY Verified tasks
       const archived = baseTasks.filter(t => t.status === TaskStatus.VERIFIED);
       // Sort archived by verified time
       archived.sort((a,b) => new Date(b.verifiedAt || 0).getTime() - new Date(a.verifiedAt || 0).getTime());
       return { activeTasks: [], doneTasks: archived };
    }

    // Sort function: Priority (High>Med>Low) -> Status (Pending>Completed) -> Date
    const sortFn = (a: Task, b: Task) => {
       const pScore = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
       if (pScore[a.priority] !== pScore[b.priority]) return pScore[b.priority] - pScore[a.priority];
       
       const sScore = { [TaskStatus.PENDING]: 2, [TaskStatus.COMPLETED]: 1, [TaskStatus.VERIFIED]: 0 };
       if (sScore[a.status] !== sScore[b.status]) return sScore[b.status] - sScore[a.status];

       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    };

    const active = baseTasks.filter(t => t.status !== TaskStatus.VERIFIED).sort(sortFn);
    
    // In Dashboard/Projects view, "doneTasks" acts as the bottom section for verified tasks that pass filters
    const done = baseTasks.filter(t => t.status === TaskStatus.VERIFIED).sort((a,b) => new Date(b.verifiedAt || 0).getTime() - new Date(a.verifiedAt || 0).getTime());

    return { activeTasks: active, doneTasks: done };
  }, [tasks, currentTab, selectedProjectFilter, selectedUserFilter]);

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-600">
      <Sidebar 
        currentTab={currentTab} 
        onChangeTab={(tab) => { setCurrentTab(tab); setSelectedProjectFilter('All'); }} 
        onNewTask={() => setIsModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
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
             {/* User Filter Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-sm">
               <Filter size={14} className="text-slate-400" />
               <select 
                 value={selectedUserFilter}
                 onChange={(e) => setSelectedUserFilter(e.target.value)}
                 className="bg-transparent outline-none text-slate-700 font-medium cursor-pointer min-w-[80px]"
               >
                 <option value="All">全部人员</option>
                 {users.map(u => (
                   <option key={u.id} value={u.id}>{u.name}</option>
                 ))}
               </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="网格视图"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="列表视图"
              >
                <ListIcon size={18} />
              </button>
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

        {/* Project Filter Toolbar (Visible in Projects AND Completed Tabs) */}
        {(currentTab === 'projects' || currentTab === 'completed') && (
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setSelectedProjectFilter('All')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex-shrink-0
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
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex-shrink-0
                  ${selectedProjectFilter === p 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Task List Grid/List */}
        <div className={`pb-20 ${viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : 'flex flex-col gap-0 rounded-2xl overflow-hidden shadow-sm border border-slate-100'}`}>
          {/* Active Tasks */}
          {activeTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              users={users} 
              onComplete={handleCompleteTask}
              onVerify={handleVerifyTask}
              viewMode={viewMode}
              onClick={() => setSelectedTask(task)}
              currentUser={currentUser}
            />
          ))}

          {/* Separator if both exist */}
          {activeTasks.length > 0 && doneTasks.length > 0 && currentTab !== 'completed' && (
            <div className={`col-span-full py-6 flex items-center gap-4 ${viewMode === 'list' ? 'bg-[#f8fafc]' : ''}`}>
               <div className="h-px bg-slate-200 flex-1"></div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} /> 已完成任务
               </div>
               <div className="h-px bg-slate-200 flex-1"></div>
            </div>
          )}

          {/* Done Tasks (In Dashboard they are at bottom, in Archive they are main) */}
          {doneTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              users={users} 
              onComplete={handleCompleteTask}
              onVerify={handleVerifyTask}
              viewMode={viewMode}
              onClick={() => setSelectedTask(task)}
              currentUser={currentUser}
            />
          ))}
          
          {activeTasks.length === 0 && doneTasks.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <ListTodo size={40} className="text-slate-300" />
               </div>
               <p className="font-medium">暂无相关任务</p>
               {selectedUserFilter !== 'All' 
                 ? <p className="text-xs mt-1 text-slate-400">试试切换筛选人员?</p>
                 : <p className="text-xs mt-1 text-slate-400">点击左侧 "发布待办" 创建新任务</p>
               }
            </div>
          )}
        </div>
      </main>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddTask}
        users={users}
        currentUser={currentUser}
      />
      
      <TaskDetailModal 
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        users={users}
        onComplete={handleCompleteTask}
        onVerify={handleVerifyTask}
        onUpdate={handleUpdateTask}
        currentUser={currentUser}
      />
    </div>
  );
};

export default App;