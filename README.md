# RoCP Discord BOT - システム管理用BOT

RoCP BOTは、Discord上で動作するボットで、スラッシュコマンドを使用してサービスの起動・停止などの操作を行うことができます。このボットはTypeScriptで実装されており、discord.jsライブラリのv14を利用しています。

## 機能

- **スラッシュコマンド**: ユーザーは簡単にコマンドを実行できます。
  - `/ping`: ボットの応答を確認します。
  - `/start`: サービスを起動します。
  - `/stop`: サービスを停止します。
  - `/restart`: サービスを再起動します。
  - `/status`: サービスの状態を確認します。

## 関連リポジトリ

- **バックエンド**: [record-of-cashless-payment](https://github.com/kakeru-ikeda/record-of-cashless-payment)
- **フロントエンド**: [record-of-cashless-payment-webfront](https://github.com/kakeru-ikeda/record-of-cashless-payment-webfront)
- **Discord BOT**: このリポジトリ

## セットアップ

### 通常のセットアップ

1. リポジトリをクローンします。
   ```
   git clone https://github.com/kakeru-ikeda/rocp-bot.git
   cd rocp-bot
   ```

2. 依存関係をインストールします。
   ```
   npm install
   ```

3. 環境変数を設定します。`.env.example`をコピーして`.env`を作成し、必要な値を設定します。

4. コマンドをDiscordにデプロイします。
   ```
   ts-node deploy-commands.ts
   ```

5. ボットを起動します。
   ```
   npm start
   ```

### Dockerでの実行方法

Dockerを使用してボットを実行することもできます：

1. 環境変数を設定します。`.env.example`をコピーして`.env`を作成し、必要な値を設定します。

2. 提供されたスクリプトを使用して起動します。
   ```
   ./docker-start.sh
   ```

3. ボットを停止する場合は、以下のコマンドを実行します。
   ```
   ./docker-stop.sh
   ```

4. または、docker-composeを直接使用して起動・停止することもできます。
   ```
   # 起動
   docker-compose up -d
   
   # 停止
   docker-compose down
   ```

5. ログの確認方法
   ```
   # コンテナログを確認
   docker logs rocp-discord-bot
   
   # またはlogsディレクトリ内のログファイルを直接確認
   cat logs/combined.log
   ```

## 使用方法

ボットがオンラインになったら、Discordサーバー内でスラッシュコマンドを使用してサービスを操作できます。各コマンドは、ボットが応答することで実行結果を確認できます。

## 開発

このプロジェクトはTypeScriptで書かれており、以下のファイル構成を持っています。

- `src/index.ts`: アプリケーションのエントリーポイント
- `src/config/`: 環境変数や定数を管理
- `src/commands/`: スラッシュコマンドの実装
- `src/events/`: Discordイベントの処理
- `src/services/`: サービスの管理
- `src/utils/`: ユーティリティ関数
- `src/types/`: 型定義

## ライセンス

このプロジェクトはプライベートで使用することを前提としており、個人的なカード利用通知の管理のための参考実装です