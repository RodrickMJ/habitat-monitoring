import { dbMongo } from "../../../../database/mongo/mongodb";
import { User } from "../../../domain/User";
import { UserRepository } from "../../../domain/UserRepository";
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

export class MongodbUserRepository implements UserRepository {
    async register(user: User): Promise<void> {
        const userCollection = dbMongo.collection('users');
        await userCollection.insertOne(user);
    }

    async login(email: string, password: string): Promise<User | null> {
        const userCollection = dbMongo.collection('users');
        const user = await userCollection.findOne({ email });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                return new User(user._id.toString(), user.name, user.lastname, user.email, user.password, user.animals, user.token);
            }
        }
        
        return null;
    }

    async getAllUsers(): Promise<User[]> {
        const userCollection = dbMongo.collection('users');
        const users = await userCollection.find().toArray();
        return users.map(user => new User(
            user._id.toString(),
            user.name,
            user.lastname,
            user.email,
            user.password,
            user.animals,
            user.token
        ));
    }

    async logout(token: string): Promise<void> {
        const userCollection = dbMongo.collection('users');
        await userCollection.updateOne(
            { token }, 
            { $set: { token: null } }
        );
    }

    async updateToken(id: string, token: string | null): Promise<void> {
        const userCollection = dbMongo.collection('users');
        await userCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { token } }
        );
    }

    async getById(id: string): Promise<User | null> {
        const userCollection = dbMongo.collection('users');
        const user = await userCollection.findOne({ _id: new ObjectId(id) });

        if (user) {
            return new User(
                user._id.toString(),
                user.name,
                user.lastname,
                user.email,
                user.password,
                user.animals,
                user.token
            );
        }

        return null;
    }
}
