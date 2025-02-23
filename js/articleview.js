export class ArticleView {
    constructor() {
        this.contextMenu = document.querySelector('#context-menu-item');
        this.editButton = document.querySelector('#edit-item');
        this.saveButton = document.querySelector('#save-item');
        this.itemNameText = document.querySelector('#item-name-text');
        this.itemNameInput = document.querySelector('#item-name-input');
        this.itemDescription = document.querySelector('#item-description');
        this.tagContainer = document.querySelector('#tag-container');
    }

    render(item) {
        this.contextMenu.classList.remove('d-none');
        this.itemNameText.textContent = item.name;
        this.itemNameInput.value = item.name;
        this.itemDescription.value = item.description;

        // Tags rendern
        this.tagContainer.innerHTML = '';
        item.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('badge', 'bg-secondary', 'tag');
            tagElement.textContent = tag;
            this.tagContainer.appendChild(tagElement);
        });
    }

    bindEditItem(handler) {
        this.editButton.addEventListener('click', () => {
            this.itemNameText.classList.add('d-none');
            this.itemNameInput.classList.remove('d-none');
            this.saveButton.classList.remove('d-none');
        });
    }

    bindSaveItem(handler) {
        this.saveButton.addEventListener('click', () => {
            const updatedItem = {
                name: this.itemNameInput.value,
                description: this.itemDescription.value,
                tags: [...this.tagContainer.querySelectorAll('.tag')].map(tag => tag.textContent),
            };
            handler(updatedItem);
            this.contextMenu.classList.add('d-none');
        });
    }

    hideContextMenu() {
        this.contextMenu.classList.add('d-none');
    }
}
