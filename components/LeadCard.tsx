
import React from 'react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Qualified': return 'bg-purple-100 text-purple-700';
      case 'Viewing': return 'bg-amber-100 text-amber-700';
      case 'Closed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      onClick={() => onSelect(lead)}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#d4af37] transition-colors">{lead.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {lead.location}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Budget</p>
          <p className="text-sm font-semibold text-gray-800">{lead.investmentBudget}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status</p>
          <p className="text-sm font-semibold text-gray-800">{lead.citizenship}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {lead.preferredPropertyTypes.map((type, i) => (
          <span key={i} className="text-[11px] px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LeadCard;
