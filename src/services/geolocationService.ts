import { Geolocation, Position } from '@capacitor/geolocation';

class GeolocationService {
  async getCurrentPosition(): Promise<Position | null> {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Current position:', position);
      return position;
    } catch (e) {
      console.error('Error getting location:', e);
      return null;
    }
  }
}

export const geolocationService = new GeolocationService();
