export class ListView {
    constructor() {
        this.listsContainer = document.querySelector('.lists .list-group');
        this.addListButton = document.querySelector('#add-list-button');
        this.addListButtonContainer = document.querySelector('.add-list-button-container');
    }

    // rendert ALLE Listen, z.B. beim ersten Laden der Seite
    render(lists) {
        this.listsContainer.innerHTML = ""; // vorherige Inhalte löschen
        lists.forEach(list => this.addList(list));
    }

    // fügt eine einzelne Liste hinzu (z.B. durch User-Eingabe oder initiales Laden)
    addList(list) {
        let html = this.#getHTML(list);
        this.listsContainer.insertAdjacentHTML("beforeend", html);
    }

    // rendert Button "Liste hinzufügen"
    renderAddListButton() {
        const html = `
            <button class="btn btn-primary w-100 mt-3" id="add-list-button"><i class="bi bi-plus-lg"></i> Liste hinzufügen</button>
        `;

        // Ersetze den Button durch das Eingabefeld
        this.addListButtonContainer.innerHTML = html;

        // Neuem Button den Event-Listener hinzufügen
        document.querySelector("#add-list-button").addEventListener('click', () => {
            this.renderAddListInput();
        });
    }

    // rendert Eingabefeld für "Liste hinzufügen"
    renderAddListInput() {
        const html = `
            <div class="d-flex">
                <input type="text" id="new-list-name" class="form-control me-2" placeholder="Name der Liste">
                <button class="btn btn-primary" id="submit-list-name">
                    <i class="bi bi-check-lg" id="submit-list-name-icon"></i>
                </button>
            </div>
        `;
        // ersetze den Button durch das Eingabefeld
        this.addListButtonContainer.innerHTML = html;
    }

    // generiert HTML für ein Element der Listenansicht
    #getHTML(list) {
        return `<li class="list-group-item list-${list.id}" data-id="${list.id}">${list.name}</li>`;
    }
}
