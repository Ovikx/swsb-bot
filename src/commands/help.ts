import Eris, { Constants } from 'eris';
import { outdent } from '../utils/helpers/misc';
import colors from '../utils/resources/colors.json';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.createMessage({
            embeds: [
                {
                    title: 'Help',
                    fields: [
                        {
                            name: 'Squadron leaders',
                            value: outdent
                            `\`/assign-role\`: Assigns your squadron role to the specified member
                            \`/remove-role\`: Removes your squadron role from the specified member`
                        },
                        {
                            name: 'Admins',
                            value: outdent
                            `\`/register-squadron\`: Registers a squadron into the database; this *has* to be done in order for the system to work
                            \`/remove-squadron\`: Removes a squadron from the database; note that this does not unassign roles from the squadron members
                            \`/squadrons\`: Displays all registered squadrons
                            \`/purge\`: Deletes all squadrons that don't have an existing leader and/or member role`
                        }
                    ],
                    color: +colors.blue
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
        name: 'help',
        description: 'Shows how to use some key commands'
    },
    action: command
}