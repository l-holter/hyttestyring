import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

export interface HeatingRecord {
  id: string;
  created: string;
  updated: string;
  isHeatingOn: boolean;
  temperatureInside: number | null;
  lastCommand: string;
  lastCommandSuccess: boolean;
}

export const getLatestHeatingState = async () => {
  try {
    const records = await pb.collection('heating_states').getList(1, 1, {
      sort: '-created',
    });
    return records.items[0] as unknown as HeatingRecord;
  } catch (error) {
    console.error('Failed to fetch heating state:', error);
    return null;
  }
};

export const createHeatingState = async (data: Omit<HeatingRecord, 'id' | 'created' | 'updated'>) => {
  try {
    return await pb.collection('heating_states').create(data);
  } catch (error) {
    console.error('Failed to create heating state:', error);
    throw error;
  }
};