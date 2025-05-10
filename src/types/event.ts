import { Interaction } from 'discord.js';

export interface Event {
    name: string;
    execute(...args: any[]): Promise<void>;
}

export interface InteractionEvent extends Event {
    execute(interaction: Interaction): Promise<void>;
}