export class ListDetailView {
    constructor() {
        this.listNameContainer = document.querySelector('#list-name-container');
        this.itemsContainer = document.querySelector('#shopping-list');
        this.addItemButton = document.querySelector('#open-context-menu-add-item');
        this.checkboxes = this.itemsContainer.querySelectorAll('.form-check-input');
    }

    render(list) {
        // Listenname
        this.listNameContainer.innerHTML = `
        <h3>${list.name} 
            <button class="btn btn-sm btn-outline-secondary" id="edit-list-name">
                <i class="bi bi-pencil-fill" id="edit-list-name-icon"></i>
            </button>
        </h3>
        `;

        this.itemsContainer.innerHTML = ""; // vorherige Inhalte löschen
        // jeden Artikel rendern
        list.items.forEach(item => {
            console.log("listdetailview: ", item.item?.symbol, item.item?.name);
            let html = this.#getHTML(item.item, item.quantity);
            this.itemsContainer.insertAdjacentHTML("beforeend", html);
        });

        // TODO mit class d-none arbeiten? für Kontextmenüs

    }

    // rendert Eingabefeld, um den Listennamen zu ändern
    renderEditListNameInput(list) {
        // HTML für das Eingabefeld und den Speichern-Button
        let htmlinput = `
        <div class="d-flex">
            <input type="text" id="edit-list-name-input" class="form-control me-2" value="${list.name}">
            <button class="btn btn-primary" id="save-list-name">
                <i class="bi bi-check-lg" id="save-list-name-icon"></i>
            </button>
        </div>
        `;

        // ersetze den Listennamen durch das Eingabefeld
        this.listNameContainer.innerHTML = htmlinput;
    }

    #getHTML(item, quantity) {
        return `
        <li class="list-group-item d-flex justify-content-between align-items-center open-context-menu-item" data-id=${item.id}>
            <div>
                <input class="form-check-input me-2 item-checkbox" type="checkbox" id="checkbox-item">
                <span class="item-text"">${item.symbol} ${quantity} ${item.name}</span>
            </div>
            <button class="btn btn-danger btn-sm"><i class="bi bi-x-lg"></i></button>
        </li>
        `;
    }

    bindItemSelection(handler) {
        this.itemsContainer.addEventListener('click', (event) => {
            if (event.target.matches('.btn-danger')) {
                const itemId = event.target.dataset.id;
                handler(itemId);
            }
        });
    }

    bindAddItem(handler) {
        this.addItemButton.addEventListener('click', handler);
    }
}
