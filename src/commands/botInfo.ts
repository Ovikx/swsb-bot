import Eris, { Constants } from 'eris';
import { outdent } from '../utils/helpers/misc';
import colors from '../utils/resources/colors.json';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        const shard = bot.guilds.get(interaction.guildID as string)?.shard;
        let memArray: string[] = [];
        for (const [key, value] of Object.entries(process.memoryUsage())) {
            memArray.push(`${key}: ${(value/1000000).toFixed(2)} MB`);
        }

        await interaction.createMessage({
            embeds: [
                {
                    title: 'Bot stats',
                    color: +colors.blue,
                    fields: [
                        {
                            name: 'Shard info',
                            value: outdent
                            `\`\`\`basic
                            ID: ${shard?.id}
                            Latency: ${shard?.latency} ms
                            Active listeners: ${bot.listenerCount('interactionCreate')}
                            \`\`\``
                        },
                        {
                            name: 'Memory',
                            value: outdent
                            `\`\`\`basic
                            ${memArray.join('\n')}
                            \`\`\``
                        }
                    ]
                }
            ]
        })
    } catch (e) {
        console.log(e);
        if (!interaction.acknowledged) {
            await interaction.acknowledge(64);
        }

        let errorStr = 'An unexpected error occurred.';
        if (typeof e == 'string') {
            switch (e) {}
        }

        await interaction.createFollowup({
            content: errorStr,
            flags: 64
        });
    }
}

module.exports = {
    config: {
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        name: 'bot-info',
        description: 'Displays the bot\'s status'
    },
    action: command
}