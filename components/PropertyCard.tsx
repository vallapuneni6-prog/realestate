
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <p className="text-[#d4af37] font-bold">{property.price}</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-500 mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {property.location}
        </p>

        <div className="flex justify-between items-center py-4 border-y border-gray-50 mb-4">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Beds</p>
            <p className="font-semibold">{property.beds}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Baths</p>
            <p className="font-semibold">{property.baths}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Size</p>
            <p className="font-semibold">{property.sqft.toLocaleString()} sqft</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-medium">
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-[10px] text-gray-400 px-2 py-1">+{property.amenities.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
