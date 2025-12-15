import { WeatherData, ForecastData } from '../types';

// IMPORTANTE: Incolla qui la tua API Key di OpenWeatherMap
const API_KEY = 'a45c353554c25fb96f9bd128126a11c0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchAirQuality = async (lat: number, lon: number): Promise<number> => {
    try {
        const response = await fetch(
            `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        if (!response.ok) return 0; // Return 0 or undefined if fails, handled in UI
        const data = await response.json();
        // OpenWeather returns 1 (Good) to 5 (Very Poor)
        return data.list?.[0]?.main?.aqi || 0;
    } catch (error) {
        console.warn("AQI Fetch failed", error);
        return 0;
    }
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  if (!navigator.onLine) {
    throw new Error('Nessuna connessione internet. Controlla il Wi-Fi o i dati mobili.');
  }

  try {
    let query = city.trim();
    const lowerQuery = query.toLowerCase();
    
    // FIX: Risolve ambiguità per città italiane comuni che esistono anche in USA
    if (!lowerQuery.includes(',')) {
        const ambiguousCities = ['roma', 'rome', 'verona', 'milano', 'milan', 'napoli', 'naples', 'venezia', 'venice', 'firenze', 'florence', 'torino', 'turin'];
        if (ambiguousCities.includes(lowerQuery)) {
            query = `${query},IT`;
        }
    }

    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(query)}&units=metric&lang=it&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 404) throw new Error('Città non trovata. Prova ad aggiungere il paese (es. "Parigi, FR").');
      if (response.status === 401) throw new Error('API Key non valida. Controlla services/weatherService.ts');
      if (response.status === 429) throw new Error('Troppe richieste. Riprova più tardi.');
      throw new Error(`Errore meteo (${response.status})`);
    }
    
    const data = await response.json();
    
    // Fetch AQI separately using coords from weather data
    if (data.coord) {
        const aqi = await fetchAirQuality(data.coord.lat, data.coord.lon);
        data.aqi = aqi;
    }

    return data;
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!navigator.onLine) {
    throw new Error('Nessuna connessione internet.');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=it&appid=${API_KEY}`
    );

    if (!response.ok) {
       if (response.status === 401) throw new Error('API Key non valida.');
      throw new Error('Impossibile recuperare i dati meteo per questa posizione');
    }

    const data = await response.json();

    // Fetch AQI
    const aqi = await fetchAirQuality(lat, lon);
    data.aqi = aqi;

    return data;
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw error;
  }
};

export const fetchForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  if (!navigator.onLine) {
    throw new Error('Offline');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=it&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Previsioni non disponibili');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};