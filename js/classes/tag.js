export default class Tag {
    static id = 0; // für fortlaufende id
    itemIds = new Set();

    constructor(id, name) {
        // Falls ID angegeben ist, nutze sie (z.B. für initdata.json), sonst erhöhe die static id
        this.id = id ?? ++Tag.id;
        this.name = name;
    }
}