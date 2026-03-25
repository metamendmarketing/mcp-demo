'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Search, Navigation, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
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
    let searchCoords = coords;

    try {
      // If no coords but query exists, geocode it first to ensure map updates
      if (!searchCoords && query) {
        const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          searchCoords = geoData.results[0].geometry.location;
        }
      }

      if (searchCoords) {
        setMapCenter(searchCoords);
      }

      const res = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: 'marquis',
          postalCode: query,
          lat: searchCoords?.lat,
          lng: searchCoords?.lng,
          radius: 200
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setDealers(data.dealers);
      
      // If no dealers found but we have coords, the map is already centered.
      // If dealers found, map already centers on the first one or we keep searchCoords.
      
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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
       {/* Official Marquis Header */}
       <header className="w-full bg-[#181818] py-4 border-b border-white/5 sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-8 group cursor-pointer">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-500" />
             <div className="hidden lg:flex flex-col text-[9px] uppercase font-black tracking-[0.2em] text-white/50 border-l border-white/20 pl-8 h-10 justify-center leading-tight">
               <span>The Ultimate</span>
               <span>Hot Tub</span>
               <span>Experience®</span>
             </div>
          </Link>
          
          <nav className="hidden xl:flex items-center gap-12 text-[11px] uppercase font-black tracking-[0.1em] text-white">
            <Link href="/products" className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Hot<br/>Tubs</Link>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center text-marquis-green">Dealers</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors flex items-center gap-2">Menu <span className="text-lg leading-none">☰</span></span>
          </nav>

          <div className="flex gap-4">
            <button className="bg-[#88a65e] px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white hover:brightness-110 active:scale-95 transition-all leading-tight text-center">
              Find<br/>Dealer
            </button>
          </div>
        </div>
      </header>

      {/* Subheader / Breadcrumbs */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex gap-3 overflow-x-auto whitespace-nowrap italic items-center">
          <Link href="/" className="hover:text-marquis-blue cursor-pointer transition-colors">Home</Link> <span className="text-slate-300">/</span>
          <Link href="/products" className="hover:text-marquis-blue cursor-pointer transition-colors">Products</Link> <span className="text-slate-300">/</span>
          <span className="text-marquis-blue font-black underline decoration-marquis-blue/30 decoration-2 underline-offset-4">Dealer Locator</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row flex-1 min-h-0">
          
          {/* Results Side */}
          <aside className="w-full md:w-[450px] flex flex-col border-r border-slate-100 bg-white">
            <div className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-marquis-blue/10 p-2 rounded-xl">
                   <MapPin className="w-5 h-5 text-marquis-blue" />
                 </div>
                 <h2 className="text-xl font-black italic uppercase text-slate-900 leading-none">Authorized Dealers</h2>
              </div>
              
              <div className="relative group mb-4">
                <input
                  type="text"
                  placeholder="Enter City or Zip Code"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-marquis-blue transition-all"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && performSearch(zip)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-marquis-blue transition-colors" />
                <button 
                  onClick={() => performSearch(zip)}
                  className="absolute right-2 top-2 bottom-2 bg-marquis-blue text-white px-4 rounded-xl text-[10px] font-black uppercase italic hover:bg-slate-800 transition-all flex items-center justify-center min-w-[80px]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEARCH'}
                </button>
              </div>

              <button 
                onClick={handleUseMyLocation}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all"
              >
                <Navigation className="w-3 h-3" />
                Use My Location
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
              {loading && dealers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Searching nearby...</p>
                </div>
              ) : dealers.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {dealers.length} {dealers.length === 1 ? 'Station' : 'Stations'} Found
                  </div>
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
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black uppercase text-slate-900 mb-2">Distance Gap</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    No authorized dealers found within 200 miles. Try expanding your search or look in a neighboring city.
                  </p>
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                  <h3 className="text-sm font-black uppercase text-slate-900 mb-2">Find Your Nearest Station</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                    Enter your location to reveal the nearest Marquis authorized service and sales centers.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Try Demo Locations:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['90210', 'Portland', 'Chicago', 'Miami'].map(loc => (
                        <button 
                          key={loc}
                          onClick={() => { setZip(loc); performSearch(loc); }}
                          className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 hover:border-marquis-blue hover:text-marquis-blue transition-all"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Map Side */}
          <main className="flex-1 relative bg-slate-100 flex flex-col min-h-[600px]">
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

      {/* Corporate Footer */}
      <footer className="w-full bg-[#0a0a0a] py-12 mt-10 border-t border-white/10 relative overflow-hidden shrink-0">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
          <div className="col-span-2">
            <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 mb-8 opacity-80" />
            <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-sm italic">
              Marquis® is an employee-owned company that manufactures extraordinary hot tubs and swim spas in Nevada, USA. 
            </p>
          </div>
          <div>
             <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10 italic">Digital Connection</h4>
             <div className="flex flex-col gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                <span>Facebook Protocol</span>
                <span>Instagram Insights</span>
             </div>
          </div>
          <div>
             <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10 italic">Ownership Care</h4>
             <ul className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black space-y-5">
                <li>Warranty & Registration</li>
                <li>Contact Engineering</li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">
          <span>© 2024 Marquis Spas.</span>
          <span>Crafted in Nevada, USA</span>
        </div>
      </footer>
    </main>
  );
};

export default function DealerLocatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocatorContent />
    </Suspense>
  );
}
