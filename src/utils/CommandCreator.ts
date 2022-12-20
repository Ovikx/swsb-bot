import Eris from "eris";
import { Import } from "./types/types";
import { bot } from '../core/bot';
import { compiledCommands as cmds } from "./CommandCompiler";

export default class CommandCreator {
    async createCommands(global: boolean) {
        let configs: Eris.ApplicationCommandStructure[] = [];
        cmds.forEach((cmd: Import) => {
            configs.push(cmd.import.config);
        });

        if (global) {
            bot.bulkEditCommands(configs);
        } else {
            const dotenv = await import('dotenv');
            dotenv.config();
            const guildID: string = process.env.TESTING_GUILD_ID ?? '';
            bot.bulkEditGuildCommands(
                guildID,
                configs
            );
        }
    }

    getCommands() {
        return cmds;
    }
}
