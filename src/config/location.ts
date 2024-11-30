import dotenv from "dotenv";

dotenv.config()

export const locationConfig = {
    lat: import.meta.env.VITE_CABIN_LAT,
    long: import.meta.env.VITE_CABIN_LONG
} as const;