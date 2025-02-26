import Subject from "./subject.js";
import Item from "./classes/item.js";
import List from "./classes/list.js";
import Tag from "./classes/tag.js";

class Model extends Subject {
    constructor() {
        super();
        this.lists = new Map();
        this.items = new Map();
        this.tags = new Map();
        this.init();
    }

    #loadFromJSON() {
        fetch('json/initdata.json')
            .then(response => {
                if (!response.ok) throw new Error(`Fehler: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Model: Daten geladen:", data);

                // Tags speichern
                data.tags.forEach(tag => this.tags.set(tag.id, new Tag(tag.id, tag.name)));

                // Einzelne Items speichern
                data.items.forEach(item => {
                    this.items.set(item.id, new Item(item.id, item.name, item.symbol, item.tags));
                });

                // Listen und enthaltene Items speichern
                data.lists.forEach(listData => {
                    const list = new List(listData.id, listData.name);
                    list.items = listData.items.map(entry => ({
                        item: this.items.get(entry.item.id),
                        quantity: entry.quantity,
                        isChecked: entry.isChecked
                    }));
                    this.lists.set(list.id, list);
                });

                // höchste ID aus JSON ermitteln und für static id's übernehmen
                List.id = Math.max(...data.lists.map(list => list.id), List.id);
                Item.id = Math.max(...data.items.map(item => item.id), Item.id);
                Tag.id = Math.max(...data.tags.map(tag => tag.id), Tag.id);

                // TODO, alle Sichten müssen geupdatet/gerendert werden, die müssen sich auch noch subscriben
                this.notify("dataLoaded", {
                    lists: this.lists,
                    items: this.items,
                    tags: this.tags
                });
            })
            .catch(error => console.error("Fehler beim Laden:", error));
    }

    init() {
        this.#loadFromJSON();
    }

    // Item in angegebener Menge der Liste hinzufügen
    addItemToList(list, item, quantity) {
        if (!list || !item || !quantity) {
            console.error("Fehler: Model: Ungültige Parameter für addItemToList");
            return;
        }

        // prüfen, ob das Item bereits in der Liste existiert
        let existingItem = list.items.find(i => i.item.id === item.id);

        if (existingItem) {
            // falls ja, erhöhe nur die Menge
            existingItem.quantity += parseInt(quantity, 10);
        } else {
            //falls nicht, füge das Item über die addItem-Methode hinzu
            list.addItem(item, quantity);
        }

        console.log(`Model: ${quantity}x '${item.name}' zu Liste '${list.name}' hinzugefügt.`);
        console.log("Model: Aktuelle Listen in der Map:", this.lists);

        // Liste updaten und Observer benachrichtigen
        this.notify("itemAddedToList", list);
    }

    removeItemFromList(listId, itemId) {
        const list = this.getListById(listId);
        if (list) {
            list.removeItem(itemId); // entfernt Item aus der Liste
            console.log("Model: Item aus Liste entfernt");
            console.log("Model: Aktuelle Listen in der Map:", this.lists);
            this.notify("itemRemoved", list); // View mitteilen, dass sich die Items der Liste geändert haben
        }
    }

    completeList(listId) {
        const list = this.getListById(listId);
        if (list && list.isCompletable()) {
            list.markCompleted();
            console.log("Model: Aktuelle Listen in der Map:", this.lists);
            this.notify("listCompletedDetailView", list);
            this.notify("listCompletedListView", this.lists);
        } else {
            alert("Die Liste kann erst abgeschlossen werden, wenn alle Artikel eingekauft wurden.");
        }
    }

    // Liste wieder aktivieren
    uncompleteList(listId) {
        const list = this.getListById(listId);
        if (list) {
            list.markUncompleted();
            console.log("Model: Aktuelle Listen in der Map:", this.lists);
        }

        // TODO listview updaten? detailview updaten?
        this.notify("listUncompletedDetailView", list);
        this.notify("listUncompletedListView", this.lists);
    }

    // Item bzw. Artikel einer Liste als "eingekauft" markieren
    toggleItemChecked(listId, itemId) {
        const list = this.getListById(listId);
        if (list) {
            list.toggleItemChecked(itemId);
            console.log("Model: Item in Liste an-/abgehackt");
            console.log("Model: Aktuelle Listen in der Map:", this.lists);
        }
    }

    updateListName(listId, newName) {
        const list = this.getListById(listId);
        if (list && newName) {
            list.name = newName;
            console.log("Model: Listename geändert",list);
            console.log("Model: Aktuelle Listen in der Map:", this.lists);
            this.notify("listNameUpdated", list); // Änderungs-Event bekanntgeben
        }
    }

    addList(name) {
        if(name) {
            let list = new List(null,name);
            this.lists.set(list.id, list); // fügt neue Liste in Map lists ein (Schlüssel list.id)
            console.log("Model: Liste hinzugefügt",list);
            // Map nach dem Hinzufügen der Liste in die Konsole ausgeben
            console.log("Model: Aktuelle Listen in der Map:", this.lists);
            this.notify("addList", list); // Event, für das man sich subscriben kann
        }
    }

    // liefert list anhand einer listId
    getListById(id) {
        return this.lists.get(Number(id));
    }

    // liefert item anhand einer itemId
    getItemById(id) {
        return this.items.get(Number(id));
    }

}

// singleton pattern
export const model = new Model();