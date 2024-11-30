/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CABIN_LAT: string;
    readonly VITE_CABIN_LONG: string;
    readonly VITE_CONTROLLER_PHONE_NUMBER: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}