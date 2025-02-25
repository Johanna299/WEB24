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

    // für listDetailView einer aktiven Liste
    getListById(id) {
        return this.lists.get(Number(id));
    }

}

// singleton pattern
export const model = new Model();