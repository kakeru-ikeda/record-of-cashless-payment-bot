import * as dotenv from 'dotenv';

dotenv.config();

class Environment {
    // Discord関連設定
    static get DISCORD_TOKEN() {
        return process.env.DISCORD_TOKEN || '';
    }

    static get COMMAND_PREFIX() {
        return process.env.COMMAND_PREFIX || '!';
    }

    static get CLIENT_ID() {
        return process.env.CLIENT_ID || '';
    }

    static get GUILD_ID() {
        return process.env.GUILD_ID || '';
    }

    // API関連設定
    static get API_BASE_URL() {
        return process.env.API_BASE_URL || 'http://localhost:3000';
    }

    // Firebase関連設定
    static get FIREBASE_API_KEY() {
        return process.env.FIREBASE_API_KEY || '';
    }

    static get FIREBASE_AUTH_DOMAIN() {
        return process.env.FIREBASE_AUTH_DOMAIN || '';
    }

    static get FIREBASE_PROJECT_ID() {
        return process.env.FIREBASE_PROJECT_ID || '';
    }

    static get FIREBASE_STORAGE_BUCKET() {
        return process.env.FIREBASE_STORAGE_BUCKET || '';
    }

    static get FIREBASE_MESSAGING_SENDER_ID() {
        return process.env.FIREBASE_MESSAGING_SENDER_ID || '';
    }

    static get FIREBASE_APP_ID() {
        return process.env.FIREBASE_APP_ID || '';
    }

    static get FIREBASE_EMAIL() {
        return process.env.FIREBASE_EMAIL || '';
    }

    static get FIREBASE_PASSWORD() {
        return process.env.FIREBASE_PASSWORD || '';
    }

    // ログ設定
    static get LOG_LEVEL() {
        return process.env.LOG_LEVEL || 'INFO';
    }

    static validate() {
        // Discord設定の検証
        if (!this.DISCORD_TOKEN) {
            console.error('DISCORD_TOKEN is not set in the environment variables.');
            return false;
        }

        if (!this.CLIENT_ID) {
            console.error('CLIENT_ID is not set in the environment variables.');
            return false;
        }

        if (!this.GUILD_ID) {
            console.error('GUILD_ID is not set in the environment variables.');
            return false;
        }

        // API設定の検証
        if (!this.API_BASE_URL) {
            console.error('API_BASE_URL is not set in the environment variables.');
            return false;
        }

        // Firebase設定の検証
        if (!this.FIREBASE_API_KEY) {
            console.error('FIREBASE_API_KEY is not set in the environment variables.');
            return false;
        }

        if (!this.FIREBASE_AUTH_DOMAIN) {
            console.error('FIREBASE_AUTH_DOMAIN is not set in the environment variables.');
            return false;
        }

        if (!this.FIREBASE_PROJECT_ID) {
            console.error('FIREBASE_PROJECT_ID is not set in the environment variables.');
            return false;
        }

        if (!this.FIREBASE_EMAIL || !this.FIREBASE_PASSWORD) {
            console.error('FIREBASE_EMAIL and FIREBASE_PASSWORD are required for authentication.');
            return false;
        }

        return true;
    }
}

export { Environment };