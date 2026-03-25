'use client';

import React, { useState } from 'react';
import { Phone, Envelope, Globe, MapPin, Clock, CaretDown, CaretUp, NavigationArrow } from '@phosphor-icons/react';
import { clsx } from 'clsx';

interface Dealer {
  id: string;
  dealerName: string;
  address: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  hours: any;
  distanceMiles: number | null;
}

interface DealerCardProps {
  dealer: Dealer;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const DealerCard: React.FC<DealerCardProps> = ({ dealer, isSelected, onSelect }) => {
  const [showHours, setShowHours] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${dealer.dealerName}, ${dealer.address}, ${dealer.city}, ${dealer.stateProvince} ${dealer.postalCode}`
  )}`;

  return (
    <div 
      className={clsx(
        "group relative bg-white border transition-all duration-300 rounded-[32px] p-6 mb-4 cursor-pointer overflow-hidden",
        isSelected ? "border-slate-900 ring-1 ring-slate-900 shadow-xl" : "border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black italic uppercase text-slate-900 leading-tight tracking-tight mb-1">
            {dealer.dealerName}
          </h3>
          {dealer.distanceMiles !== null && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
              {dealer.distanceMiles.toFixed(1)} miles away
            </span>
          )}
        </div>
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <NavigationArrow className="w-5 h-5" weight="fill" />
        </a>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
          <div className="text-sm text-slate-600">
            {dealer.address}<br />
            {dealer.city}, {dealer.stateProvince} {dealer.postalCode}
          </div>
        </div>

        {dealer.phone && (
          <a 
            href={`tel:${dealer.phone}`}
            className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-5 h-5 text-slate-400" weight="bold" />
            {dealer.phone}
          </a>
        )}

        {dealer.email && (
          <a 
            href={`mailto:${dealer.email}`}
            className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Envelope className="w-5 h-5 text-slate-400" weight="bold" />
            {dealer.email}
          </a>
        )}

        {dealer.website && (
          <a 
            href={dealer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-5 h-5 text-slate-400" weight="bold" />
            Visit Website
          </a>
        )}
      </div>

      {dealer.hours && (
        <div className="border-t border-slate-100 pt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowHours(!showHours);
            }}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" weight="bold" />
              View Store Hours
            </span>
            {showHours ? <CaretUp className="w-4 h-4" weight="bold" /> : <CaretDown className="w-4 h-4" weight="bold" />}
          </button>
          
          {showHours && (
            <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-slate-500">
              <div className="font-bold">Monday</div><div>{dealer.hours.mon}</div>
              <div className="font-bold">Tuesday</div><div>{dealer.hours.tue}</div>
              <div className="font-bold">Wednesday</div><div>{dealer.hours.wed}</div>
              <div className="font-bold">Thursday</div><div>{dealer.hours.thu}</div>
              <div className="font-bold">Friday</div><div>{dealer.hours.fri}</div>
              <div className="font-bold">Saturday</div><div>{dealer.hours.sat}</div>
              <div className="font-bold">Sunday</div><div>{dealer.hours.sun}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
