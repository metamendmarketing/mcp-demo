'use client';

import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';

interface Dealer {
  id: string;
  dealerName: string;
  address: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
}

interface DealerMapProps {
  dealers: Dealer[];
  center?: { lat: number; lng: number };
  selectedDealerId?: string | null;
  onDealerSelect?: (id: string) => void;
  apiKey: string;
}

const MapController: React.FC<{ center?: { lat: number; lng: number }; selectedDealer?: Dealer }> = ({ center, selectedDealer }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedDealer?.lat && selectedDealer?.lng) {
      map.panTo({ lat: selectedDealer.lat, lng: selectedDealer.lng });
      map.setZoom(12);
    } else if (center) {
      map.panTo(center);
      map.setZoom(10);
    }
  }, [map, selectedDealer, center]);

  return null;
};

export const DealerMap: React.FC<DealerMapProps> = ({ 
  dealers, 
  center = { lat: 39.8283, lng: -98.5795 }, // Center of US
  selectedDealerId,
  onDealerSelect,
  apiKey
}) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const selectedDealer = dealers.find(d => d.id === selectedDealerId);

  return (
    <div className="w-full h-full min-h-[500px] rounded-[32px] overflow-hidden shadow-inner bg-slate-100 relative border border-slate-200">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={4}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          className="w-full h-full"
        >
          <MapController center={center} selectedDealer={selectedDealer} />
          
          {dealers.map((dealer) => (
            dealer.lat && dealer.lng && (
              <Marker
                key={dealer.id}
                position={{ lat: dealer.lat, lng: dealer.lng }}
                onClick={() => {
                  setOpenId(dealer.id);
                  if (onDealerSelect) onDealerSelect(dealer.id);
                }}
              />
            )
          ))}

          {openId && dealers.find(d => d.id === openId) && (
            <InfoWindow
              position={{ 
                lat: dealers.find(d => d.id === openId)!.lat!, 
                lng: dealers.find(d => d.id === openId)!.lng! 
              }}
              onCloseClick={() => setOpenId(null)}
            >
              <div className="p-1">
                <h4 className="font-bold text-slate-900">{dealers.find(d => d.id === openId)!.dealerName}</h4>
                <p className="text-xs text-slate-600">{dealers.find(d => d.id === openId)!.city}, {dealers.find(d => d.id === openId)!.stateProvince}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
