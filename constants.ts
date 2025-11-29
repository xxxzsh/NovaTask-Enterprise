import { Task, TaskStatus, User } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'xxxzsh', 
    role: '项目负责人', 
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=xxxzsh&backgroundColor=e0e7ff' 
  },
  { 
    id: 'u2', 
    name: 'xxxzjt', 
    role: '技术主管', 
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=xxxzjt&backgroundColor=ffedd5' 
  },
  { 
    id: 'u3', 
    name: 'dongdong', 
    role: '开发工程师', 
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=dongdong&backgroundColor=dcfce7' 
  },
];

export const PROJECTS = [
  '低空安全系统',
  '大思政系统'
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: '无人机识别算法优化',
    description: '针对低空复杂环境下的无人机识别率进行优化，需降低误报率至 0.1% 以下。',
    projectName: '低空安全系统',
    status: TaskStatus.PENDING,
    createdAt: new Date(Date.now() - 86400000 * 2),
    dueDate: new Date(Date.now() + 86400000 * 5),
    responsibleId: 'u1', // xxxzsh
    executorId: 'u2'     // xxxzjt
  },
  {
    id: 't2',
    title: '思政课程知识图谱构建',
    description: '完成第一期思政课程数据的清洗与关系抽取，构建基础知识图谱模型。',
    projectName: '大思政系统',
    status: TaskStatus.COMPLETED,
    createdAt: new Date(Date.now() - 86400000 * 5),
    completedAt: new Date(Date.now() - 3600000),
    responsibleId: 'u1', // xxxzsh
    executorId: 'u3'     // dongdong
  },
  {
    id: 't3',
    title: '系统单点登录接口对接',
    description: '完成与学校统一身份认证平台的对接，实现用户单点登录功能。',
    projectName: '大思政系统',
    status: TaskStatus.VERIFIED,
    createdAt: new Date(Date.now() - 86400000 * 10),
    completedAt: new Date(Date.now() - 86400000 * 3),
    verifiedAt: new Date(Date.now() - 86400000 * 1),
    responsibleId: 'u2', // xxxzjt
    executorId: 'u3'     // dongdong
  },
  {
    id: 't4',
    title: '雷达信号处理模块测试',
    description: '对新接入的相控阵雷达信号处理模块进行压力测试和性能验证。',
    projectName: '低空安全系统',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    responsibleId: 'u2', // xxxzjt
    executorId: 'u2'     // xxxzjt (Self assigned)
  }
];