export default class List {
    static id = 0; // für fortlaufende id
    constructor(id, name) {
        // Falls ID angegeben ist, nutze sie (z.B. für initdata.json), sonst erhöhe die static id
        this.id = id ?? ++List.id;
        this.name = name;
        this.items = [];
        this.completed = false;
    }

    addItem(item, quantity) {
        this.items.push({ item, quantity, isChecked: false });
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.item.id != itemId);;
    }

    toggleItemChecked(itemId) {
        const entry = this.items.find(entry => entry.item.id == itemId);
        if (entry) {
            entry.isChecked = !entry.isChecked;
            console.log("List: Item isChecked", entry.isChecked);
        }
    }

    // Prüft, ob alle Items als erledigt markiert sind
    isCompletable() {
        return this.items.length > 0 && this.items.every(item => item.isChecked);
    }

    markCompleted() {
        // überprüfen, ob alle Items isChecked true haben: wenn ja, dann Liste abschließen
        if (this.isCompletable()) {
            this.completed = true;
            console.log("Liste wurde abgeschlossen", this);
        } else {
            console.warn("Liste kann nicht abgeschlossen werden, nicht alle Items sind erledigt.");
        }
    }

    markUncompleted(){
        this.completed = false;
        console.log("Liste wurde aktiviert", this);
    }
}
