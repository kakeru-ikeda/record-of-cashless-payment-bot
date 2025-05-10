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
            await this.apiClient.startService(serviceId);
            logInfo(`Service ${serviceId} started successfully.`);
        } catch (error) {
            logError(`Failed to start service ${serviceId}`, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    public async stopService(serviceId: string): Promise<void> {
        try {
            await this.apiClient.stopService(serviceId);
            logInfo(`Service ${serviceId} stopped successfully.`);
        } catch (error) {
            logError(`Failed to stop service ${serviceId}`, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    public async restartService(serviceId: string): Promise<void> {
        try {
            await this.apiClient.restartService(serviceId);
            logInfo(`Service ${serviceId} restarted successfully.`);
        } catch (error) {
            logError(`Failed to restart service ${serviceId}`, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    public async getServiceStatus(serviceId: string): Promise<string> {
        try {
            const response = await this.apiClient.getServiceStatus(serviceId);
            return response.status;
        } catch (error) {
            logError(`Failed to get status for service ${serviceId}`, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    public async listServices(): Promise<Service[]> {
        try {
            const response = await this.apiClient.listServices();
            return response.services;
        } catch (error) {
            logError('Failed to list services', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}