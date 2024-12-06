export class Queue {
    list = [];
    constructor() {
    }
    enqueue(item) {
        this.list.push(item);
    }
    dequeue() {
        return this.list.shift();
    }
    get isEmpty() { return this.list.length == 0; }
    get isNonempty() { return !this.isEmpty; }
}
//# sourceMappingURL=Queue.js.map