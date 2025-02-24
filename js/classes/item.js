export default class Item {
    static id = 0; // für fortlaufende id
    constructor(id, name, symbol, tags = [], is) {
        // Falls ID angegeben ist, nutze sie (z.B. für initdata.json), sonst erhöhe die static id
        this.id = id ?? ++Item.id;
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