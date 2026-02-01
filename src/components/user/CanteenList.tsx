import React from 'react';
import { canteens } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';

export const CanteenList: React.FC = () => {
  const { setSelectedCanteenId, user } = useApp();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Canteen</h2>
        <p className="text-gray-500 mt-1">Welcome, {user?.name}! Select a canteen to view menu</p>
      </div>

      <div className="grid gap-4">
        {canteens.map((canteen) => (
          <button
            key={canteen.id}
            onClick={() => canteen.isOpen && setSelectedCanteenId(canteen.id)}
            disabled={!canteen.isOpen}
            className={`w-full bg-white rounded-2xl shadow-md overflow-hidden text-left transition-all ${
              canteen.isOpen
                ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex">
              <div className="w-32 h-32 bg-gray-200 flex-shrink-0">
                <img
                  src={canteen.image}
                  alt={canteen.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400';
                  }}
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{canteen.name}</h3>
                    {canteen.isOpen ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Open
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Clock size={12} />
                        Closed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={14} />
                    {canteen.location}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-medium">{canteen.rating}</span>
                  </div>
                  {canteen.isOpen && (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
