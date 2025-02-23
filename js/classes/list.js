export default class List {
    static id = 2;
    constructor(name) {
        this.id = ++List.id;
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
