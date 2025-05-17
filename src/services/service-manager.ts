import { Service, ServiceManager as ServiceManagerInterface } from '../types/service';
import { ApiClient } from './api-client';
import { logError, logInfo } from '../utils/logger';

export class ServiceManager implements ServiceManagerInterface {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
    }

    public async startService(serviceId: string): Promise<void> {
        try {
            const response = await this.apiClient.startService(serviceId);
            if (!response.success) {
                throw new Error(response.message || `サービス ${serviceId} の起動に失敗しました`);
            }
            logInfo(`サービス ${serviceId} の起動に成功しました`, 'ServiceManager');
        } catch (error) {
            logError(`サービス ${serviceId} の起動に失敗しました`, error instanceof Error ? error : new Error(String(error)), 'ServiceManager');
            throw error;
        }
    }

    public async stopService(serviceId: string): Promise<void> {
        try {
            const response = await this.apiClient.stopService(serviceId);
            if (!response.success) {
                throw new Error(response.message || `サービス ${serviceId} の停止に失敗しました`);
            }
            logInfo(`サービス ${serviceId} の停止に成功しました`, 'ServiceManager');
        } catch (error) {
            logError(`サービス ${serviceId} の停止に失敗しました`, error instanceof Error ? error : new Error(String(error)), 'ServiceManager');
            throw error;
        }
    }

    public async restartService(serviceId: string): Promise<void> {
        try {
            const response = await this.apiClient.restartService(serviceId);
            if (!response.success) {
                throw new Error(response.message || `サービス ${serviceId} の再起動に失敗しました`);
            }
            logInfo(`サービス ${serviceId} の再起動に成功しました`, 'ServiceManager');
        } catch (error) {
            logError(`サービス ${serviceId} の再起動に失敗しました`, error instanceof Error ? error : new Error(String(error)), 'ServiceManager');
            throw error;
        }
    }

    public async getServiceStatus(serviceId: string): Promise<string> {
        try {
            const response = await this.apiClient.getServiceStatus(serviceId);
            if (!response.success) {
                throw new Error(response.message || `サービス ${serviceId} のステータス取得に失敗しました`);
            }
            
            // 新APIスキーマでのサービスステータスのアクセス方法
            if (response.data && typeof response.data === 'object' && 'status' in response.data) {
                return response.data.status;
            }
            
            throw new Error(`サービス ${serviceId} のステータス情報が見つかりません`);
        } catch (error) {
            logError(`サービス ${serviceId} のステータス取得に失敗しました`, error instanceof Error ? error : new Error(String(error)), 'ServiceManager');
            throw error;
        }
    }

    public async listServices(): Promise<Service[]> {
        try {
            const response = await this.apiClient.listServices();
            if (!response.success) {
                throw new Error(response.message || 'サービス一覧の取得に失敗しました');
            }
            
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('サービス一覧の形式が無効です');
            }
            
            return response.data as Service[];
        } catch (error) {
            logError('サービス一覧の取得に失敗しました', error instanceof Error ? error : new Error(String(error)), 'ServiceManager');
            throw error;
        }
    }
}