import Dexie, { Table } from 'dexie';
import { Task, User } from './types';
import { MOCK_USERS } from './constants';

export class NovaTaskDatabase extends Dexie {
  tasks!: Table<Task>;
  users!: Table<User>;

  constructor() {
    super('NovaTaskDB');
    (this as any).version(1).stores({
      tasks: 'id, status, priority, projectName, responsibleId',
      users: 'id, name' 
    });
  }

  async seed() {
    const userCount = await this.users.count();
    if (userCount === 0) {
      await this.users.bulkAdd(MOCK_USERS);
    }
  }
}

export const db = new NovaTaskDatabase();