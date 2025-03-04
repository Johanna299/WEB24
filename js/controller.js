import { model } from "./model.js";
import { ListView } from "./listview.js";
import { ListDetailView } from "./listdetailview.js";
import { ArticleView } from "./articleview.js";

class Controller {
    constructor(){
        this.listView = new ListView();
        this.listDetailView = new ListDetailView();
        this.articleView = new ArticleView();
        this.activeListId = null; // speichert die ID der aktiven Liste

        // Subscribe to the model
        model.subscribe("dataLoaded", this, this.onDataLoaded);
        model.subscribe("addList", this.listView, this.listView.addList);
        model.subscribe("listNameUpdated", this, this.onListUpdated);
        model.subscribe("itemRemoved", this.listDetailView, this.listDetailView.render);
        model.subscribe("listCompletedDetailView", this.listDetailView, this.listDetailView.render);
        model.subscribe("listCompletedListView", this.listView, this.listView.render);
        model.subscribe("listUncompletedDetailView", this.listDetailView, this.listDetailView.render);
        model.subscribe("listUncompletedListView", this.listView, this.listView.render);
        model.subscribe("itemAddedToList", this.listDetailView, this.listDetailView.render);
        model.subscribe("newItemCreated", this.articleView, this.articleView.renderAddItem);
        model.subscribe("newTagCreatedNewItem", this.articleView, this.articleView.addNewTagToTagCheckboxes);
        model.subscribe("removedTagFromItem", this.articleView, this.articleView.renderEditItemMenu);
        model.subscribe("deletedTag", this.articleView, this.articleView.renderFilterTags);
        model.subscribe("newTagCreatedEditItem", this.articleView, this.articleView.addNewTagToListGroup);
        model.subscribe("updatedItem", this.listDetailView, this.listDetailView.render);
    }

    init(){
        // für listview
        // Event-Listener für alle "Liste hinzufügen"-Buttons
        this.addAddListBtnEventListener();
        // Event-Listener für Eltern-Container, der den dynamischen Submit-Button für neue Listen enthält
        this.addSubmitEventListener();
        // Event-Listener für die Listenelemente
        this.addListItemEventListener();

        // für listdetailview
        // Event-Listener für das Bearbeiten des Listennamens
        this.addEditListNameEventListener();
        // Event Listener für Speichern-Button
        this.addSaveListNameEventListener();
        // Event Listener für Checkboxen der Items
        this.addItemCheckboxEventListener();
        // Event Listener fürs Entfernen von Items einer Liste
        this.addRemoveItemEventListener();
        // Event-Listener für "Abschließen"-Button
        this.addCompleteListEventListener();
        // Event-Listener für "Aktvieren"-Button
        this.addActivateListEventListener();
        // Event-Listener für "Artikel hinzufügen"-Button
        this.addAddItemEventListener();

        // für articleview
        // Event-Listener für "Artikel hinzufügen"-Ansicht schließen
        this.addCloseAddItemEventListener();
        // Event-Listener zur Auswahl eines Artikels
        this.addItemEventListener();
        // Event-Listener zur Bestätigung der Mengeneingabe eines Artikels
        this.addSubmitQuantityListener();
        // Event-Listener fürs Filtern
        this.addFilterButtonEventListener();
        // Event-Listener für "Neuer Artikel"-Button
        this.addNewArticleButtonEventListener();
        // Event-Listener für "Neuer Artikel"-Ansicht schließen
        this.addCloseNewArticleEventListener();
        // Event-Listener für den "Artikel erstellen"-Button
        this.addSaveNewItemEventListener();
        // Event-Listener für den "Tag erstellen"-Button
        this.addNewTagEventListener();
        // Event-Listener zum Bearbeiten eines Artikels
        this.addEditItemEventListener();
        // Event-Listener zum Entfernen eines Tags vom Artikel
        this.addRemoveTagFromItemEventListener();
        // Event-Listener fürs endgültige Löschen von Tags
        this.addDeleteTagEventListener();
        // Event-Listener fürs "Neuer Tag" in "Artikel bearbeiten"
        this.addAddTagToItemEventListener();
        // Event-Listener fürs "Tag hinzufügen" in "Artikel bearbeiten"
        this.addAddNewTagToItemEventListener();
        // Event-Listener fürs "Artikel bearbeiten" schließen
        this.addCloseEditItemEventListener();
        // Event-Listener für "Änderungen speichern" in "Artikel bearbeiten"
        this.addSaveEditedItemEventListener();
        // Event-Listener fürs endgültige Löschen von Items
        this.addDeleteItemEventListener();

        // füge einen Event-Listener zum Navbar-Brand hinzu
        document.querySelector('.navbar-brand').addEventListener('click', function() {
            // toggle die Klasse 'clicked' für die Animation
            this.classList.toggle('clicked');
        });

    }

    // Event-Listener fürs endgültige Löschen von Items
    addDeleteItemEventListener() {
        const deleteItemModal = new bootstrap.Modal(document.getElementById("deleteItemModal"));
        let currentItemId = null;

        this.articleView.contextMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "detelete-item-button" || ev.target.id == "delete-item-icon"){
                console.log("'Item löschen' geklickt");

                currentItemId = ev.target.dataset.id;
                const item = model.getItemById(currentItemId);

                // checken, ob Item noch verwendet wird
                const isItemUsed = Array.from(model.lists.values()).some(list =>
                    list.items.some(entry => entry.item.id == currentItemId)
                );

                if (isItemUsed) {
                    alert(`Der Artikel "${item.name}" kann nicht gelöscht werden, weil er in einer oder mehreren Listen verwendet wird.`);
                    return;
                }
                // Sicherheitsabfrage
                document.getElementById("deleteItemModalLabel").textContent = `Item "${item.name}" löschen?`;
                deleteItemModal.show();

            }

        });

        document.getElementById("confirmDeleteItem").addEventListener("click", () => {
            if (currentItemId) {
                model.deleteItem(currentItemId);
                deleteItemModal.hide();
            }
        });
    }


    // Event-Listener für "Änderungen speichern" in "Artikel bearbeiten"
    addSaveEditedItemEventListener() {
        this.articleView.contextMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "save-edited-item-button" || ev.target.id == "save-edited-item-icon"){
                console.log("'Änderungen speichern' geklickt");

                let itemId = ev.target.dataset.id;

                // Werte aus den Eingabefeldern auslesen
                const symbol = document.querySelector("#edit-item-symbol").value;
                const name = document.querySelector("#edit-item-name").value.trim();

                // Validierung: Name darf nicht leer sein
                if (!name) {
                    console.error("Der Tagname darf nicht leer sein!");
                    return;
                }

                console.log("Änderungen für Item:", itemId, symbol, name);

                model.updateItem(this.activeListId, itemId, symbol, name);
            }

        });
    }

    // Event-Listener fürs "Artikel bearbeiten" schließen
    addCloseEditItemEventListener() {
        this.articleView.contextMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "close-context-menu-item" || ev.target.id == "close-context-menu-item-icon"){
                console.log("'Artikel bearbeiten'-Schließen geklickt");

                this.articleView.closeEditItemMenu();
            }

        });
    }

    // Event-Listener fürs "Tag hinzufügen" in "Artikel bearbeiten"
    addAddNewTagToItemEventListener(){
        this.articleView.contextMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "add-custom-new-tag"){
                console.log("'Tag hinzufügen' geklickt");

                // Wert aus dem Eingabefeld auslesen
                const name = document.querySelector("#custom-new-tag").value.trim();

                // Validierung: Name darf nicht leer sein
                if (!name) {
                    console.error("Der Tagname darf nicht leer sein!");
                    return;
                }

                console.log("Neuer Tag:", name);

                model.createNewTagInEditItem(name);
            }

        });
    }

    // Event-Listener fürs "Neuer Tag" in "Artikel bearbeiten"
    addAddTagToItemEventListener() {
        this.articleView.contextMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "add-new-tag-button" || ev.target.id == "add-new-tag-icon"){
                console.log("'Neuer Tag' geklickt");

                this.articleView.renderNewTagInput();
            }

        });
    }

    // Event-Listener fürs endgültige Löschen von Tags
    addDeleteTagEventListener() {
        const deleteTagModal = new bootstrap.Modal(document.getElementById("deleteTagModal"));
        let currentTagId = null;

        document.querySelector("#filter-tags-container").addEventListener("click", (ev) => {
            if(ev.target.id == "delete-tag-button" || ev.target.id == "delete-tag-icon"){
                console.log("'Tag löschen' geklickt");

                currentTagId = ev.target.dataset.tagId;
                const tag = model.getTagById(currentTagId);

                // checken, ob Tag noch verwendet wird
                if(tag.itemIds.size > 0) {
                    alert(`Der Tag "${tag.name}" kann nicht gelöscht werden, weil er in einer oder mehreren Listen verwendet wird.`);
                    return;
                }
                // Sicherheitsabfrage
                document.getElementById("deleteTagModalLabel").textContent = `Tag "${tag.name}" löschen?`;
                deleteTagModal.show();

            }

        });

        document.getElementById("confirmDeleteTag").addEventListener("click", () => {
            if (currentTagId) {
                model.deleteTag(currentTagId);
                deleteTagModal.hide();
            }
        });
    }

    addRemoveTagFromItemEventListener() {
        this.articleView.contextMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "remove-tag-button" || ev.target.id == "remove-tag-icon"){
                console.log("'Tag entfernen' geklickt");

                const tagId = ev.target.dataset.tagId;
                const itemId = ev.target.dataset.itemId;
                const tag = model.getTagById(tagId);
                const item = model.getItemById(itemId);

                model.removeTagFromItem(tag, item);
            }

        });
    }

    addEditItemEventListener() {
        this.articleView.allItemsContainer.addEventListener("click", (ev) => {
            if(ev.target.id == "edit-item-button" || ev.target.id == "edit-item-icon"){
                console.log("'Artikel bearbeiten' geklickt");

                const itemId = ev.target.dataset.id;
                const item = model.getItemById(itemId);

                // Zeige das Bearbeitungsmenü an
                this.articleView.renderEditItemMenu(item);
            }

        });
    }

    // Event-Delegation für den "Tag erstellen"-Button
    addNewTagEventListener() {
        this.articleView.newArticleMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "add-custom-tag"){
                console.log("'Tag erstellen' geklickt");
                // Werte aus den Eingabefeldern auslesen
                const name = document.querySelector("#custom-tag").value.trim();

                // Validierung: Name darf nicht leer sein
                if (!name) {
                    console.error("Der Tagname darf nicht leer sein!");
                    return;
                }

                console.log("Neuer Tag:", name);

                model.createNewTagInNewItem(name);
            }

        });
    }

    // Event-Delegation für den "Artikel erstellen"-Button
    addSaveNewItemEventListener() {
        this.articleView.newArticleMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "save-new-item-button" || ev.target.id == "save-new-item-icon"){
                console.log("'Artikel erstellen' geklickt");
                // Werte aus den Eingabefeldern auslesen
                const symbol = document.querySelector("#new-item-symbol").value.trim();
                const name = document.querySelector("#new-item-name").value.trim();
                const tagIds = [...document.querySelectorAll("#tag-checkboxes input:checked")].map(tag => tag.value);
                const tags = tagIds.map(tagId => model.getTagById(tagId));

                // Validierung: Name darf nicht leer sein
                if (!name) {
                    console.error("Der Artikelname darf nicht leer sein!");
                    return;
                }

                console.log("Neuer Artikel:", { symbol, name, tags });

                model.createNewItem({ symbol, name, tags });

                // Ansicht schließen
                this.articleView.closeNewItemMenuOnly();
            }

        });
    }

    // Event-Listener für "Neuer Artikel"-Ansicht schließen
    addCloseNewArticleEventListener() {
        this.articleView.newArticleMenu.addEventListener("click", (ev) => {
            if(ev.target.id == "close-context-menu-new-item" || ev.target.id == "close-context-menu-new-icon"){
                console.log("'Neuer Artikel - Schließen' geklickt");
                this.articleView.closeNewItemMenu();
            }
        });

    }

    // Event-Listener für "Neuer Artikel"-Button
    addNewArticleButtonEventListener() {
        this.articleView.newArticleButton.addEventListener("click", () => {
            console.log("Auf 'Neuer Artikel' geklickt", this.activeListId);
            this.articleView.closeAddItemMenu();
            this.articleView.renderNewItemMenu(model.tags);
        });
    }

    // Event-Listener für "Filtern"- bzw. "Filter anwenden"-Button
    addFilterButtonEventListener() {
        document.querySelector("#filter-button").addEventListener("click", () => {
            this.articleView.renderFilterTags(model.tags);
            let filterModal = new bootstrap.Modal(document.getElementById("filterModal"));
            filterModal.show();
        });

        document.querySelector("#apply-filter").addEventListener("click", () => {
            // Filter anwenden
            this.articleView.applyTagFilter(model, this.activeListId);
        });
    }


    // Event-Listener zur Bestätigung der Mengeneingabe eines Artikels
    addSubmitQuantityListener(){
        this.articleView.quantityInputContainer.addEventListener("click", (ev) => {
            if(ev.target.id == "submit-item-quantity" || ev.target.id == "submit-item-quantity-icon"){
                console.log("Mengeneingabe bestätigt");

                const inputField = document.querySelector("#quantity-input");
                if (!inputField) return;

                let quantity = inputField.value;
                if (!quantity) return;
                console.log(quantity);

                let itemId = ev.target.dataset.id;
                const item = model.getItemById(itemId);
                console.log(item);

                const list = model.getListById(this.activeListId); // derzeit aktive Liste holen
                if (!list) {
                    console.error("Keine aktive Liste gefunden!");
                    return;
                }
                console.log(list);

                // Item in angegebener Menge der Liste hinzufügen
                model.addItemToList(list, item, quantity);

            }
        });
    }

    // Event-Listener zur Auswahl eines Artikels
    addItemEventListener() {
        this.articleView.allItemsContainer.addEventListener("click", (ev) => {
            // Wenn der Klick auf den Edit-Button erfolgt, nicht weiter verarbeiten
            if (ev.target.closest('#edit-item-button')) {
                return;
            }

            console.log("Bestehende Artikel angeklickt");
            let itemId = ev.target.dataset.id;
            const item = model.getItemById(itemId);
            this.articleView.renderQuantityInput(item);
        });
    }

    // Event-Listener für "Artikel hinzufügen"-Ansicht schließen
    addCloseAddItemEventListener() {
        this.articleView.closeButton.addEventListener("click", (ev) => {
            this.articleView.closeAddItemMenu();
        });
    }

    // Event-Delegation für den "Artikel hinzufügen"-Button
    addAddItemEventListener() {
        this.listDetailView.addItemButtonContainer.addEventListener("click", (ev) => {
            if (ev.target.id == "open-context-menu-add-item" || ev.target.id == "open-context-menu-add-item-icon") {
                this.activeListId = ev.target.dataset.id;  // Speichere die aktive ListID
                const listId = ev.target.dataset.id;
                console.log("'Artikel hinzufügen'-Button für Liste geklickt, ListID:", listId);

                const list = model.getListById(listId);
                this.articleView.renderAddItem(model.items);
            }
        });
    }

    // Event-Delegation für den "Abschließen"-Button
    addCompleteListEventListener() {
        this.listDetailView.completeListContainer.addEventListener("click", (ev) => {
            if (ev.target.id == "complete-list-button") {
                const listId = ev.target.dataset.id;
                console.log("'Abschließen'-Button für Liste geklickt, ListID:", listId);

                const activeList = model.getListById(listId);
                if (activeList) {
                    model.completeList(listId);
                    if(activeList.completed) {
                        const activeListItem = document.querySelector(".listdetails")
                        activeListItem.classList.add("completed-animation");
                        // Nach der Animation Klasse wieder entfernen (damit man es nochmal auslösen kann)
                        setTimeout(() => {
                            activeListItem.classList.remove("completed-animation");
                        }, 1000);
                    }
                }



            }


        });
    }

    // Event-Delegation für den "Aktivieren"-Button
    addActivateListEventListener() {
        this.listDetailView.completeListContainer.addEventListener("click", (ev) => {
            if (ev.target.id == "activate-list-button") {
                const listId = ev.target.dataset.id;
                console.log("'Aktivieren'-Button für Liste geklickt, ListID:", listId);

                const activeList = model.getListById(listId);
                if (activeList) {
                    model.uncompleteList(listId);
                    // Liste in der ListView als aktiv markieren
                    const listItem = this.listView.listsContainer.querySelector(`li[data-id="${listId}"]`);
                    if (listItem) {
                        this.#setActiveList(listItem);
                    }
                }
            }
        });
    }

    // Event-Delegation für den Item-enfernen-Button
    addRemoveItemEventListener() {
        this.listDetailView.itemsContainer.addEventListener('click', (ev) => {
            if (ev.target.id == 'remove-item-button' || ev.target.id == 'remove-item-icon') {
                const itemId = ev.target.closest('li').dataset.id;  // ID des Items aus `data-id` Attribut extrahieren
                console.log("Item aus Liste entfernen geklickt, itemId:", itemId);
                const activeList = model.getListById(this.activeListId);
                if (activeList) {
                    model.removeItemFromList(this.activeListId, itemId); // Item von der Liste entfernen
                }
            }
        });
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
                    //this.listDetailView.render(activeList);
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

