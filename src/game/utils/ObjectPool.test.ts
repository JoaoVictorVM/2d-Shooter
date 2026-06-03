import { describe, it, expect } from 'vitest';
import { ObjectPool } from './ObjectPool.ts';

interface Dummy {
  id: number;
}

const makePool = (size: number) => new ObjectPool<Dummy>(size, (id) => ({ id }));

describe('ObjectPool', () => {
  it('pre-allocates exactly `size` items', () => {
    const pool = makePool(3);
    expect(pool.size).toBe(3);
    expect(pool.activeCount).toBe(0);
  });

  it('acquires distinct items and tracks active count', () => {
    const pool = makePool(2);
    const a = pool.acquire();
    const b = pool.acquire();
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a).not.toBe(b);
    expect(pool.activeCount).toBe(2);
  });

  it('returns undefined when exhausted', () => {
    const pool = makePool(1);
    pool.acquire();
    expect(pool.acquire()).toBeUndefined();
  });

  it('reuses released items instead of allocating new ones', () => {
    const pool = makePool(1);
    const first = pool.acquire();
    pool.release(first as Dummy);
    expect(pool.activeCount).toBe(0);
    const second = pool.acquire();
    expect(second).toBe(first);
  });

  it('iterates only active items', () => {
    const pool = makePool(3);
    const a = pool.acquire() as Dummy;
    const b = pool.acquire() as Dummy;
    pool.release(a);
    const seen: Dummy[] = [];
    pool.forEachActive((item) => seen.push(item));
    expect(seen).toEqual([b]);
  });

  it('ignores releasing an item that is not active', () => {
    const pool = makePool(2);
    const a = pool.acquire() as Dummy;
    pool.release(a);
    pool.release(a);
    expect(pool.activeCount).toBe(0);
    expect(pool.size).toBe(2);
  });
});
