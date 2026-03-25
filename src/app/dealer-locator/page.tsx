'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Search, Navigation, ChevronLeft, Loader2 } from 'lucide-react';
import { DealerCard } from '@/components/dealer/DealerCard';
import { DealerMap } from '@/components/dealer/DealerMap';
import { clsx } from 'clsx';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBJTMfCxb6VFz1vIK_7Jb52JZuDj_J2tks';

const LocatorContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [zip, setZip] = useState(searchParams.get('zip') || '');
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 });
  const [searchTriggered, setSearchTriggered] = useState(false);

  const autocompleteInput = useRef<HTMLInputElement>(null);

  const performSearch = async (query?: string, coords?: { lat: number, lng: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: 'marquis',
          postalCode: query,
          lat: coords?.lat,
          lng: coords?.lng,
          radius: 200
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setDealers(data.dealers);
      if (coords) {
        setMapCenter(coords);
      } else if (data.dealers.length > 0 && data.dealers[0].lat && data.dealers[0].lng) {
        setMapCenter({ lat: data.dealers[0].lat, lng: data.dealers[0].lng });
      }
      setSearchTriggered(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('zip')) {
      performSearch(searchParams.get('zip')!);
    }
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        performSearch(undefined, coords);
      },
      (err) => {
        setError('Permission denied. Please enter your location manually.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Dealer Locator
          </h1>
        </div>
        
        <div className="flex-1 max-w-2xl mx-12 relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          </div>
          <input
            ref={autocompleteInput}
            type="text"
            placeholder="Search by city or zip code..."
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 rounded-full py-4 pl-14 pr-32 outline-none border border-transparent focus:border-white transition-all text-lg"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(zip)}
          />
          <button 
            onClick={() => performSearch(zip)}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEARCH'}
          </button>
        </div>

        <button 
          onClick={handleUseMyLocation}
          className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-sm font-bold uppercase tracking-wider"
        >
          <Navigation className="w-4 h-4" />
          Use My Location
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Results Pane */}
        <aside className="w-[450px] bg-white border-r border-slate-200 overflow-y-auto p-8 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              Results Found
            </h2>
            <div className="text-2xl font-black text-slate-900">
              {dealers.length} {dealers.length === 1 ? 'Authorized Dealer' : 'Authorized Dealers'}
            </div>
          </div>

          {loading && dealers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p>Finding the best dealers for you...</p>
            </div>
          ) : dealers.length > 0 ? (
            <div className="space-y-4">
              {dealers.map((dealer) => (
                <DealerCard 
                  key={dealer.id} 
                  dealer={dealer} 
                  isSelected={selectedId === dealer.id}
                  onSelect={() => setSelectedId(dealer.id)}
                />
              ))}
            </div>
          ) : searchTriggered ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Dealers Nearby</h3>
              <p className="text-slate-500">
                We couldn't find any dealers within 200 miles of that location. Try a different zip code or expand your search.
              </p>
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to find your spa?</h3>
              <p className="text-slate-500">
                Enter your zip code above to locate your nearest authorized Marquis dealer.
              </p>
            </div>
          )}
        </aside>

        {/* Map Pane */}
        <main className="flex-1 p-8">
          <DealerMap 
            dealers={dealers} 
            apiKey={GOOGLE_MAPS_API_KEY} 
            center={mapCenter}
            selectedDealerId={selectedId}
            onDealerSelect={setSelectedId}
          />
        </main>
      </div>
    </div>
  );
};

export default function DealerLocatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocatorContent />
    </Suspense>
  );
}
