import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface Command {
    name: string;
    description: string;
    execute(interaction: CommandInteraction): Promise<void>;
    data?: SlashCommandBuilder | any;
}