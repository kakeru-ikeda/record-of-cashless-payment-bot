import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { ServiceManager } from '../../services/service-manager';
import { logError } from '../../utils/logger';

export const stopCommand: Command = {
    name: 'stop',
    description: 'メール監視サービスを停止します',
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        
        const serviceManager = new ServiceManager();
        
        try {
            await serviceManager.stopService('email-monitoring');
            await interaction.editReply('✅ メール監視サービスを停止しました。');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logError('サービス停止エラー', error instanceof Error ? error : new Error(String(error)), 'StopCommand');
            await interaction.editReply(`❌ サービスの停止中にエラーが発生しました: ${errorMessage}`);
        }
    },
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('メール監視サービスを停止します')
};