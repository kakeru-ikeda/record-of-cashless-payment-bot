#!/bin/bash

# スクリプトの絶対パスを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# .envファイルの存在チェック
if [ ! -f .env ]; then
    echo "エラー: .envファイルが見つかりません。"
    echo ".env.exampleをコピーして必要な設定を行ってください。"
    exit 1
fi

# Dockerコンテナをビルドして起動
echo "RoCP Discord BOTを起動します..."
docker compose up -d --build

# 起動状態確認
echo "コンテナ状態:"
docker compose ps