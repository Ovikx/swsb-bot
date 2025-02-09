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

        // Check if caller is a squadron leader
        let isLeader = false;
        let leaderRole = '';
        const leaderRoles = await DB.getSquadronRoles('leaderRole');
        for (const role of caller.roles) {
            if (leaderRoles.includes(role)) {
                isLeader = true;
                leaderRole = role;
                break;
            }
        }

        // Caller must be a squadron leader
        if (!isLeader) {
            throw 'Not squadron leader';
        }

        const squadron = await DB.getSquadronByLeader(leaderRole);
        if (!squadron) {
            throw 'Squadron fetching error';
        }

        const memberId: string = (interaction.data.options?.[0] as any).value;

        // Embed details
        let title = '✅ Role added!';
        let description = `<@&${squadron.memberRole}> has been granted to <@${memberId}>!`;
        let color = +colors.success;

        await bot.addGuildMemberRole(guildId, memberId, squadron.memberRole).catch(
            () => {
                title = 'Something went wrong...';
                description = `Something went wrong when trying to assign the role. Contact <@${important.maintainerId}>.`,
                color = +colors.failure
            }
        );

        await interaction.createFollowup({
            embeds: [
                {
                    title,
                    description,
                    color,
                    author: createAuthor(interaction),
                    footer: {
                        text: '[REMINDER] Assigning roles to users that aren\'t in your squadron is not allowed'
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
            switch (e) {
                case 'Failed to fetch caller':
                    errorStr = `Unable to fetch the command caller\'s details. Contact <@${important.maintainerId}>.`;
                    break;
                case 'Not squadron leader':
                    errorStr = 'You are not a squadron leader.';
                    break;
                case 'Squadron fetching error':
                    errorStr = `Something went wrong when fetching your squadron. Contact <@${important.maintainerId}>.`;
                    break;
                case 'Server invoke only':
                    errorStr = 'You can only use this command from a server.';
                    break;
                case 'Already in squadron':
                    errorStr = 'This user is already in a squadron. Ask them to use `/leave-squadron` or ask the squadron leader to remove their role with `/remove-role`.';
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
        name: 'assign-role',
        description: 'Assigns the appropriate squadron role to the specified member',
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.USER,
                name: 'member',
                description: 'The member to give the squadron role to',
                required: true
            }
        ]
    },
    action: command
}