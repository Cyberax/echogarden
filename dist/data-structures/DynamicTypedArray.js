export class DynamicTypedArray {
    TypedArrayConstructor;
    elements;
    length = 0;
    constructor(TypedArrayConstructor, initialCapacity = 4) {
        this.TypedArrayConstructor = TypedArrayConstructor;
        this.elements = new TypedArrayConstructor(initialCapacity);
    }
    add(newElement) {
        const length = this.length;
        if (length === this.elements.length) {
            this.ensureCapacity(length + 1);
        }
        this.elements[length] = newElement;
        this.length += 1;
    }
    addMany(...newElements) {
        this.addArray(newElements);
    }
    addArray(newElements) {
        const addedCount = newElements.length;
        this.ensureCapacity(this.length + addedCount);
        this.elements.set(newElements, this.length);
        this.length += addedCount;
    }
    ensureCapacity(requiredCapacity) {
        if (requiredCapacity > this.elements.length) {
            const newCapacity = requiredCapacity * 2;
            const newElements = new this.TypedArrayConstructor(newCapacity);
            newElements.set(this.toTypedArray());
            this.elements = newElements;
        }
    }
    toTypedArray() {
        return this.elements.subarray(0, this.length);
    }
    clear() {
        this.length = 0;
    }
}
export function createDynamicUint8Array(initialCapacity) {
    return new DynamicTypedArray(Uint8Array, initialCapacity);
}
export function createDynamicUint16Array(initialCapacity) {
    return new DynamicTypedArray(Uint16Array, initialCapacity);
}
//# sourceMappingURL=DynamicTypedArray.js.map