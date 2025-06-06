import Eris, { Constants } from 'eris';
import { outdent } from '../utils/helpers/misc';
import important from '../utils/resources/important.json';
import colors from '../utils/resources/colors.json';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.createMessage({
            embeds: [
                {
                    title: 'The official SW:SB bot',
                    description: outdent
                    `Originally developed by <@${important.ownerId}>. It is currently maintained and hosted by <@${important.maintainerId}>, who should be notified should any issues arise.
                    \n
                    The aim of this bot is to facilitate SW:SB-specific tasks. This currently includes managing squadrons and welcoming new members.`,
                    color: +colors.a_class,
                    footer: {
                        text: 'gonk > clankers'
                    }
                }
            ]
        });
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
        name: 'about',
        description: 'Displays some basic information about the bot'
    },
    action: command
}