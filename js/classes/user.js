export default class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Gibt die vollständigen Benutzerdaten als Objekt zurück
    getUserData() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }

    // Setzt den Namen des Benutzers
    setName(newName) {
        this.name = newName;
    }

    // Setzt die E-Mail des Benutzers
    setEmail(newEmail) {
        this.email = newEmail;
    }

    // Erzeugt eine kurze Darstellung des Benutzers für eine Anzeige
    getUserSummary() {
        return `${this.name} (${this.email})`;
    }
}
