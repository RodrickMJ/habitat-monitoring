import { CameraRepository } from "../../../domain/CameraRepository";
import { testConnection } from "../../../../database/mysql/mysqldb";

export class MysqlCameraRepository implements CameraRepository {
    async on(): Promise<void> {
        const connection = await testConnection();
        const sql = 'UPDATE cameras SET isCameraOn = ? WHERE id = ?';
        await connection.execute(sql, [true, 1]); 
        console.log('Camera is turned on.');
    }

    async off(): Promise<void> {
        const connection = await testConnection();
        const sql = 'UPDATE cameras SET isCameraOn = ? WHERE id = ?';
        await connection.execute(sql, [false, 1]); 
        console.log('Camera is turned off.');
    }
}
