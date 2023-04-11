import Dexie, { Table } from 'dexie';
import { Note } from '@/types/note.type';

class MySubClassedDexie extends Dexie {
  notes: Dexie.Table<Note, number>;

  constructor() {
    super('Database');
    this.version(1).stores({
      notes: '++id,title,thought,reason',
    });
    this.notes = this.table('notes');
  }
}

export const db = new MySubClassedDexie();
