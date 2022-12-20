import Eris from "eris";
import { Import } from "../utils/types/types";
import CommandCreator from "../utils/CommandCreator";
import { bot } from '../core/bot';

const commandCreator = new CommandCreator();
const commands = commandCreator.getCommands();

export default bot.on('interactionCreate', async (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) {
        console.log('command interaction received!');
        let matched = false;
        commands.every((cmd: Import) => {
            if (interaction.data.name == cmd.import.config.name) {
                cmd.import.action(bot, interaction);
                matched = true;
            }
            
            return matched == false;
        });
    }
})