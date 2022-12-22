import Eris from "eris";
import CommandCreator from "../utils/CommandCreator";
import { bot } from '../core/bot';
import important from '../utils/resources/important.json';

const GLOBAL = true;
const commandCreator = new CommandCreator();

export default bot.on('ready', async () => {
    console.log('Bot has logged in!');
    commandCreator.createCommands(GLOBAL);
    console.log('Caching members...')
    const supportGuild = bot.guilds.add(await bot.getRESTGuild(important.supportGuildId));
    console.log(`Cached ${await supportGuild.fetchAllMembers()} members from ${supportGuild.name}`);
    console.log('Loaded completely!');
});