"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
class Animal {
    constructor(id, name, breed, species, age, gender, color, size, ownerId, notes) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.species = species;
        this.age = age;
        this.gender = gender;
        this.color = color;
        this.size = size;
        this.ownerId = ownerId;
        this.notes = notes;
    }
}
exports.Animal = Animal;
