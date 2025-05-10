// deploy-commands.ts
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { Environment } from './src/config/environment';
import { SlashCommandBuilder } from '@discordjs/builders';

// 環境変数をロード
config();

// スラッシュコマンドのデータ定義
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botの応答速度を確認します'),
  new SlashCommandBuilder()
    .setName('start')
    .setDescription('メール監視サービスを起動します'),
  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('メール監視サービスを停止します'),
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('サービスの状態を確認します'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(Environment.DISCORD_TOKEN);

(async () => {
  try {
    console.log('スラッシュコマンドをデプロイしています...');

    await rest.put(
      Routes.applicationGuildCommands(
        Environment.CLIENT_ID, 
        Environment.GUILD_ID
      ),
      { body: commands }
    );

    console.log('スラッシュコマンドのデプロイが完了しました！');
  } catch (error) {
    console.error('スラッシュコマンドのデプロイ中にエラーが発生しました：');
    console.error(error);
  }
})();