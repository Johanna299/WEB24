export class ListDetailView {
    constructor() {
        this.listNameContainer = document.querySelector('.listdetails h3');
        this.itemsContainer = document.querySelector('#shopping-list');
        this.addItemButton = document.querySelector('#open-context-menu-add-item');
        this.checkboxes = this.itemsContainer.querySelectorAll('.form-check-input');
    }

    render(list) {
        // Liste und ihre Artikel rendern
        this.listNameContainer.querySelector('span').textContent = list.name;
        this.itemsContainer.innerHTML = ''; // Vorherige Items löschen
        list.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = `
                <div>
                    <input class="form-check-input me-2" type="checkbox" data-id="${item.id}">
                    <span>${item.name}</span>
                </div>
                <button class="btn btn-danger btn-sm" data-id="${item.id}"><i class="bi bi-x-lg"></i></button>
            `;
            this.itemsContainer.appendChild(listItem);
        });

        this.addItemButton.classList.remove('d-none');
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
