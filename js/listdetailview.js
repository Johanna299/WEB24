export class ListDetailView {
    constructor() {
        this.listNameContainer = document.querySelector('#list-name-container');
        this.completeListContainer = document.querySelector('#complete-list-container');
        this.itemsContainer = document.querySelector('#shopping-list');
        this.addItemButtonContainer = document.querySelector('.add-item-list-container');
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

        // "Abschließen"- oder "Aktivieren"-Button
        const buttonLabel = list.completed ? "Aktivieren" : "Abschließen";
        const buttonClass = list.completed ? "btn-warning" : "btn-success com";
        this.completeListContainer.innerHTML = `
        <button class="btn ${buttonClass}" id="${list.completed ? 'activate-list-button' : 'complete-list-button'}" data-id="${list.id}">${buttonLabel}</button>
        `;

        this.itemsContainer.innerHTML = ""; // vorherige Inhalte löschen
        // jeden Artikel rendern
        list.items.forEach(item => {
            console.log("listdetailview: ", item.item?.symbol, item.item?.name);
            let html = this.#getHTML(item.item, item.quantity, item.isChecked, list.completed);
            this.itemsContainer.insertAdjacentHTML("beforeend", html);
        });

        this.addItemButtonContainer.innerHTML = `
        <button class="btn btn-primary w-100 mt-3" id="open-context-menu-add-item" data-id="${list.id}">
            <i class="bi bi-plus-lg" id="open-context-menu-add-item-icon"></i> Artikel hinzufügen
        </button>
        `;

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

    #getHTML(item, quantity, isChecked, isCompleted) {
        return `
        <li class="list-group-item d-flex justify-content-between align-items-center open-context-menu-item" data-id=${item.id}>
            <div>
                <input class="form-check-input me-2 item-checkbox" type="checkbox" id="checkbox-item" ${isChecked ? 'checked' : ''} ${isCompleted ? 'disabled' : ''}>
                <span class="item-text"">${item.symbol} ${quantity} ${item.name}</span>
            </div>
            <button class="btn btn-danger btn-sm" id="remove-item-button" data-id=${item.id}><i class="bi bi-x-lg" id="remove-item-icon"></i></button>
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
