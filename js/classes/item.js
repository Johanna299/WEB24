export default class Item {
    static id = 0; // für fortlaufende id
    tags = [];

    constructor(id, name, symbol, tags = []) {
        // Falls ID angegeben ist, nutze sie (z.B. für initdata.json), sonst erhöhe die static id
        this.id = id ?? ++Item.id;
        this.name = name;
        this.symbol = symbol;
        // sicherstellen, dass tags als Objekte übergeben werden, nicht als Strings
        tags.forEach(tag => this.addTag(tag));
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            tag.itemIds.add(this.id);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t != tag);
        tag.itemIds.delete(this.id);
    }
}