FROM node:18-alpine

# アプリケーションディレクトリを作成
WORKDIR /app

# TypeScriptをグローバルにインストール
RUN npm install -g typescript

# アプリケーションの依存関係をインストール
# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# ログディレクトリを作成
RUN mkdir -p logs

# アプリケーションを実行
CMD ["node", "dist/index.js"]