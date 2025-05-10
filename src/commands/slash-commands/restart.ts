// filepath: /home/server/github/rocp-bot/src/commands/slash-commands/restart.ts
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { ServiceManager } from '../../services/service-manager';
import { logError } from '../../utils/logger';

export const restartCommand: Command = {
    name: 'restart',
    description: 'メール監視サービスを再起動します',
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        
        const serviceManager = new ServiceManager();
        
        try {
            await serviceManager.restartService('email-monitoring');
            await interaction.editReply('✅ メール監視サービスを再起動しました。');
        } catch (error) {
            logError('サービス再起動エラー', error instanceof Error ? error : new Error(String(error)), 'RestartCommand');
            await interaction.editReply('❌ サービスの再起動中にエラーが発生しました。');
        }
    },
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('メール監視サービスを再起動します')
};