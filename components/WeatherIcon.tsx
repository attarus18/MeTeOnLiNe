import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  Moon, 
  CloudMoon 
} from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  className?: string;
  size?: number;
  isHero?: boolean;
  windSpeed?: number; // km/h
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  className = "", 
  size = 24, 
  isHero = false,
  windSpeed = 0 
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Quando cambia l'icona o il vento, resettiamo l'errore per riprovare a caricare l'immagine PNG
  useEffect(() => {
    setImgError(false);
  }, [iconCode, windSpeed]);

  const isNight = iconCode.includes('n');
  const code = iconCode.replace('n', 'd'); // Normalizziamo per il controllo

  // --- LOGICA SELEZIONE IMMAGINE ---
  let imageName = '';

  // 1. Controllo Vento Forte (> 30km/h)
  if (windSpeed > 30) {
      imageName = isNight ? 'vento_notte.png' : 'vento.png';
  } else {
      // 2. Mappatura Codici Meteo standard su file PNG
      switch (code) {
          case '01d': // Sereno
              imageName = isNight ? 'luna.png' : 'sole.png';
              break;
          case '02d': // Poco nuvoloso
          case '03d': // Nubi sparse
          case '04d': // Nuvoloso
              imageName = isNight ? 'nuvoloso_notte.png' : 'nuvoloso.png';
              break;
          case '09d': // Pioggia sparsa
          case '10d': // Pioggia
              imageName = isNight ? 'pioggia_notte.png' : 'pioggia.png';
              break;
          case '11d': // Temporale
              imageName = isNight ? 'temporale_notte.png' : 'temporale.png';
              break;
          case '13d': // Neve
              imageName = isNight ? 'neve_notte.png' : 'neve.png';
              break;
          case '50d': // Nebbia
              imageName = isNight ? 'nebbia_notte.png' : 'nebbia.png';
              break;
          default:
              imageName = isNight ? 'luna.png' : 'sole.png';
      }
  }

  // COSTRUZIONE PERCORSO ROBUSTA
  // FIX: Gestiamo il caso in cui import.meta.env non sia definito
  // per evitare il crash "Cannot read properties of undefined"
  let baseUrl = './';
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.BASE_URL) {
       // @ts-ignore
       baseUrl = import.meta.env.BASE_URL;
    }
  } catch (e) {
    // Ignora errori e usa il default
  }
    
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const imageSrc = `${cleanBaseUrl}${imageName}`;

  // --- RENDER ---
  
  // Se non abbiamo ancora riscontrato errori di caricamento per questa specifica icona, proviamo a mostrare l'immagine
  if (!imgError && imageName) {
      return (
          <img 
            key={imageSrc} // La key forza React a ricreare l'elemento se cambia src
            src={imageSrc} 
            alt={`Meteo: ${imageName}`} 
            className={`object-contain ${isHero ? 'drop-shadow-2xl animate-float' : 'drop-shadow-md'} ${className}`}
            style={{ width: size, height: size }}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                // console.warn(`Errore caricamento immagine: ${target.src}`);
                setImgError(true);
            }}
          />
      );
  }

  // --- FALLBACK (ICONE VETTORIALI) ---
  // Vengono mostrate SOLO se l'immagine PNG fallisce il caricamento
  const getFallbackIcon = () => {
    switch (code) {
      case '01d': 
        return isNight 
          ? <Moon size={size} className={`text-yellow-100 ${className}`} fill="currentColor" /> 
          : <Sun size={size} className={`text-yellow-400 ${className}`} fill="currentColor" />;
      case '02d': 
        return isNight
          ? <CloudMoon size={size} className={`text-gray-200 ${className}`} />
          : <div className="relative">
              <Sun size={size} className={`text-yellow-400 absolute -top-1 -right-1 opacity-80 ${className}`} fill="currentColor" />
              <Cloud size={size} className={`text-white relative z-10 ${className}`} fill="currentColor" />
            </div>;
      case '03d':
      case '04d':
        return <Cloud size={size} className={`text-gray-200 ${className}`} fill="currentColor" />;
      case '09d': 
      case '10d': 
        return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
      case '11d':
        return <CloudLightning size={size} className={`text-yellow-300 ${className}`} />;
      case '13d':
        return <Snowflake size={size} className={`text-cyan-100 ${className}`} />;
      case '50d':
        return <CloudFog size={size} className={`text-blue-100 opacity-80 ${className}`} />;
      default:
        return <Sun size={size} className={`text-yellow-400 ${className}`} />;
    }
  };

  return (
    <div className="filter drop-shadow-md relative select-none flex items-center justify-center">
      {getFallbackIcon()}
    </div>
  );
};