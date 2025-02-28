/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CABIN_LAT: string;
    readonly VITE_CABIN_LONG: string;
    readonly VITE_CONTROLLER_PHONE_NUMBER: string;
    readonly VITE_CONTROLLER_PHONE_IP_ADDRESS: string;
    readonly VITE_AUTH_TOKEN: string;
    readonly VITE_POCKETBASE_URL: string;
    readonly VITE_CF_ACCESS_CLIENT_ID: string;
    readonly VITE_CF_ACCESS_CLIENT_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}