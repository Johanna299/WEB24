import { model } from "./model.js";
import { ListView } from "./listview.js";
import { ListDetailView } from "./listdetailview.js";

class Controller {
    constructor(){
        this.listView = new ListView();
        this.listDetailView = new ListDetailView();
        this.activeListId = null; // speichert die ID der aktiven Liste

        // Subscribe to the model
        model.subscribe("dataLoaded", this, this.onDataLoaded); //TODO
        model.subscribe("addList",this.listView,this.listView.addList);
        model.subscribe("listNameUpdated", this, this.onListUpdated);
    }

    init(){
        // für listview
        // Event-Listener für alle "Liste hinzufügen"-Buttons
        this.addAddListBtnEventListener();
        // Event-Listener für Eltern-Container, der den dynamischen Submit-Button für neue Listen enthält
        this.addSubmitEventListener();
        // Event-Listener für die Listenelemente hinzufügen
        this.addListItemEventListener();

        // für listdetailview
        // Event-Listener für das Bearbeiten des Listennamens
        this.addEditListNameEventListener();
        // Event Listener für Speichern-Button registrieren
        this.addSaveListNameEventListener();
        // Event Listener für Checkboxen der Items
        this.addItemCheckboxEventListener();
    }

    // Event-Delegation für die Item-Checkboxes einer Liste
    addItemCheckboxEventListener() {
        this.listDetailView.itemsContainer.addEventListener("click", (ev) => {
            if (ev.target.id == "checkbox-item") {
                const itemId = ev.target.closest('li').dataset.id;  // ID des Items aus `data-id` Attribut extrahieren
                console.log("Checkbox eines Items geklickt, itemId:", itemId);
                const activeList = model.getListById(this.activeListId);
                if (activeList) {
                    model.toggleItemChecked(this.activeListId, itemId); // aktualisiert das Model
                    //this.listDetailView.render(activeList); // TODO MIT SUBSCRIBE Render die Liste neu (opt.)
                }
            }
        });
    }

    // Event-Delegation für Listenname-speichern-Button, der auch für dynamische Buttons funktioniert
    addSaveListNameEventListener() {
        this.listDetailView.listNameContainer.addEventListener("click", (ev) => {
            if (ev.target.id == "save-list-name" || ev.target.id == "save-list-name-icon") {
                console.log("Speichern-Button für Listenname geklickt");

                const inputField = document.querySelector("#edit-list-name-input");
                if (!inputField) return;

                const newName = inputField.value;
                if (!newName) return;

                model.updateListName(this.activeListId, newName);

               // TODO falsch von GPT?
                /*const activeList = model.getListById(this.activeListId);
                if (activeList) {
                    activeList.name = newName; // Model aktualisieren
                    model.notify("listUpdated", activeList); // Model-Änderung bekanntgeben
                    this.listDetailView.render(activeList); // Ansicht aktualisieren
                }*/
            }
        });
    }

    // Event-Delegation für Listenname-bearbeiten-Button, der auch für dynamische Edit-Buttons funktioniert
    addEditListNameEventListener() {
        this.listDetailView.listNameContainer.addEventListener("click", (ev) => {
            if (ev.target.id == "edit-list-name" || ev.target.id == "edit-list-name-icon") {
                console.log("Edit-Button für Listenname geklickt");
                const activeList = model.getListById(this.activeListId);
                if (activeList) {
                    this.listDetailView.renderEditListNameInput(activeList);
                }
            }
        });
    }

    // Event-Delegation für "Liste hinzufügen"-Button, der auch für dynamische Buttons funktioniert
    addAddListBtnEventListener() {
        this.listView.addListButtonContainer.addEventListener('click', (ev) => {
            if (ev.target.id == "add-list-button") {
                console.log("'Liste hinzufügen' geklickt");
                this.listView.renderAddListInput();  // Eingabefeld anzeigen
            }
        });
    }

    // Event-Delegation wg. dynamischen Elementen: Event-Listener wird auf  Eltern-Container vom Submit-Button für neue Listen gesetzt
    addSubmitEventListener() {
        this.listView.addListButtonContainer.addEventListener('click', (ev) => {
            if (ev.target && (ev.target.id == 'submit-list-name') || (ev.target.id == 'submit-list-name-icon')) {
                console.log("'Submit' in Listenansicht geklickt");
                const listName = document.querySelector('#new-list-name').value;
                if(listName) {
                    model.addList(listName); // dem Model eine neue Liste hinzufügen
                    this.listView.renderAddListButton(); // nach dem Speichern "Liste hinzufügen"-Button wieder anzeigen
                }
            }
        });
    }

    // Event-Delegation wg. dynamischen Elementen: fügt Event-Listener zu allen Listenelementen hinzu
    addListItemEventListener() {
        this.listView.listsContainer.addEventListener('click', (ev) => {
            console.log("listContainer geklickt");
            if(ev.target.tagName == 'LI') {
                this.#setActiveList(ev.target);
            }
        });
    }

    // TODO je nachdem welches aktiv --> listDetailView

    // setzt das aktive Listenelement
    #setActiveList(clickedItem) {
        // entfernt die "active"-Klasse von allen Listenelementen
        const listItems = this.listView.listsContainer.querySelectorAll('li');
        listItems.forEach(item => item.classList.remove('active'));

        // fügt die "active"-Klasse dem angeklickten Element hinzu
        clickedItem.classList.add('active');

        // aktive Liste anhand der ID finden
        const listId = clickedItem.dataset.id;
        this.activeListId = listId; // speichert die aktuelle aktive Liste

        // entsprechende aktive Liste aus Model holen
        const list = model.getListById(listId);
        if(list) {
            this.listDetailView.render(list);
        }
    }

    onListUpdated(updatedList) {
        // listDetailView neu rendern
        if (updatedList.id == this.activeListId) {
            this.listDetailView.render(updatedList);
        }

        // listView neu rendern
        this.listView.render(model.lists);
        // aktives Listenelement wieder markieren
        const newActiveItem = this.listView.listsContainer.querySelector(`li[data-id="${this.activeListId}"]`);
        if (newActiveItem) {
            this.#setActiveList(newActiveItem);
        }
    }

    // sobald JSON Daten geladen wurden, alle Views aktualisieren
    onDataLoaded(data) {
        console.log("Controller: JSON-Daten wurden geladen", data);

        // Alle Views aktualisieren
        this.listView.render(data.lists);
        // TODO DetailView und ArticleView aktualisieren, zuvor detailView und articleView importieren!

        // falls es eine gespeicherte aktive Liste gibt, wiederherstellen
        if (this.activeListId) {
            const activeList = model.getListById(this.activeListId);
            if (activeList) {
                this.listDetailView.render(activeList);
            }
        } else if (data.lists.size > 0) {
            // falls keine aktive Liste gespeichert war, erste Liste auswählen
            this.#setActiveList(this.listView.listsContainer.querySelector('li'));
        }
    }
}

export const controller = new Controller();

