/* const { MongoClient, ServerApiVersion } = require('mongodb'); */
import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri: string = process.env.DB_URI ?? '';

class DBHandler {
    client: MongoClient;
    squadronsCol: Collection;

    constructor() {
        this.client = new MongoClient(uri);
        console.log('Connected to DB');
        this.squadronsCol = this.client.db('swsb').collection('squadrons');
    }
}

export const DB = new DBHandler();