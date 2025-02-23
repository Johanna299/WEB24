export class ListView {
    constructor() {
        this.listsContainer = document.querySelector('.lists .list-group');
        this.addListButton = document.querySelector('#add-list-button');
    }

    addList(list) {
        let html = this.#getHTML(list);
        this.listsContainer.insertAdjacentHTML("beforeend", html);
    }

    #getHTML(list) {
        return `<li class="list-group-item list-${list.id}">${list.name}</li>`
    }
}
