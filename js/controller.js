import { model } from "./model.js";
import { ListView } from "./listview.js";

class Controller {
    constructor(){
        this.listView = new ListView();

        // Subscribe to the model
        model.subscribe("dataLoaded", this, this.onDataLoaded); //TODO
        model.subscribe("addList",this.listView,this.listView.addList);
    }

    init(){
        // Event-Listener für "Liste hinzufügen"-Button
        this.listView.addListButton.addEventListener('click', () => {
            console.log("'Liste hinzufügen' geklickt");
            this.listView.renderAddListInput();  // Eingabefeld anzeigen
        });

        // Event-Listener für Eltern-Container, der den dynamischen Submit-Button für neue Listen enthält
        this.addSubmitEventListener();
    }

    // Event-Delegation: Event-Listener wird auf den Eltern-Container vom Submit-Button für neue Listen gesetzt
    addSubmitEventListener() {
        this.listView.addListButtonContainer.addEventListener('click', (ev) => {
            if (ev.target && (ev.target.id == 'submit-list-name') || (ev.target.id == 'submit-list-name-icon')) {
                console.log("Submit in Listenansicht geklickt");
                const listName = document.querySelector('#new-list-name').value;
                if(listName) {
                    model.addList(listName); // dem Model eine neue Liste hinzufügen
                }
            }
        });
    }

    // sobald JSON Daten geladen wurden, alle Views aktualisieren
    onDataLoaded(data) {
        console.log("Controller: JSON-Daten wurden geladen", data);

        // Alle Views aktualisieren
        this.listView.render(data.lists);
        // TODO DetailView und ArticleView aktualisieren, zuvor detailView und articleView importieren!
    }
}

export const controller = new Controller();

