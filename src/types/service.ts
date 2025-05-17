export interface Service {
    id: string;
    name: string;
    description: string;
    status: string;
    actions?: string[]; // 利用可能なアクション（start, stop, restart など）
}

export interface ServiceManager {
    startService(serviceId: string): Promise<void>;
    stopService(serviceId: string): Promise<void>;
    restartService(serviceId: string): Promise<void>;
    getServiceStatus(serviceId: string): Promise<string>;
    listServices(): Promise<Service[]>;
}