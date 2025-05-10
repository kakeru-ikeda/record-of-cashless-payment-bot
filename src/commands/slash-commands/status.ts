import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { ServiceManager } from '../../services/service-manager';
import { ApiClient } from '../../services/api-client';
import { logError } from '../../utils/logger';

export const statusCommand: Command = {
    name: 'status',
    description: 'サービスの状態を確認します',
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply();
        
        const serviceManager = new ServiceManager();
        const apiClient = new ApiClient();
        
        try {
            // サービス状態を取得
            const services = await apiClient.listServices();
            
            if (!services || !services.data || services.data.length === 0) {
                await interaction.editReply('❌ サービス情報を取得できませんでした。');
                return;
            }
            
            // モニタリング情報を取得
            let monitoringStatus;
            try {
                monitoringStatus = await apiClient.getMonitoringStatus();
            } catch (error) {
                // モニタリング情報の取得に失敗してもサービス情報は表示する
                logError('モニタリングステータス取得エラー', error instanceof Error ? error : new Error(String(error)), 'StatusCommand');
            }
            
            // ステータスEmbed作成
            const statusEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('RoCP システム状態')
                .setDescription('現在のサービス状態とシステムステータス')
                .setTimestamp();
            
            // サービス一覧を表示
            let servicesText = '';
            services.data.forEach((service: any) => {
                const statusIcon = service.status === 'active' ? '🟢' : '🔴';
                servicesText += `${statusIcon} **${service.name}**: ${service.status === 'active' ? 'アクティブ' : '停止中'}\n`;
            });
            
            statusEmbed.addFields({ name: 'サービス状態', value: servicesText || 'サービスはありません' });
            
            // モニタリング情報があれば追加
            if (monitoringStatus && monitoringStatus.data) {
                let monitoringText = '';
                const statusData = monitoringStatus.data;
                
                if (typeof statusData === 'object') {
                    for (const [key, value] of Object.entries(statusData)) {
                        if (typeof value === 'object' && value !== null && 'status' in value) {
                            const serviceStatus = (value as any).status;
                            const statusIcon = serviceStatus === 'online' ? '🟢' : serviceStatus === 'error' ? '🔴' : '🟡';
                            monitoringText += `${statusIcon} **${key}**: ${serviceStatus}\n`;
                        }
                    }
                }
                
                if (monitoringText) {
                    statusEmbed.addFields({ name: 'システムモニタリング', value: monitoringText });
                }
            }
            
            await interaction.editReply({ embeds: [statusEmbed] });
        } catch (error) {
            logError('ステータス取得エラー', error instanceof Error ? error : new Error(String(error)), 'StatusCommand');
            await interaction.editReply('❌ サービス状態の取得中にエラーが発生しました。');
        }
    },
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('サービスの状態を確認します')
};