import Dexie, { Table } from 'dexie';

export interface Session {
  id?: number;
  timestamp: Date;
  mood?: string;
  notes?: string;
}

export interface Entry {
  id?: number;
  sessionId: number;
  type: 'breathing' | 'journal' | 'reflection';
  content: string;
  duration?: number;
  timestamp: Date;
}

export interface Feather {
  id?: number;
  type: 'breathing' | 'journal' | 'reflection' | 'streak';
  count: number;
  lastEarned: Date;
}

export interface FeatherLedger {
  id?: number;
  timestamp: Date;
  type: string;
  amount: number;
  description?: string;
}

export interface Settings {
  id?: number;
  key: string;
  value: string | boolean | number;
  updatedAt: Date;
}

export class WellbeingDB extends Dexie {
  sessions!: Table<Session>;
  entries!: Table<Entry>;
  feathers!: Table<Feather>;
  featherLedger!: Table<FeatherLedger>;
  settings!: Table<Settings>;

  constructor() {
    super('WellbeingDB');
    this.version(2).stores({
      sessions: '++id, timestamp, mood',
      entries: '++id, sessionId, type, timestamp',
      feathers: '++id, type, count, lastEarned',
      featherLedger: '++id, timestamp, type, amount, description',
      settings: '++id, key, value, updatedAt'
    });
  }
}

export const db = new WellbeingDB();
