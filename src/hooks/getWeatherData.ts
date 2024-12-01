interface Geometry {
    coordinates: number[];
    type: string;
}

interface Units {
    air_pressure_at_sea_level: string;
    air_temperature: string;
    air_temperature_max: string;
    air_temperature_min: string;
    cloud_area_fraction: string;
    cloud_area_fraction_high: string;
    cloud_area_fraction_low: string;
    cloud_area_fraction_medium: string;
    dew_point_temperature: string;
    fog_area_fraction: string;
    precipitation_amount: string;
    precipitation_amount_max: string;
    precipitation_amount_min: string;
    probability_of_precipitation: string;
    probability_of_thunder: string;
    relative_humidity: string;
    ultraviolet_index_clear_sky_max: string;
    wind_from_direction: string;
    wind_speed: string;
    wind_speed_of_gust: string;
}

interface Meta {
    units: Units;
    updated_at: string;
}

interface Details {
    air_pressure_at_sea_level?: number;
    air_temperature?: number;
    cloud_area_fraction?: number;
    cloud_area_fraction_high?: number;
    cloud_area_fraction_low?: number;
    cloud_area_fraction_medium?: number;
    dew_point_temperature?: number;
    fog_area_fraction?: number;
    relative_humidity?: number;
    wind_from_direction?: number;
    wind_speed?: number;
    wind_speed_of_gust?: number;
    air_temperature_max?: number;
    air_temperature_min?: number;
    precipitation_amount?: number;
    precipitation_amount_max?: number;
    precipitation_amount_min?: number;
    probability_of_precipitation?: number;
    probability_of_thunder?: number;
    ultraviolet_index_clear_sky_max?: number;
}

interface Summary {
    symbol_code: string;
}

interface DataPeriod {
    details: Details;
    summary?: Summary;
}

interface Instant {
    details: Details;
}

interface Data {
    instant: Instant;
    next_12_hours?: DataPeriod;
    next_1_hours?: DataPeriod;
    next_6_hours?: DataPeriod;
}

interface Timeseries {
    data: Data;
    time: string;
}

interface Properties {
    meta: Meta;
    timeseries: Timeseries[];
}

interface WeatherData {
    geometry: Geometry;
    properties: Properties;
    type: string;
}

export async function fetchWeatherDataJson(lat: number, lon: number): Promise<WeatherData> {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Forsooth, a scourge upon our fetch quest: ' + response.statusText);
    }
    const jsonData: WeatherData = await response.json();
    return jsonData;
}