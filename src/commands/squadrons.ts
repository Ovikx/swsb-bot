import Eris, { Constants } from 'eris';
import important from '../utils/resources/important.json';
import { DB } from '../core/db';
import colors from '../utils/resources/colors.json';
import { createAuthor } from '../utils/helpers/misc';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        const caller = interaction.member;
        if (!caller) {
            throw 'Failed to fetch caller';
        }

        const squads = await DB.getAllSquadrons();
        let parsed: string[] = ['Leader role | Member role'];
        for (const squad of squads) {
            parsed.push(`<@&${squad.leaderRole}> | <@&${squad.memberRole}>`);
        }
        const combined = parsed.join('\n');

        await interaction.createFollowup({
            embeds: [
                {
                    title: 'Registered Squadrons',
                    description: combined,
                    color: +colors.blue,
                    author: createAuthor(interaction)
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
            switch (e) {
                case 'Failed to fetch caller':
                    errorStr = `Unable to fetch the command caller\'s details. Contact <@${important.ownerId}>.`;
                    break;
                case 'Squadron already exists':
                    errorStr = 'Either the squadron leader role or squadron member role is already assigned to a different squadron.';
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
        name: 'squadrons',
        description: 'Displays all registered squadrons'
    },
    action: command
}