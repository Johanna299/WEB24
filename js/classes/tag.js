export default class Tag {
    static id = 5;
    constructor(name) {
        this.id = ++Tag.id;
        this.name = name;
    }
}