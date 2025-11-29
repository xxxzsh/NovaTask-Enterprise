export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED', // Done by executor
  VERIFIED = 'VERIFIED'    // Checked by verifier (formerly responsible)
}

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectName: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  verifiedAt?: Date;
  images?: string[]; // Array of Base64 strings or URLs
  
  // Person responsible for verifying (Verifier)
  responsibleId?: string;
  // People executing the task (Executors)
  executorIds?: string[];
}

export type TabView = 'dashboard' | 'projects' | 'completed';
export type ViewMode = 'grid' | 'list';