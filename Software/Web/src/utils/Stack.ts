export class Stack<T> {

  stack: T[];

  constructor(...items: T[]) {
    this.stack = items;
  }

  push(item: T) {
    this.stack.push(item);
  }

  peek() {
    return this.stack[this.stack.length - 1];
  }

  pop() {
    return this.stack.pop() as T;
  }

  empty() {
    return this.stack.length === 0;
  }

}
