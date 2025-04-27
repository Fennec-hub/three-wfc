export class WFCStackBuffer {
  private readonly buffer: Uint32Array;
  private readonly bitset: Uint8Array;
  private size: number;
  private tail: number;

  constructor(count: number) {
    this.buffer = new Uint32Array(count);
    this.bitset = new Uint8Array(count);

    this.size = 0;
    this.tail = 0;
  }

  push(value: number): void {
    if (this.bitset[value]) return;

    this.buffer[this.tail++] = value;

    this.size++;
    this.bitset[value] = 1;
  }

  pop(): number | undefined {
    if (this.size === 0) return undefined;

    const value = this.buffer[--this.tail];
    this.size--;
    this.bitset[value] = 0;
    return value;
  }

  reset() {
    this.tail = 0;
    this.size = 0;

    return this;
  }
}
