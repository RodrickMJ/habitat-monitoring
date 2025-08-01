import { User } from './User';

export interface UserRepository {
    register(user: User): Promise<void>;
    login(email: string, password: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    logout(token: string): Promise<void>;
    updateToken(id: string, token: string | null): Promise<void>;
    getById(id: string): Promise<User | null>;  
}
