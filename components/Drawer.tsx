import React, { useState } from 'react';
import { X, Search, MapPin, Trash2, Navigation } from 'lucide-react';
import { FavoriteCity } from '../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteCity[];
  onSelectCity: (cityName: string) => void;
  onSelectFavorite: (index: number) => void; // Navigates to existing favorite
  onRemoveFavorite: (id: number) => void;
  onUseCurrentLocation: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  favorites, 
  onSelectCity,
  onSelectFavorite,
  onRemoveFavorite,
  onUseCurrentLocation
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSelectCity(query);
      setQuery('');
      // onClose is handled by the parent
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#1e1e24] text-white z-50 transform transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-6 pb-2 flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Gestisci località</h2>
            <div className="flex gap-2">
                <button onClick={onClose} className="p-2 text-white/70 hover:bg-white/10 rounded-full transition-colors">
                  <X size={22} />
                </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-white/40 group-focus-within:text-blue-400 transition-colors" size={18} />
              </div>
              <input
                type="text"
                placeholder="Aggiungi città..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#2c2c35] border-none rounded-[1.5rem] py-3.5 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
              />
            </form>
          </div>

          {/* Locations List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 no-scrollbar">
            
            {/* Current Location Button */}
            <div 
              onClick={onUseCurrentLocation}
              className="bg-[#2c2c35] rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer hover:bg-[#363640] transition-colors active:scale-[0.98] border border-transparent hover:border-blue-500/30"
            >
              <div className="bg-blue-500/20 p-2 rounded-full text-blue-400">
                <Navigation size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Posizione corrente</span>
                <span className="text-xs text-white/50 font-medium">GPS</span>
              </div>
            </div>

            <div className="h-px bg-white/5 mx-2 my-2" />
            <p className="px-2 text-xs font-bold text-white/30 uppercase tracking-widest">Preferiti</p>

            {/* Favorites */}
            {favorites.length === 0 ? (
              <div className="text-center py-6 opacity-30 flex flex-col items-center">
                <p className="text-sm">Nessuna città salvata</p>
              </div>
            ) : (
              favorites.map((city, idx) => (
                <div key={city.id} className="group relative overflow-hidden bg-[#2c2c35] rounded-[1.5rem] p-1 transition-all active:scale-[0.98]">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => {
                        // 0 is GPS, so 1st favorite is index 1
                        onSelectFavorite(idx + 1);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">{city.name}</span>
                      <span className="text-xs text-white/50 font-medium">{city.country}</span>
                    </div>
                    <MapPin size={20} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city.id);
                    }}
                    className="absolute top-0 right-0 h-full w-16 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          
           {/* Footer */}
           <div className="p-6 text-center text-xs text-white/20">
              © Galaxy Weather 2024
           </div>
        </div>
      </div>
    </>
  );
};