export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED', // Done by executor
  VERIFIED = 'VERIFIED'    // Checked by responsible person
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectName: string;
  status: TaskStatus;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  verifiedAt?: Date;
  
  // Person responsible for the task (Manager/Owner)
  responsibleId?: string;
  // Person executing the task (Worker)
  executorId?: string;
}

export type TabView = 'dashboard' | 'projects' | 'completed';
