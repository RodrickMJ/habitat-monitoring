import { Animal } from '../../animal/domain/Animal';

export class User {
    public id: string; 
    public name: string;
    public lastname: string;
    public email: string;
    public password: string;
    public animals: Animal[] = [];
    public token : string | null;

    public constructor(id: string, name: string, lastname: string, email: string, password: string, animals: Animal[] = [], token: string | null = null) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.animals = animals;
        this.token = token
    }
}
