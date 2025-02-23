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
                console.log("Daten geladen:", data);

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

                // TODO, alle Sichten müssen geupdatet/gerendert werden, die müssen sich auch noch subscriben
                /*this.notify("dataLoaded", {
                    lists: this.lists,
                    items: this.items,
                    tags: this.tags
                });*/
            })
            .catch(error => console.error("Fehler beim Laden:", error));
    }

    init() {
        this.#loadFromJSON();
    }

    addList(name) {
        if(name) {
            let list = new List(name);
            this.lists.set(list.id, list); // fügt neue Liste in Map lists ein (Schlüssel list.id)
            console.info("Liste hinzugefügt",list);
            this.notify("addList", list); // Event werfen (damit man sich dafür subscriben kann)
        }
    }
}

// singleton pattern
export const model = new Model();