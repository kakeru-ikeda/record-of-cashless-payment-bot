// filepath: /rocp-bot/rocp-bot/src/utils/helpers.ts
export function formatResponseMessage(message: string): string {
    return `**Response:** ${message}`;
}

export function parseCommandArguments(args: string[]): Record<string, string> {
    const parsedArgs: Record<string, string> = {};
    args.forEach(arg => {
        const [key, value] = arg.split('=');
        if (key && value) {
            parsedArgs[key] = value;
        }
    });
    return parsedArgs;
}

export function isValidServiceName(serviceName: string): boolean {
    const validServices = ['service1', 'service2', 'service3']; // Example service names
    return validServices.includes(serviceName);
}