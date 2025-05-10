import { Client } from 'discord.js';
import { logger } from '../utils/logger';
import { CommandHandler } from '../commands/command-handler';
import { interactionCreate } from './interaction-create';

export class EventHandler {
    private client: Client;
    private commandHandler: CommandHandler;

    constructor(client: Client) {
        this.client = client;
        this.commandHandler = new CommandHandler(client);
    }

    public registerCommands(): void {
        this.commandHandler.registerCommands();
    }

    public listen(): void {
        // Readyイベント - Botがログインした時
        this.client.on('ready', this.onReady.bind(this));
        
        // InteractionCreateイベント - スラッシュコマンドが実行された時
        // 修正：CommandHandlerのインスタンスを渡す
        this.client.on('interactionCreate', interactionCreate(this.commandHandler));
        
        logger.info('Event listeners registered', 'EventHandler');
    }

    private onReady(): void {
        if (!this.client.user) return;
        logger.info(`Logged in as ${this.client.user.tag}`, 'Bot');
    }
}