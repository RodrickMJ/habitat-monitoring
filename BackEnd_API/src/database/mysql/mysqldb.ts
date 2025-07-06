import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise';

dotenv.config();

const config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
};

const pool = mysql2.createPool(config);

export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        connection.release(); 
        return connection;
    } catch (error) {
        console.error(error);
        throw error;  
    }
}
