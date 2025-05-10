import { Client } from 'discord.js';
import { logger } from '../utils/logger';

export const readyEvent = (client: Client) => {
    logger.info(`Logged in as ${client.user?.tag}`, 'Ready');
};