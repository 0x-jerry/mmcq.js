export default class PQueue {
  constructor(comparator) {
    this.contents = []
    this.sorted = false
    this.comparator = comparator
  }

  sort() {
    this.contents.sort(this.comparator);
    this.sorted = true;
  }

  push(o) {
    this.contents.push(o);
    this.sorted = false;
  }

  peek(index) {
    if (!this.sorted) this.sort();
    if (index === undefined) index = this.contents.length - 1;
    return this.contents[index];
  }

  pop() {
    if (!this.sorted) this.sort();
    return this.contents.pop();
  }

  size() {
    return this.contents.length;
  }

  map(f) {
    return this.contents.map(f);
  }

  debug() {
    if (!this.sorted) this.sort();
    return this.contents;
  }
}
