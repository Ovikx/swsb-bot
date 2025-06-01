import Eris from "eris";
import CommandCreator from "../utils/CommandCreator";
import { bot } from '../core/bot';
import important from '../utils/resources/important.json';

const GLOBAL = true;
const commandCreator = new CommandCreator();

export default bot.on('ready', async () => {
    console.log(Date(), ': Bot has logged in!');
    commandCreator.createCommands(GLOBAL);
    console.log(Date(), ': Caching members...')
    const supportGuild = bot.guilds.add(await bot.getRESTGuild(important.supportGuildId));
    console.log(Date(),`: Cached ${await supportGuild.fetchAllMembers()} members from ${supportGuild.name}`);
    console.log(Date(), ': Loaded completely!');
});