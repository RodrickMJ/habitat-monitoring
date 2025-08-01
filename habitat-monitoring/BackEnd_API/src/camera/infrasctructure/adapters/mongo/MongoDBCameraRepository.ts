import { CameraRepository } from "../../../domain/CameraRepository";
import { dbMongo } from "../../../../database/mongo/mongodb";
import { ObjectId } from "mongodb";

export class MongoDBCameraRepository implements CameraRepository {
    private isCameraOn: boolean = false;

    async on(): Promise<void> {
        this.isCameraOn = true;

        const cameraCollection = dbMongo.collection('cameras');
        await cameraCollection.updateOne(
            { _id: new ObjectId("60d5ec49f0c9b15de4c88c8b") }, 
            { $set: { isCameraOn: this.isCameraOn } },
            { upsert: true }
        );

        console.log('Camera is turned on.');
    }

    async off(): Promise<void> {
        this.isCameraOn = false;

        const cameraCollection = dbMongo.collection('cameras');
        await cameraCollection.updateOne(
            { _id: new ObjectId("60d5ec49f0c9b15de4c88c8b") }, 
            { $set: { isCameraOn: this.isCameraOn } },
            { upsert: true }
        );

        console.log('Camera is turned off.');
    }
}
