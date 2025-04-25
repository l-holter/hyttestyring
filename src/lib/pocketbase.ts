import PocketBase, { ClientResponseError } from 'pocketbase';
import { writable, derived } from 'svelte/store';

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

pb.beforeSend = (url, options) => {
    options.headers = {
        ...options.headers
    };
    return { url, options };
};

export const currentUser = writable(pb.authStore.model);

export const currentUserId = derived(
    currentUser,
    $currentUser => $currentUser?.id || null
);

export const isAuthenticated = derived(
    currentUser,
    $currentUser => !!$currentUser
);

pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model);
});

export function errorMessage(error: unknown) {
    const errorObj = error as ClientResponseError;
    console.error(errorObj.message);
    return errorObj.message;
}

export function getCurrentUserId(): string | null {
    return pb.authStore.model?.id || null;
}