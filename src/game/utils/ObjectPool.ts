/**
 * Pool genérico de objetos pré-alocados (RF não-funcional: nunca criar/destruir
 * projéteis ou partículas em runtime, apenas ativar/desativar).
 * - `factory` é chamada `size` vezes na construção; nada é alocado depois.
 * - `acquire` retorna um item livre ou `undefined` quando o pool está esgotado
 *   (o chamador decide o que fazer — normalmente ignorar o disparo).
 */
export class ObjectPool<T> {
  private readonly items: T[] = [];
  private readonly free: T[] = [];
  private readonly activeItems = new Set<T>();

  constructor(size: number, factory: (index: number) => T) {
    for (let i = 0; i < size; i++) {
      const item = factory(i);
      this.items.push(item);
      this.free.push(item);
    }
  }

  acquire(): T | undefined {
    const item = this.free.pop();
    if (item !== undefined) {
      this.activeItems.add(item);
    }
    return item;
  }

  release(item: T): void {
    if (this.activeItems.delete(item)) {
      this.free.push(item);
    }
  }

  forEachActive(callback: (item: T) => void): void {
    this.activeItems.forEach(callback);
  }

  get activeCount(): number {
    return this.activeItems.size;
  }

  get size(): number {
    return this.items.length;
  }
}
