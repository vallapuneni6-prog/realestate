
export type LeadStatus = 'Prospect' | 'Qualified' | 'Site Visit' | 'Negotiation' | 'Under Contract' | 'Closed' | 'Lost';
export type UserRole = 'admin' | 'marketing';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  citizenship: string;
  netWorth: string;
  investmentBudget: string;
  status: LeadStatus;
  preferredPropertyTypes: string[];
  lastInteraction: string;
  notes: string;
  dealValue?: number; // Actual or estimated value
  probability?: number; // 0-100%
  assignedPropertyId?: string;
  aiInsights?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  numericPrice: number;
  sqft: number;
  beds: number;
  baths: number;
  image: string;
  amenities: string[];
  description: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'viewing';
  date: string;
  leadId: string;
  description: string;
}
