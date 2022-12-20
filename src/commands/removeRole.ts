import Eris, { Constants } from 'eris';
import { DB } from '../core/db';
import important from '../utils/resources/important.json';
import colors from '../utils/resources/colors.json';
import { createAuthor } from '../utils/helpers/misc';

async function command(bot: Eris.Client, interaction: Eris.CommandInteraction) {
    try {
        await interaction.acknowledge();

        const caller = interaction.member;
        if (!caller) {
            throw 'Failed to fetch caller'
        }

        // Check if caller is a squadron leader
        let isLeader = false;
        let leaderRole = '';
        const leaderRoles = await DB.getLeaderRoles();
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

        const squadron = await DB.getSquadron(leaderRole);
        if (!squadron) {
            throw 'Squadron fetching error';
        }

        const memberId: string = (interaction.data.options?.[0] as any).value;

        // Interaction must be called from a serer
        const guildId = interaction.guildID;
        if (!guildId) {
            throw 'Server invoke only';
        }

        // Embed details
        let title = '✅ Role removed!';
        let description = `<@&${squadron.memberRole}> has been removed from <@${memberId}>!`;
        let color = +colors.success;

        await bot.removeGuildMemberRole(guildId, memberId, squadron.memberRole).catch(
            () => {
                title = 'Something went wrong...';
                description = `Something went wrong when trying to assign the role. Contact <@${important.ownerId}>.`,
                color = +colors.failure
            }
        );

        await interaction.createFollowup({
            embeds: [
                {
                    title,
                    description,
                    color,
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
                case 'Not squadron leader':
                    errorStr = 'You are not a squadron leader.';
                    break;
                case 'Squadron fetching error':
                    errorStr = `Something went wrong when fetching your squadron. Contact <@${important.ownerId}>.`;
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
        name: 'remove-role',
        description: 'Removes the appropriate squadron role from the specified member',
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.USER,
                name: 'member',
                description: 'The member to take the role from',
                required: true
            }
        ]
    },
    action: command
}