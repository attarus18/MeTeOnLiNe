import { WeatherData, ForecastData } from '../types';

const API_KEY = 'a45c353554c25fb96f9bd128126a11c0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  if (!navigator.onLine) {
    throw new Error('Nessuna connessione internet. Controlla il Wi-Fi o i dati mobili.');
  }

  try {
    // Added lang=it for Italian descriptions
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city.trim())}&units=metric&lang=it&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 404) throw new Error('Città non trovata. Controlla il nome.');
      if (response.status === 401) throw new Error('API Key non valida. Controlla la configurazione.');
      if (response.status === 429) throw new Error('Troppe richieste. Riprova più tardi.');
      throw new Error(`Errore meteo (${response.status})`);
    }
    
    const data = await response.json();
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

    return await response.json();
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
      // Don't throw a blocking error for forecast, just log it essentially in the UI by returning null or handling upstream
      throw new Error('Previsioni non disponibili');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};