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
}
