import axios, { AxiosError } from 'axios';
import { Environment } from '../config/environment';
import { firebaseService } from './firebase-service';
import { logError, logInfo } from '../utils/logger';

/**
 * 標準APIレスポンス型
 */
export interface ApiResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T | null;
}

export class ApiClient {
    private baseUrl: string;
    private authTokenPromise: Promise<string> | null = null;

    constructor() {
        this.baseUrl = Environment.API_BASE_URL;
    }

    /**
     * Firebase IDトークンを取得する
     * インスタンス内で一度取得したら再利用する
     */
    private async getAuthToken(): Promise<string> {
        try {
            if (!firebaseService.isLoggedIn()) {
                // まだログインしていなければログインする
                await firebaseService.login(
                    Environment.FIREBASE_EMAIL,
                    Environment.FIREBASE_PASSWORD
                );
            }
            
            // IDトークンを取得して返す
            const token = await firebaseService.getIdToken();
            logInfo('Firebase IDトークンの取得に成功しました', 'ApiClient');
            return token;
        } catch (error) {
            logError('Firebase IDトークンの取得に失敗しました', error instanceof Error ? error : new Error(String(error)), 'ApiClient');
            throw error;
        }
    }

    /**
     * 認証ヘッダーを取得する
     * トークンは必要に応じて取得される
     */
    private async getHeaders(): Promise<Record<string, string>> {
        // トークン取得処理が未実施の場合は実行
        if (!this.authTokenPromise) {
            this.authTokenPromise = this.getAuthToken();
        }

        try {
            // トークンを取得
            const token = await this.authTokenPromise;
            
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        } catch (error) {
            // トークン取得に失敗したらPromiseをクリアして再取得を試行できるようにする
            this.authTokenPromise = null;
            throw error;
        }
    }

    /**
     * トークンを強制的に再取得する
     */
    async refreshToken(): Promise<void> {
        this.authTokenPromise = null;
        await this.getHeaders();
        logInfo('認証トークンを再取得しました', 'ApiClient');
    }

    async getServiceStatus(serviceId: string): Promise<ApiResponse> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/services/${serviceId}`, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, `Failed to fetch status for service ${serviceId}`);
        }
    }

    async listServices(): Promise<ApiResponse> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/services`, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to list services');
        }
    }

    async startService(serviceId: string): Promise<ApiResponse> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/services/${serviceId}`, {
                action: 'start'
            }, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, `Failed to start service ${serviceId}`);
        }
    }

    async stopService(serviceId: string): Promise<ApiResponse> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/services/${serviceId}`, {
                action: 'stop'
            }, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, `Failed to stop service ${serviceId}`);
        }
    }

    async restartService(serviceId: string): Promise<ApiResponse> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/services/${serviceId}`, {
                action: 'restart'
            }, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, `Failed to restart service ${serviceId}`);
        }
    }

    async getMonitoringStatus(): Promise<ApiResponse> {
        try {
            const response = await axios.get(`${this.baseUrl}/monitoring/status`, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch monitoring status');
        }
    }

    async getErrorLogs(): Promise<ApiResponse> {
        try {
            const response = await axios.get(`${this.baseUrl}/monitoring/errors`, {
                headers: await this.getHeaders()
            });
            return response.data as ApiResponse;
        } catch (error) {
            throw this.handleApiError(error, 'Failed to fetch error logs');
        }
    }

    private handleApiError(error: any, message: string): Error {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiResponse>;
            
            // 認証エラー (401) の場合は、トークンをリフレッシュできるようにPromiseをクリア
            if (axiosError.response?.status === 401) {
                this.authTokenPromise = null;
                logError(`${message}: 認証エラー - トークンが無効か期限切れの可能性があります`, new Error(), 'ApiClient');
            }
            
            if (axiosError.response) {
                // APIからのエラーレスポンスがある場合
                const apiResponse = axiosError.response.data as ApiResponse;
                return new Error(
                    `${message}: ${axiosError.response.status} - ${apiResponse.message || JSON.stringify(axiosError.response.data)}`
                );
            } else if (axiosError.request) {
                return new Error(`${message}: サーバーからの応答がありません`);
            }
        }
        return new Error(`${message}: ${error.message || 'Unknown error'}`);
    }
}