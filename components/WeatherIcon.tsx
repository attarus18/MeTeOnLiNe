import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudDrizzle, 
  CloudFog, 
  Moon, 
  CloudMoon 
} from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, className = "", size = 24 }) => {
  const isNight = iconCode.includes('n');
  const code = iconCode.replace('n', 'd'); // Normalize to check conditions primarily

  // Samsung style uses vibrant colors for icons
  const getIcon = () => {
    switch (code) {
      case '01d': // Clear sky
        return isNight 
          ? <Moon size={size} className={`text-yellow-100 ${className}`} fill="currentColor" /> 
          : <Sun size={size} className={`text-yellow-400 ${className}`} fill="currentColor" />;
      case '02d': // Few clouds
        return isNight
          ? <CloudMoon size={size} className={`text-gray-200 ${className}`} />
          : <div className="relative">
              <Sun size={size} className={`text-yellow-400 absolute -top-1 -right-1 opacity-80 ${className}`} fill="currentColor" />
              <Cloud size={size} className={`text-white relative z-10 ${className}`} fill="currentColor" />
            </div>;
      case '03d': // Scattered clouds
      case '04d': // Broken clouds
        return <Cloud size={size} className={`text-gray-200 ${className}`} fill="currentColor" />;
      case '09d': // Shower rain
      case '10d': // Rain
        return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
      case '11d': // Thunderstorm
        return <CloudLightning size={size} className={`text-yellow-300 ${className}`} />;
      case '13d': // Snow
        return <Snowflake size={size} className={`text-cyan-100 ${className}`} />;
      case '50d': // Mist
        return <CloudFog size={size} className={`text-gray-300 ${className}`} />;
      default:
        return <Sun size={size} className={`text-yellow-400 ${className}`} />;
    }
  };

  return (
    <div className="filter drop-shadow-md">
      {getIcon()}
    </div>
  );
};