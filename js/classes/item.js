export default class Item {
    static id = 4;
    constructor(name, symbol, tags = [], is) {
        this.id = ++Item.id;
        this.name = name;
        this.symbol = symbol;
        this.tags = tags;
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t != tag);
    }
}