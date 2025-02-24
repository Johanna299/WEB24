export class ListDetailView {
    constructor() {
        this.listNameContainer = document.querySelector('.listdetails h3');
        this.itemsContainer = document.querySelector('#shopping-list');
        this.addItemButton = document.querySelector('#open-context-menu-add-item');
        this.checkboxes = this.itemsContainer.querySelectorAll('.form-check-input');
    }

    render(list) {
        // Listenname
        this.listNameContainer.innerHTML = `
        ${list.name}
        <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil-fill"></i>️</button>
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

    #getHTML(item, quantity) {
        return `
        <li class="list-group-item d-flex justify-content-between align-items-center open-context-menu-item">
            <div>
                <input class="form-check-input me-2 item-checkbox" type="checkbox">
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
