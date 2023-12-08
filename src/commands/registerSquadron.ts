import Eris, { Constants } from 'eris';
import roles from '../utils/resources/roles.json';
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

        // Check if caller is admin
        let isAdmin = false;
        for (const role of caller.roles) {
            if (roles.authorizedRoles.includes(role)) {
                isAdmin = true;
                break;
            }
        }

        // Admin-only command
        if (!isAdmin) {
            throw 'Not admin';
        }

        const leaderRole: string = (interaction.data.options?.[0] as any).value;
        const memberRole: string = (interaction.data.options?.[1] as any).value;

        if (await DB.squadronExists(leaderRole, memberRole)) {
            throw 'Squadron already exists';
        }

        await DB.registerSquadron(leaderRole, memberRole);
        await interaction.createFollowup({
            embeds: [
                {
                    title: '✅ Squadron registered!',
                    description: `Squadron leader role <@&${leaderRole}> and squadron member role <@&${memberRole}> have successfully been registered.`,
                    color: +colors.success,
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
                case 'Not admin':
                    errorStr = 'You must be an admin to register a squadron.';
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
        name: 'register-squadron',
        description: '[ADMIN USE ONLY] Registers a squadron into the database',
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.ROLE,
                name: 'leader-role',
                description: 'The squadron leader role',
                required: true
            },
            {
                type: Constants.ApplicationCommandOptionTypes.ROLE,
                name: 'member-role',
                description: 'The squadron member role',
                required: true
            }
        ]
    },
    action: command
}