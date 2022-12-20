import Eris, { Constants } from 'eris';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {

    } catch (e) {
        console.log(e);
        if (!interaction.acknowledged) {
            await interaction.acknowledge(64);
        }

        let errorStr = 'An unexpected error occurred.';
        if (typeof e == 'string') {
            switch (e) {
                case 'Not started':
                    errorStr = 'You don\'t have any data yet. Use `/start` to get started!';
                    break;
            }
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
        name: 'NAME',
        description: 'DESCRIPTION'
    },
    action: command
}