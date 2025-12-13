import React from 'react';
import { X, Wind, Droplets, Gauge, CloudRain, Eye, ThermometerSun } from 'lucide-react';
import { ForecastItem } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface ForecastDetailModalProps {
  item: ForecastItem | null;
  fullForecast: ForecastItem[];
  onClose: () => void;
}

export const ForecastDetailModal: React.FC<ForecastDetailModalProps> = ({ item, fullForecast, onClose }) => {
  if (!item) return null;

  // Format date and time
  const date = new Date(item.dt * 1000);
  const dayName = date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  const time = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  // Filter for hourly trend of the selected day
  const selectedDayString = date.toDateString();
  const hourlyTrend = fullForecast.filter(f => 
    new Date(f.dt * 1000).toDateString() === selectedDayString
  );

  return (
    <>
        {/* Backdrop */}
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
            onClick={onClose}
        />
        
        {/* Modal Card - Bottom Sheet on Mobile, Center Modal on Desktop */}
        <div className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md bg-[#1e1e24] text-white z-[70] rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 pb-10 shadow-2xl transform transition-all duration-300 animate-slide-up border-t border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Handle bar for mobile feel */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-semibold capitalize tracking-tight">{dayName}</h3>
                    <p className="text-white/60 font-medium text-lg">{time}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Main Info */}
            <div className="flex flex-col items-center mb-6 relative">
                <div className="filter drop-shadow-xl scale-110 mb-2">
                    <WeatherIcon iconCode={item.weather[0].icon} size={100} />
                </div>
                <div className="text-6xl font-thin tracking-tighter mb-1">{Math.round(item.main.temp)}°</div>
                <div className="text-xl capitalize text-white/80 font-medium bg-white/5 px-4 py-1 rounded-full border border-white/5">
                    {item.weather[0].description}
                </div>
            </div>

            {/* Hourly Trend Section */}
            {hourlyTrend.length > 0 && (
                <div className="w-full mb-6">
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-3 px-1">Andamento Giornaliero</p>
                    <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                        {hourlyTrend.map((hourItem, idx) => (
                            <div key={idx} className="flex flex-col items-center min-w-[3.5rem] bg-white/5 p-2.5 rounded-2xl border border-white/5 shrink-0">
                                <span className="text-xs opacity-70 mb-1">
                                    {new Date(hourItem.dt * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <WeatherIcon iconCode={hourItem.weather[0].icon} size={24} className="my-1" />
                                <span className="font-semibold text-lg">{Math.round(hourItem.main.temp)}°</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grid Details */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#2c2c35] p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                    <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-full">
                        <Droplets size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Umidità</div>
                        <div className="font-semibold text-lg">{item.main.humidity}%</div>
                    </div>
                </div>

                <div className="bg-[#2c2c35] p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                    <div className="p-2.5 bg-green-500/20 text-green-400 rounded-full">
                        <Wind size={20} />
                    </div>
                    <div>
                         <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Vento</div>
                         <div className="font-semibold text-lg">{Math.round(item.wind.speed * 3.6)} <span className="text-sm font-normal text-white/60">km/h</span></div>
                    </div>
                </div>

                 <div className="bg-[#2c2c35] p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                    <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-full">
                        <Gauge size={20} />
                    </div>
                    <div>
                         <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Pressione</div>
                         <div className="font-semibold text-lg">{item.main.pressure} <span className="text-sm font-normal text-white/60">hPa</span></div>
                    </div>
                </div>

                 <div className="bg-[#2c2c35] p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                    <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                        <CloudRain size={20} />
                    </div>
                    <div>
                         <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Prob. Pioggia</div>
                         <div className="font-semibold text-lg">{Math.round(item.pop * 100)}%</div>
                    </div>
                </div>
            </div>

            {/* Extra Row */}
             <div className="mt-3 bg-[#2c2c35] p-4 rounded-2xl flex justify-between items-center px-8 border border-white/5">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-[10px] text-white/50 uppercase font-bold">
                        <ThermometerSun size={12} /> Percepita
                    </div>
                    <span className="font-semibold text-xl">{Math.round(item.main.feels_like)}°</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                 <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-[10px] text-white/50 uppercase font-bold">
                        <Eye size={12} /> Visibilità
                    </div>
                    <span className="font-semibold text-xl">{(item.visibility / 1000).toFixed(1)} <span className="text-sm font-normal text-white/60">km</span></span>
                </div>
            </div>
        </div>
    </>
  );
};