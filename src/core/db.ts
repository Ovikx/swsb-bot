/* const { MongoClient, ServerApiVersion } = require('mongodb'); */
import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { Squadron } from '../utils/types/types';
import Eris from 'eris';
dotenv.config();

const uri: string = process.env.DB_URI ?? '';

class DBHandler {
    client: MongoClient;
    squadronsCol: Collection<Squadron>;

    constructor() {
        this.client = new MongoClient(uri);
        console.log(Date(), ': Connected to DB');
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
     * Deletes a squadron from the database given a leader role
     * @param leaderRole Leader role ID of the target squadron
     */
    async removeSquadron(leaderRole: string) {
        this.squadronsCol.deleteOne({leaderRole: leaderRole});
    }

    /**
     * Gets an array of all the squadron leader roles
     * @returns Array of leader roles
     */
    async getSquadronRoles(key: 'memberRole' | 'leaderRole'): Promise<string[]> {
        const squadrons = await this.squadronsCol.find({}).toArray();
        let res: string[] = [];
        for (const squadron of squadrons) {
            res.push(squadron[key]);
        }

        return res;
    }

    /**
     * Returns the squadron with the matching leader role
     * @param leaderRole Leader role ID
     * @returns Squadron
     */
    async getSquadronByLeader(leaderRole: string): Promise<Squadron | null> {
        const squadron = await this.squadronsCol.findOne({leaderRole: leaderRole});
        if (!squadron) {
            return null;
        }
        
        return squadron;
    }

    /**
     * Returns the squadron with the matching member role
     * @param memberRole Member role ID
     * @returns Squadron
     */
    async getSquadronByMember(memberRole: string): Promise<Squadron | null> {
        const squadron = await this.squadronsCol.findOne({memberRole: memberRole});
        if (!squadron) {
            return null;
        }

        return squadron;
    }

    /**
     * Returns the squadron with a matching role
     * @param role Role ID
     * @returns Squadron
     */
    async getSquadronByAny(role: string): Promise<Squadron | null> {
        const leaderRes = await this.getSquadronByLeader(role);
        const memberRes = await this.getSquadronByMember(role);
        if (leaderRes) {
            return leaderRes;
        }
        
        if (memberRes) {
            return memberRes;
        }

        return null;
    }

    /**
     * Gets all registered squadrons
     * @returns All squadrons
     */
    async getAllSquadrons(): Promise<Squadron[]> {
        return await this.squadronsCol.find({}).toArray();
    }

    /**
     * Checks if a guild member is in a squadron
     * @param user Guild member to check
     * @returns Boolean, whether or not the user is in a squadron
     */
    async userInSquadron(user: Eris.Member): Promise<boolean> {
        const leaderRoles = await this.getSquadronRoles('leaderRole');
        const memberRoles = await this.getSquadronRoles('memberRole');
        for (const role of user.roles) {
            if (leaderRoles.includes(role) || memberRoles.includes(role)) {
                return true;
            }
        }
        
        return false;
    }
}

export const DB = new DBHandler();