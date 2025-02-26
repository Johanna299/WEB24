export class ArticleView {
    constructor() {
        // "Artikel hinzufügen"-Ansicht
        this.contextMenu = document.querySelector('#context-menu-add-item');
        this.allItemsContainer = document.querySelector('.list-group.allitems');
        this.detailView = document.querySelector('.content');
        this.closeButton = document.querySelector('#close-context-menu-add-item');
        this.quantityInputContainer = document.querySelector('#quantity-input-container');

        // "Neuer Artikel"-Ansicht
        this.newArticleButton = document.querySelector('#new-article');
        this.newArticleMenu = document.querySelector('#context-menu-new-item');


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

    renderAddItem(allItems) {
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

    renderNewItemMenu(tags) {
        this.detailView.classList.remove('col-md-9');
        this.detailView.classList.add('col-md-6');

        this.newArticleMenu.classList.remove('d-none');
        this.newArticleMenu.innerHTML = "";

        let menuHtml = `
        <div class="d-flex justify-content-between align-items-center">
            <h5>Neuer Artikel</h5>
            <button class="btn btn-sm btn-outline-secondary" id="close-context-menu-new-item">
                <i class="bi bi-x-lg" id="close-context-menu-new-icon"></i>
            </button>
        </div>
            
            <label for="new-item-symbol">Symbol:</label>
            <input type="text" id="new-item-symbol" class="form-control mb-2" placeholder="🔹">
            
            <div class="mb-3">
          <label for="new-item-name" class="form-label">Artikelname:</label>
          <input type="text" id="new-item-name" class="form-control" placeholder="Artikel eingeben">
        </div>

        <div class="mb-3">
          <label class="form-label">Tags:</label>
          <div id="tag-checkboxes" class="form-check">
            ${Array.from(tags.values()).map(tag => `
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${tag.id}" id="tag-${tag.id}">
                <label class="form-check-label" for="tag-${tag.id}">${tag.name}</label>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="mb-3">
          <label for="custom-tag" class="form-label">Neuen Tag erstellen:</label>
          <div class="input-group">
            <input type="text" id="custom-tag" class="form-control" placeholder="Tagname">
            <button id="add-custom-tag" class="btn btn-primary">Tag erstellen</button>
          </div>
        </div>
            
        <button class="btn btn-primary w-100 mt-3" id="save-new-item-button">
            <i class="bi bi-check-lg" id="save-new-item-icon"></i> Artikel erstellen
        </button>
        `;

        this.newArticleMenu.insertAdjacentHTML("beforeend", menuHtml);
    }

    // schließt "Neuer Artikel"-Ansicht und vergrößert Detailansicht
    closeNewItemMenu() {
        this.detailView.classList.remove('col-md-6');
        this.detailView.classList.add('col-md-9');

        this.newArticleMenu.classList.add('d-none');
    }

    // schließt nur "Neuer Artikel"-Ansicht
    closeNewItemMenuOnly() {
        this.newArticleMenu.classList.add('d-none');
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

    // rendert neu erstellten Tag in die "Neuer Artikel"-Ansicht hinzu
    addNewTagToTagCheckboxes(tag) {
        const tagCheckboxesContainer = document.querySelector('#tag-checkboxes');
        const tagHtml = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${tag.id}" id="tag-${tag.id}">
                <label class="form-check-label" for="tag-${tag.id}">${tag.name}</label>
            </div>
        `;
        tagCheckboxesContainer.insertAdjacentHTML("beforeend", tagHtml);
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
