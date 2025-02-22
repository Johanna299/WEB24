// Kontextmenü für "Artikel hinzufügen"
document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".content");
    const openAddBtn = document.getElementById("open-context-menu-add-item");
    const closeAddBtn = document.getElementById("close-context-menu-add-item");
    const contextAddMenu = document.getElementById("context-menu-add-item");

    openAddBtn.addEventListener("click", function () {
        contextAddMenu.classList.remove("d-none");
        content.classList.remove("col-md-9");
        content.classList.add("col-md-6");
    });

    closeAddBtn.addEventListener("click", function () {
        contextAddMenu.classList.add("d-none");
        content.classList.remove("col-md-6");
        content.classList.add("col-md-9");
    });
});

// Kontextmenü für Artikelansicht
document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".content");
    const openItems = document.querySelectorAll(".open-context-menu-item");
    const closeBtn = document.getElementById("close-context-menu-item");
    const contextItemMenu = document.getElementById("context-menu-item");

    openItems.forEach(item => {
        item.addEventListener("click", function (event) {
            contextItemMenu.classList.remove("d-none");
            content.classList.remove("col-md-9");
            content.classList.add("col-md-6");
        });
    });

    closeBtn.addEventListener("click", function () {
        contextItemMenu.classList.add("d-none");
        content.classList.remove("col-md-6");
        content.classList.add("col-md-9");
    });
});

//Bearbeitungsmodus in Artikelansicht
document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.getElementById("edit-item");
    const saveButton = document.getElementById("save-item");
    const itemNameText = document.getElementById("item-name-text");
    const itemNameInput = document.getElementById("item-name-input");
    const itemDescription = document.getElementById("item-description");
    const addTagButton = document.getElementById("add-tag");
    const tagContainer = document.getElementById("tag-container");

    editButton.addEventListener("click", function() {
        // Umschalten in den Bearbeitungsmodus
        itemNameText.classList.add("d-none");
        itemNameInput.classList.remove("d-none");
        itemNameInput.value = itemNameText.innerText; // Namen ins Input-Feld übernehmen
        editButton.classList.add("d-none"); // Editieren-Button ausblenden

        itemDescription.removeAttribute("disabled"); // Beschreibung editierbar machen
        addTagButton.classList.remove("d-none"); // Tag hinzufügen sichtbar machen
        saveButton.classList.remove("d-none"); // Speichern-Button anzeigen

        // X-Buttons für Tags anzeigen
        document.querySelectorAll(".tag-remove").forEach(btn => btn.classList.remove("d-none"));
    });

    saveButton.addEventListener("click", function() {
        // Änderungen übernehmen
        itemNameText.innerText = itemNameInput.value;
        itemNameText.classList.remove("d-none");
        itemNameInput.classList.add("d-none");
        editButton.classList.remove("d-none"); // Editieren-Button sichtbar machen

        itemDescription.setAttribute("disabled", "true"); // Beschreibung wieder sperren
        addTagButton.classList.add("d-none");
        saveButton.classList.add("d-none");

        // X-Buttons für Tags ausblenden
        document.querySelectorAll(".tag-remove").forEach(btn => btn.classList.add("d-none"));
    });

    // Event-Listener zum Entfernen von Tags
    tagContainer.addEventListener("click", function(event) {
        if (event.target.closest(".tag-remove")) {
            event.target.closest(".tag").remove();
        }
    });

    // Event zum Hinzufügen eines neuen Tags
    addTagButton.addEventListener("click", function() {
        const newTagName = prompt("Neuen Tag eingeben:");
        if (newTagName) {
            const newTag = document.createElement("span");
            newTag.classList.add("badge", "bg-secondary", "tag");
            newTag.innerHTML = `${newTagName} <button class="btn btn-danger btn-sm tag-remove"><i class="bi bi-x-lg"></i></button>`;
            tagContainer.insertBefore(newTag, addTagButton);
        }
    });
});
