import { Interaction } from 'discord.js';
import { CommandHandler } from '../commands/command-handler';
import { logError } from '../utils/logger';

/**
 * インタラクション（スラッシュコマンド）を処理する
 * 注意：CommandHandlerは外部から渡す必要があります
 */
export const interactionCreate = (commandHandler: CommandHandler) => async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    try {
        await commandHandler.handle(interaction);
    } catch (error) {
        logError('インタラクションの処理中にエラーが発生しました', error instanceof Error ? error : new Error(String(error)), 'InteractionCreate');
        
        // インタラクションへの応答がまだなければエラーメッセージを送信
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ 
                content: 'コマンドの実行中にエラーが発生しました！', 
                ephemeral: true 
            });
        }
    }
};