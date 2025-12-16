import React from 'react';
import { X, Wind, Droplets, Gauge, Leaf, TrendingUp, Info } from 'lucide-react';
import { WeatherData, ForecastData, ForecastItem } from '../types';

export type MetricType = 'wind' | 'humidity' | 'pressure' | 'aqi';

interface MetricDetailModalProps {
  type: MetricType | null;
  currentData: WeatherData | null;
  forecastData: ForecastData | null;
  onClose: () => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({ type, currentData, forecastData, onClose }) => {
  if (!type || !currentData) return null;

  // Configurazione in base al tipo
  const getConfig = () => {
    switch (type) {
      case 'wind':
        return {
          title: 'Vento',
          icon: <Wind size={32} />,
          unit: 'km/h',
          color: 'text-blue-400',
          bgGradient: 'from-blue-500/20 to-blue-600/5',
          description: 'Velocità e direzione del vento.',
          getValue: (item: any) => Math.round(item.wind.speed * 3.6),
          getExtra: (item: any) => (
            <div className="flex items-center gap-1 text-xs opacity-60">
               <span style={{ transform: `rotate(${item.wind.deg}deg)` }} className="inline-block">↓</span>
               Dir.
            </div>
          )
        };
      case 'humidity':
        return {
          title: 'Umidità',
          icon: <Droplets size={32} />,
          unit: '%',
          color: 'text-cyan-400',
          bgGradient: 'from-cyan-500/20 to-blue-600/5',
          description: 'Quantità di vapore acqueo nell\'aria.',
          getValue: (item: any) => item.main.humidity,
          getExtra: () => null
        };
      case 'pressure':
        return {
          title: 'Pressione',
          icon: <Gauge size={32} />,
          unit: 'hPa',
          color: 'text-purple-400',
          bgGradient: 'from-purple-500/20 to-indigo-600/5',
          description: 'Pressione atmosferica al livello del mare.',
          getValue: (item: any) => item.main.pressure,
          getExtra: () => null
        };
      case 'aqi':
        return {
          title: 'Qualità Aria',
          icon: <Leaf size={32} />,
          unit: 'AQI',
          color: 'text-green-400',
          bgGradient: 'from-green-500/20 to-emerald-600/5',
          description: 'Indice della qualità dell\'aria basato sugli inquinanti.',
          getValue: (item: any) => item.aqi || 0,
          getExtra: () => null
        };
    }
  };

  const config = getConfig();
  const currentValue = type === 'aqi' ? (currentData.aqi || 0) : config.getValue(currentData);

  // Filtriamo le previsioni per ottenere un dato al giorno (es. ore 12:00) per la settimana
  // Nota: AQI non ha forecast nella chiamata standard, quindi mostreremo solo attuale o un placeholder
  const dailyForecast = forecastData?.list.filter((_, index) => index % 8 === 4) || []; // Circa a metà giornata

  const getAQILabel = (val: number) => {
      if (val === 1) return { label: "Ottima", desc: "Aria pulita, ideale per attività all'aperto." };
      if (val === 2) return { label: "Buona", desc: "Qualità accettabile, rischio basso." };
      if (val === 3) return { label: "Discreta", desc: "Soggetti sensibili potrebbero avvertire fastidi." };
      if (val === 4) return { label: "Scadente", desc: "Evitare sforzi prolungati all'aperto." };
      return { label: "Pessima", desc: "Rischio serio per la salute. Restare al chiuso." };
  };

  const getAQIBarColor = (val: number) => {
      if (val === 1) return 'bg-green-400';
      if (val === 2) return 'bg-lime-400';
      if (val === 3) return 'bg-yellow-400';
      if (val === 4) return 'bg-orange-500';
      return 'bg-red-500';
  };

  return (
    <>
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
            onClick={onClose}
        />
        
        <div className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md bg-[#1e1e24] text-white z-[70] rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 pb-10 shadow-2xl animate-slide-up border-t border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-white/5 ${config.color}`}>
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{config.title}</h3>
                        <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Dettagli</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Current Value Hero */}
            <div className={`w-full bg-gradient-to-br ${config.bgGradient} rounded-3xl p-6 border border-white/5 mb-6 relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col items-center text-center">
                    {type === 'aqi' ? (
                        <>
                            <span className="text-5xl font-bold mb-2">{getAQILabel(currentValue).label}</span>
                            <div className="flex gap-1 mt-2 mb-4 w-full max-w-[200px] h-2 rounded-full bg-black/20 overflow-hidden">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`flex-1 ${currentValue >= i ? getAQIBarColor(i) : 'bg-white/10'}`} />
                                ))}
                            </div>
                            <p className="text-sm opacity-80 leading-relaxed px-4">{getAQILabel(currentValue).desc}</p>
                        </>
                    ) : (
                        <>
                           <div className="flex items-baseline gap-1">
                                <span className="text-7xl font-thin tracking-tighter">{currentValue}</span>
                                <span className="text-xl opacity-60 font-medium">{config.unit}</span>
                           </div>
                           <p className="mt-2 text-sm opacity-60">{config.description}</p>
                           {type === 'wind' && (
                                <div className="mt-4 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                                    <span style={{ transform: `rotate(${currentData.wind.deg}deg)` }}>⬇</span>
                                    Direzione: {currentData.wind.deg}°
                                </div>
                           )}
                        </>
                    )}
                </div>
            </div>

            {/* Weekly Forecast List */}
            {type !== 'aqi' && dailyForecast.length > 0 ? (
                <div>
                    <div className="flex items-center gap-2 mb-4 opacity-50 px-2">
                        <TrendingUp size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Andamento Settimanale</span>
                    </div>
                    
                    <div className="bg-[#2c2c35] rounded-3xl p-2 border border-white/5">
                        {dailyForecast.map((item: ForecastItem, idx: number) => {
                             const date = new Date(item.dt * 1000);
                             const dayName = date.toLocaleDateString('it-IT', { weekday: 'long' });
                             const val = config.getValue(item);

                             // Simple bar visualization
                             const maxVal = type === 'humidity' ? 100 : (type === 'pressure' ? 1050 : 100); // Approximate scales
                             const percent = Math.min((val / maxVal) * 100, 100);

                             return (
                                <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                                    <span className="w-24 capitalize font-medium text-white/80">{dayName}</span>
                                    
                                    {/* Visual Bar */}
                                    <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${type === 'humidity' ? 'bg-cyan-400' : type === 'pressure' ? 'bg-purple-400' : 'bg-blue-400'}`} 
                                            style={{ width: `${type === 'pressure' ? '100%' : percent + '%' }`, opacity: type === 'pressure' ? 0.5 : 1 }}
                                        ></div>
                                    </div>

                                    <div className="w-20 text-right font-bold text-lg flex justify-end gap-1">
                                        {val} <span className="text-sm font-normal opacity-50 mt-1">{config.unit}</span>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </div>
            ) : type === 'aqi' && (
                <div className="bg-[#2c2c35] rounded-3xl p-6 border border-white/5 flex items-start gap-4">
                    <Info className="text-white/40 shrink-0" />
                    <p className="text-sm text-white/60 leading-relaxed">
                        Le previsioni dettagliate sulla qualità dell'aria per i prossimi giorni non sono disponibili con il piano attuale. Monitora l'indice giornaliero per aggiornamenti.
                    </p>
                </div>
            )}
        </div>
    </>
  );
};