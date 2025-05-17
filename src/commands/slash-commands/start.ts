import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { ServiceManager } from '../../services/service-manager';
import { logError } from '../../utils/logger';

export const startCommand: Command = {
    name: 'start',
    description: 'メール監視サービスを起動します',
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        
        const serviceManager = new ServiceManager();
        
        try {
            await serviceManager.startService('email-monitoring');
            await interaction.editReply('✅ メール監視サービスを起動しました。');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logError('サービス起動エラー', error instanceof Error ? error : new Error(String(error)), 'StartCommand');
            await interaction.editReply(`❌ サービスの起動中にエラーが発生しました: ${errorMessage}`);
        }
    },
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('メール監視サービスを起動します')
};