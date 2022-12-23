import Eris, { Constants } from 'eris';
import { DB } from '../core/db';
import important from '../utils/resources/important.json';
import colors from '../utils/resources/colors.json';
import { createAuthor } from '../utils/helpers/misc';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        // Check that command was called from a server
        const guildId = interaction.guildID;
        if (!guildId) {
            throw 'Server invoke only';
        }

        const caller = interaction.member;
        if (!caller) {
            throw 'Failed to fetch caller'
        }

        const targetRole = (interaction.data.options?.[0] as any).value as string;

        // Check that target role is a member role
        const memberRoles = await DB.getSquadronRoles('memberRole');
        if (!memberRoles.includes(targetRole)) {
            throw 'Not a squadron member role';
        }

        // Check that caller is a squadron member, not leader
        // Iterate through each of the user's roles and ensure that
        //      a) User is not a squadron leader
        //      b) User has the target role
        let hasTargetRole = false;
        const leaderRoles = await DB.getSquadronRoles('leaderRole');
        for (const role of caller.roles) {
            if (leaderRoles.includes(role)) {
                throw 'Squadron leader';
            }

            if (targetRole == role && !hasTargetRole) {
                hasTargetRole = true;
            }
        }

        // Check that the user has the target role
        if (!hasTargetRole) {
            throw 'Does not have role';
        }

        bot.removeGuildMemberRole(guildId, caller.id, targetRole);
        await interaction.createFollowup({
            embeds: [
                {
                    title: '✅ Role removed!',
                    description: `Squadron role <@&${targetRole}> has been removed from your profile.`,
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
                case 'Squadron leader':
                    errorStr = 'You are a squadron leader; contact an admin if you want to delete your squadron or transfer ownership to someone else.';
                    break;
                case 'No squadron roles':
                    errorStr = 'You have no squadron roles to remove.';
                    break;
                case 'Not a squadron member role':
                    errorStr = 'This is not a squadron member role.';
                    break;
                case 'Does not have role':
                    errorStr = 'You don\'t have this role.';
                    break;
                case 'Server invoke only':
                    errorStr = 'You can only use this command from a server.';
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
        name: 'leave-squadron',
        description: 'Removes a specific squadron role from your profile',
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.ROLE,
                name: 'squadron',
                description: 'The squadron role to remove',
                required: true
            }
        ]
    },
    action: command
}