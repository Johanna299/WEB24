export default class List {
    static id = 0; // für fortlaufende id
    constructor(id, name) {
        // Falls ID angegeben ist, nutze sie (z.B. für initdata.json), sonst erhöhe die static id
        this.id = id ?? ++List.id;
        this.name = name;
        this.items = [];
    }

    addItem(item, quantity) {
        this.items.push({ item, quantity, isChecked: false });
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => entry.item.id != itemId);
    }

    toggleItemChecked(itemId) {
        const entry = this.items.find(entry => entry.item.id == itemId);
        if (entry) {
            entry.isChecked = !entry.isChecked;
        }
    }

    //TODO
    markComplete() {
        console.log(`Liste ${this.name} wurde abgeschlossen.`);
    }
}
