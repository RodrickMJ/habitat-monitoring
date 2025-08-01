export class Animal {
    public id: string;
    public name: string;
    public breed: string;
    public species: string;
    public age: number;
    public gender: string;
    public color: string;
    public size: string;
    public ownerId: string;
    public notes: string;

    constructor(id: string, name: string, breed: string, species: string, age: number, gender: string, color: string, size: string, ownerId: string, notes: string) {
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
