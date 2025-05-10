import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { EventHandler } from './events/event-handler';
import { Environment } from './config/environment';
import { logInfo, logError, logWarn } from './utils/logger';
import { firebaseService } from './services/firebase-service';

// 環境変数の読み込み
config();

async function main() {
    try {
        logInfo('RoCP BOT起動中...', 'App');

        // 環境変数の検証
        if (!Environment.validate()) {
            logError('環境変数の検証に失敗しました。BOT起動を中止します。', undefined, 'App');
            process.exit(1);
        }

        // Firebase認証の初期化
        try {
            await firebaseService.login(Environment.FIREBASE_EMAIL, Environment.FIREBASE_PASSWORD);
            logInfo('Firebase認証に成功しました', 'App');
            
            // トークンを取得して確認
            const token = await firebaseService.getIdToken();
            if (token) {
                logInfo('Firebase IDトークンの取得に成功しました', 'App');
            }
        } catch (error) {
            logError('Firebase認証に失敗しました。APIへの接続ができない可能性があります。', error instanceof Error ? error : new Error(String(error)), 'App');
            logWarn('認証エラーがありますが、BOTの起動を続行します...', 'App');
        }

        // Discordクライアントの初期化
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageTyping,
            ],
        });

        // ハンドラーの設定と初期化
        // EventHandlerとCommandHandlerの関係を明確にする
        const eventHandler = new EventHandler(client);
        
        // 明示的にコマンド登録を行う
        eventHandler.registerCommands();
        
        // イベントのリッスン開始
        eventHandler.listen();

        // Discord Botのログイン
        await client.login(Environment.DISCORD_TOKEN);
        
        // ログイン後、スラッシュコマンドのフル表示名を出力
        client.once('ready', () => {
            logInfo(`BOTが正常に起動しました: ${client.user?.tag}`, 'App');
            
            // 利用可能なスラッシュコマンドを確認
            if (client.application) {
                client.application.commands.fetch()
                    .then(commands => {
                        if (commands.size === 0) {
                            logWarn('登録されたスラッシュコマンドが見つかりません。deploy-commands.tsを実行してください。', 'App');
                        } else {
                            logInfo(`Discord APIに登録されているスラッシュコマンド: ${commands.size}個`, 'App');
                            commands.forEach(cmd => {
                                logInfo(`- /${cmd.name}: ${cmd.description}`, 'App');
                            });
                        }
                    })
                    .catch(error => {
                        logError('スラッシュコマンド情報の取得に失敗しました', error instanceof Error ? error : new Error(String(error)), 'App');
                    });
            }
        });
        
    } catch (error) {
        logError('BOT起動処理中にエラーが発生しました', error instanceof Error ? error : new Error(String(error)), 'App');
        process.exit(1);
    }
}

// アプリケーションの起動
main().catch(error => {
    console.error('予期せぬエラーが発生しました:', error);
    process.exit(1);
});