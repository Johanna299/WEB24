import { model } from "./model.js";
import { ListView } from "./listview.js";

class Controller {
    constructor(){
        this.listView = new ListView();

        // Subscribe to the model
        //model.subscribe("dataLoaded, this."); //TODO notify im model, param passt nicht
        model.subscribe("addList",this.listView,this.listView.addList);
    }

    init(){
        document.querySelector('#add-list-button').onclick = (ev) =>{
            console.log("Liste hinzufügen geklickt");
        }
    }
}

export const controller = new Controller();

