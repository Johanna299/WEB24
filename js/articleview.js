export class ArticleView {
    constructor() {
        // "Artikel hinzufügen"-Ansicht
        this.contextMenu = document.querySelector('#context-menu-add-item');
        this.allItemsContainer = document.querySelector('.list-group.allitems');
        this.detailView = document.querySelector('.content');
        this.closeButton = document.querySelector('#close-context-menu-add-item');
        this.quantityInputContainer = document.querySelector('#quantity-input-container');


        // Einzelansicht eines Artikels
        this.editButton = document.querySelector('#edit-item');
        this.saveButton = document.querySelector('#save-item');
        this.itemNameText = document.querySelector('#item-name-text');
        this.itemNameInput = document.querySelector('#item-name-input');
        this.itemDescription = document.querySelector('#item-description');
        this.tagContainer = document.querySelector('#tag-container');

        // fürs Filtern
        this.filterTagsContainer = document.querySelector("#filter-tags-container");
    }

    renderAddItem(list, allItems) {
        // Detailansicht verkleinern
        this.detailView.classList.remove('col-md-9');
        this.detailView.classList.add('col-md-6');

        this.contextMenu.classList.remove('d-none');

        // bestehende Artikel rendern
        this.allItemsContainer.innerHTML = ""; // vorherige Inhalte entfernen

        allItems.forEach((item) => {
            let itemHtml = `
            <li class="list-group-item d-flex justify-content-between align-items-center open-context-menu-item" data-id="${item.id}">
            ${item.symbol} ${item.name}
                <button class="btn btn-sm btn-outline-secondary" id="edit-item-button">
                    <i class="bi bi-pencil-fill" id="edit-item-icon"></i>️
                </button>
            </li>
            `;

            this.allItemsContainer.insertAdjacentHTML("beforeend", itemHtml);
        });

        console.log("Artikel-Auswahl gerendert:", allItems);
    }

    // "Artikel hinzufügen"-Ansicht schließen
    closeAddItemMenu() {
        // Detailansicht vergrößern
        this.detailView.classList.remove('col-md-6');
        this.detailView.classList.add('col-md-9');

        this.contextMenu.classList.add('d-none');
    }

    renderQuantityInput(item){
        this.quantityInputContainer.innerHTML = `
        <input type="number" id="quantity-input" class="form-control form-control-sm w-25" min="1" value="1"> ${item.symbol} ${item.name}
        <button class="btn btn-primary" id="submit-item-quantity" data-id="${item.id}">
            <i class="bi bi-check-lg" id="submit-item-quantity-icon" data-id="${item.id}"></i>
        </button>
        `;
    }

    // Tags im Filter-Modal rendern
    renderFilterTags(tags) {
        this.filterTagsContainer.innerHTML = ""; // vorherige Inhalte entfernen

        tags.forEach(tag => {
            let tagElement = document.createElement("div");
            tagElement.classList.add("form-check");

            tagElement.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${tag.id}" id="tag-${tag.id}">
            <label class="form-check-label" for="tag-${tag.id}">
                ${tag.name}
            </label>
        `;

            this.filterTagsContainer.appendChild(tagElement);
        });
    }

    applyTagFilter(model, listId) {
        let selectedTagsID = Array.from(document.querySelectorAll("#filter-tags-container input:checked"))
            .map(input => Number(input.value));

        // TODO für jede selectedTagsID muss das gemacht werden.
        // hole die Tag-Objekte anhand der Tag-IDs
        /*let selectedTags = selectedTagsID.map(id => model.getTagById(id));*/
        console.log("Ausgewählte Tags:", selectedTagsID);

        // Filter anwenden mit nur den Tag-IDs
        let filteredItems = model.getFilteredItemsByTags(selectedTagsID);

        console.log("Gefilterte Artikel:", filteredItems);


        this.renderAddItem(model.getListById(listId), filteredItems);
    }

}
