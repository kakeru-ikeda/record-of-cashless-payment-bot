import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../types/command';

export const pingCommand: Command = {
    name: 'ping',
    description: 'Botの応答速度を確認します',
    async execute(interaction: CommandInteraction) {
        const sent = await interaction.reply({ content: 'Ping計測中...', fetchReply: true });
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply(`Pong! 応答時間: ${ping}ms | API遅延: ${interaction.client.ws.ping}ms`);
    },
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botの応答速度を確認します')
};