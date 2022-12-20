import Eris from 'eris';
import dotenv from 'dotenv';
dotenv.config();

const token: string = process.env.BETA_BOT_TOKEN ?? (process.env.BOT_TOKEN ?? '');
export const bot: Eris.Client = new Eris.Client(token, {
    intents: ['guildMembers', 'guilds'],
    messageLimit: 100,
    restMode: true,
    firstShardID: 0,
    maxShards: 1
});