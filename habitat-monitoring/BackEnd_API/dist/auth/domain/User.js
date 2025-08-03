"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, lastname, email, password, animals = [], token = null) {
        this.animals = [];
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.animals = animals;
        this.token = token;
    }
}
exports.User = User;
