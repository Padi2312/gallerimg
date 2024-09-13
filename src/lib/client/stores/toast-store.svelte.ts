import { writable } from 'svelte/store';

export type ToastType = 'info' | 'warn' | 'error';
export type ToastData = {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
};

export const toasts = writable<ToastData[]>([
    // {
    //     id: 0,
    //     message: 'Dies ist ein Test',
    //     type: 'error',
    //     duration: 1000
    // }
]);

export const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now();
    toasts.update(currentToasts => {
        return [...currentToasts, { id, message, type, duration }];
    });
    setTimeout(() => {
        toasts.update(currentToasts => {
            return currentToasts.filter(t => t.id !== id);
        });
    }, duration);
};

export const removeToast = (id: number) => {
    toasts.update(currentToasts => {
        return currentToasts.filter(t => t.id !== id);
    });
};