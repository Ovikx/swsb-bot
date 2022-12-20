/* const { MongoClient, ServerApiVersion } = require('mongodb'); */
import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri: string = process.env.DB_URI ?? '';

class DBHandler {
    client: MongoClient;

    constructor() {
        this.client = new MongoClient(uri);
        console.log('Connected to DB');
    }
}

export const DB = new DBHandler();