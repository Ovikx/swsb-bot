/* const { MongoClient, ServerApiVersion } = require('mongodb'); */
import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { Squadron } from '../utils/types/types';
dotenv.config();

const uri: string = process.env.DB_URI ?? '';

class DBHandler {
    client: MongoClient;
    squadronsCol: Collection<Squadron>;

    constructor() {
        this.client = new MongoClient(uri);
        console.log('Connected to DB');
        this.squadronsCol = this.client.db('swsb').collection('squadrons');
    }

    /**
     * Checks if the squadron already exists
     * @param leaderRole Leader role ID
     * @param memberRole Member role ID
     */
    async squadronExists(leaderRole: string, memberRole: string): Promise<boolean> {
        const leaderDoc = await this.squadronsCol.findOne({leaderRole: leaderRole});
        const memberDoc = await this.squadronsCol.findOne({memberRole: memberRole});
        const crossLeaderDoc = await this.squadronsCol.findOne({leaderRole: memberRole});
        const crossMemberDoc = await this.squadronsCol.findOne({memberRole: leaderRole});
        return leaderDoc != null || memberDoc != null || crossLeaderDoc != null || crossMemberDoc != null;
    }

    /**
     * Registers the squadron's leader and member roles
     * @param leaderRole Leader role ID
     * @param memberRole Member role ID
     */
    async registerSquadron(leaderRole: string, memberRole: string) {
        const squadron: Squadron = {
            leaderRole,
            memberRole
        }
        await this.squadronsCol.insertOne(squadron);
    }

    /**
     * Gets an array of all the squadron leader roles
     * @returns Array of leader roles
     */
    async getLeaderRoles(): Promise<string[]> {
        const squadrons = await this.squadronsCol.find({}).toArray();
        let res: string[] = [];
        for (const squadron of squadrons) {
            res.push(squadron.leaderRole);
        }

        return res;
    }

    /**
     * Returns the squadron with the matching leader role
     * @param leaderRole Leader role ID
     * @returns Squadron
     */
    async getSquadron(leaderRole: string): Promise<Squadron | null> {
        const squadron = await this.squadronsCol.findOne({leaderRole: leaderRole});
        if (!squadron) {
            return null;
        }
        
        return squadron;
    }
}

export const DB = new DBHandler();