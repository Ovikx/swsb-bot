// Invite link: https://discord.com/api/oauth2/authorize?client_id=1054847519160537128&permissions=2416258112&scope=bot%20applications.commands

import Eris from 'eris';
import { bot } from '../core/bot';
import { events } from '../utils/EventLoader';

events;

bot.connect();

// Failsafe error handler
process.on('uncaughtException', (e) => {console.log(e)});