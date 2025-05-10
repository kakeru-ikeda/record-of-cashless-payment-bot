import { Client, CommandInteraction, Collection } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { logger } from '../utils/logger';
import { pingCommand } from './slash-commands/ping';
import { startCommand } from './slash-commands/start';
import { stopCommand } from './slash-commands/stop';
import { statusCommand } from './slash-commands/status';
import { restartCommand } from './slash-commands/restart';
import { Command } from '../types/command';

export class CommandHandler {
    private client: Client;
    private commands: Collection<string, Command>;

    constructor(client: Client) {
        this.client = client;
        this.commands = new Collection<string, Command>();
    }

    public registerCommands() {
        // スラッシュコマンドをロード
        this.registerCommand(pingCommand);
        this.registerCommand(startCommand);
        this.registerCommand(stopCommand);
        this.registerCommand(statusCommand);
        this.registerCommand(restartCommand);
      
        logger.info(`全${this.commands.size}件のコマンドが登録されました`, 'CommandHandler');
      }

    public registerCommand(command: Command) {
        if (!command.name) {
            logger.error(`Command missing name: ${JSON.stringify(command)}`, undefined, 'CommandHandler');
            return;
        }

        this.commands.set(command.name, command);
        logger.info(`Command registered: ${command.name}`, 'CommandHandler');
    }

    public getCommands(): Collection<string, Command> {
        return this.commands;
    }

    public async handle(interaction: CommandInteraction): Promise<void> {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`Command not found: ${interaction.commandName}`, undefined, 'CommandHandler');
            await interaction.reply({ content: 'このコマンドは実装されていません。', ephemeral: true });
            return;
        }

        try {
            logger.info(`Executing command: ${interaction.commandName}`, 'CommandHandler');
            await command.execute(interaction);
        } catch (error) {
            logger.error(`Error executing command ${interaction.commandName}`, error instanceof Error ? error : new Error(String(error)), 'CommandHandler');
            
            // 応答済みでなければエラーメッセージを返す
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
            } else {
                await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
            }
        }
    }
}

// スラッシュコマンドの設定を外部からアクセスするためのエクスポート
export const commands = [
    pingCommand,
    startCommand,
    stopCommand,
    statusCommand,
    restartCommand
].map(command => {
    if ('data' in command) {
        return command.data;
    }
    
    // データフィールドがない場合は、name と description から SlashCommandBuilder を作成
    const builder = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description || 'No description provided');
        
    return builder.toJSON();
});