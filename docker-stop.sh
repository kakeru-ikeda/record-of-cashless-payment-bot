#!/bin/bash

# スクリプトの絶対パスを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Dockerコンテナを停止
echo "RoCP Discord BOTを停止しています..."
docker compose down

echo "コンテナが停止しました。"