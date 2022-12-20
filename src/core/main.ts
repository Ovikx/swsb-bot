// Beta invite link: https://discord.com/api/oauth2/authorize?client_id=1054847519160537128&permissions=2416258112&scope=bot%20applications.commands
// Main invite link: https://discord.com/api/oauth2/authorize?client_id=1054847129752969327&permissions=2416258112&scope=bot%20applications.commands

import Eris from 'eris';
import { bot } from './bot';
import { events } from '../utils/EventLoader';
import { DB } from './db';

DB;
events;

bot.connect();

// Failsafe error handler
process.on('uncaughtException', (e) => {console.log(e)});