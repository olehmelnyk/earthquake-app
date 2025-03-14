import { db } from './db.js';

describe('db', () => {
  it('should be defined', () => {
    expect(db).toBeDefined();
    expect(db.earthquake).toBeDefined();
    expect(db.importHistory).toBeDefined();
  });
});
