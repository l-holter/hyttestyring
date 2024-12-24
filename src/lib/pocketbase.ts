import PocketBase, { ClientResponseError } from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

pb.beforeSend = (url, options) => {
    options.headers = {
        ...options.headers
    };
    return { url, options };
};

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model);
});

export function errorMessage(error: unknown) {
    const errorObj = error as ClientResponseError;
    console.error(errorObj.message);
    return errorObj.message;
}
