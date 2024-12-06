export class WindowedList {
    maxWindowLength;
    elements = [];
    startOffset = 0;
    constructor(maxWindowLength) {
        this.maxWindowLength = maxWindowLength;
    }
    add(value) {
        if (this.elements.length === this.maxWindowLength) {
            this.elements.shift();
            this.startOffset += 1;
        }
        this.elements.push(value);
    }
    get(index) {
        if (index < this.startOffset) {
            throw new Error(`Index is smaller than to window start offset.`);
        }
        if (index >= this.endOffset) {
            throw new Error(`Index is beyond window end offset.`);
        }
        return this.elements[index - this.startOffset];
    }
    slice(startIndex, endIndex) {
        const result = [];
        endIndex = Math.min(endIndex, this.endOffset);
        for (let i = startIndex; i < endIndex; i++) {
            result.push(this.get(i));
        }
        return result;
    }
    get endOffset() {
        return this.startOffset + this.elements.length;
    }
}
//# sourceMappingURL=WindowedList.js.map