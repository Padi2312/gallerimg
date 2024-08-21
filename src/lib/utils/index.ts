import * as crypto from 'crypto';
export const formatBytes = (size: number): string => {
    // Define size units
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let n = 0;

    // Calculate the appropriate unit
    while (size >= 1024 && n < units.length - 1) {
        size /= 1024;
        n++;
    }

    // Format the size with two decimal places and the appropriate unit
    return `${size.toFixed(2)} ${units[n]}`;
}

export const createHash = (data: any): string => {
    return crypto.createHash('sha256').update(data).digest('hex');
}