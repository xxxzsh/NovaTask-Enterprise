import { Task, User } from './types';

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'dongdong',
        avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=dongdong&backgroundColor=f1f5f9'
    },
    {
        id: 'u2',
        name: 'alice',
        avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=alice&backgroundColor=e0e7ff'
    },
    {
        id: 'u3',
        name: 'bob',
        avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=bob&backgroundColor=ecfdf5'
    }
];

export const PROJECTS = [
  '低空安全系统',
  '大思政系统'
];

// Tasks are now managed by db.ts
export const INITIAL_TASKS: Task[] = [];