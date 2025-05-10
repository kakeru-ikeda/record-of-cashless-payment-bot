export interface Service {
    id: string;
    name: string;
    description: string;
    status: string;
}

export interface ServiceManager {
    startService(serviceId: string): Promise<void>;
    stopService(serviceId: string): Promise<void>;
    getServiceStatus(serviceId: string): Promise<string>;
    listServices(): Promise<Service[]>;
}