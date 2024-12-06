export class OpenPromise {
    promise;
    resolve = () => { throw new Error('Open promise resolved before initialization'); };
    reject = () => { throw new Error('Open promise rejected before initialization'); };
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
//# sourceMappingURL=OpenPromise.js.map