
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import LeadCard from './components/LeadCard';
import PropertyCard from './components/PropertyCard';
import { Lead, Property, User, UserRole, LeadStatus } from './types';
import { INITIAL_LEADS, LUXURY_PROPERTIES } from './constants';
import { getLeadInsights, generateOutreachEmail } from './services/gemini';

const PIPELINE_STAGES: LeadStatus[] = ['Prospect', 'Qualified', 'Site Visit', 'Negotiation', 'Under Contract'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u1',
    name: 'Alexander Sterling',
    role: 'admin',
  });

  const handleRoleSwitch = (role: UserRole) => {
    setCurrentUser({
      ...currentUser,
      role,
      name: role === 'admin' ? 'Alexander Sterling' : 'Sarah Marketing',
    });
    const adminOnlyTabs = ['ai', 'pipeline', 'sales'];
    if (role === 'marketing' && adminOnlyTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => 
      l.id === leadId ? { 
        ...l, 
        status: newStatus,
        dealValue: (newStatus === 'Closed' || newStatus === 'Negotiation') ? (l.dealValue || 5000000) : l.dealValue,
        probability: newStatus === 'Closed' ? 100 : l.probability
      } : l
    ));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveTab('leads');
    setAiInsight(null);
    setGeneratedEmail(null);
  };

  const fetchAiInsights = async (lead: Lead) => {
    if (currentUser.role !== 'admin') return;
    setIsAiLoading(true);
    const result = await getLeadInsights(lead, LUXURY_PROPERTIES);
    setAiInsight(result || "Unable to generate insights.");
    setIsAiLoading(false);
  };

  const handleGenerateEmail = async (lead: Lead) => {
    setIsAiLoading(true);
    const property = LUXURY_PROPERTIES[0]; 
    const result = await generateOutreachEmail(lead, property);
    setGeneratedEmail(result || "Unable to generate email.");
    setIsAiLoading(false);
  };

  const isAdmin = currentUser.role === 'admin';

  // Analytics
  const closedSales = useMemo(() => leads.filter(l => l.status === 'Closed'), [leads]);
  const totalClosedValue = useMemo(() => closedSales.reduce((sum, l) => sum + (l.dealValue || 0), 0), [closedSales]);
  const activePipelineValue = useMemo(() => leads
    .filter(l => l.status !== 'Closed' && l.status !== 'Lost')
    .reduce((sum, l) => sum + ((l.dealValue || 0) * (l.probability || 0) / 100), 0), [leads]);

  return (
    <div className="flex min-h-screen bg-[#fcfbf7] text-gray-900 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
      />
      
      <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
        <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-50">
          <div>
            <h2 className="text-3xl font-bold tracking-tight serif">
              {activeTab === 'dashboard' && 'Executive Overview'}
              {activeTab === 'pipeline' && 'Mandate Funnel'}
              {activeTab === 'leads' && (selectedLead ? `Client: ${selectedLead.name}` : 'Client Registry')}
              {activeTab === 'properties' && 'Inventory Management'}
              {activeTab === 'sales' && 'Closing Ledger'}
              {activeTab === 'ai' && 'Intelligence Hub'}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="flex gap-4">
                <div className="text-right hidden xl:block">
                  <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Global Pipeline</p>
                  <p className="text-lg font-bold serif text-[#d4af37]">${(totalClosedValue + activePipelineValue / 1000000).toFixed(1)}M</p>
                </div>
             </div>
             <button className="bg-[#1a1c2c] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-[#1a1c2c]/20">
               New Entry
             </button>
          </div>
        </header>

        <div className="p-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] text-[#d4af37] uppercase tracking-widest mb-2 font-bold">Closed Revenue</p>
                  <p className="text-4xl font-bold serif text-gray-900 mb-1">${(totalClosedValue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-600 font-medium">↑ 14% vs last quarter</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Weighted Pipeline</p>
                  <p className="text-4xl font-bold serif text-gray-900 mb-1">${(activePipelineValue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">Based on probability</p>
                </div>
                <div className="bg-[#1a1c2c] p-8 rounded-[2rem] text-white shadow-2xl">
                  <p className="text-[10px] text-[#d4af37] uppercase tracking-widest mb-2 font-bold">Active Mandates</p>
                  <p className="text-4xl font-bold serif mb-1">{leads.filter(l => l.status !== 'Closed').length}</p>
                  <p className="text-xs text-gray-400">High-intent clients</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Avg. Ticket Size</p>
                  <p className="text-4xl font-bold serif text-gray-900 mb-1">$12.5M</p>
                  <p className="text-xs text-blue-600 font-medium">Tier-1 HNI only</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                   <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100">
                      <div>
                         <h3 className="text-xl font-bold serif">Conversion Levels</h3>
                         <p className="text-xs text-gray-500">Prospect to Sale movement</p>
                      </div>
                      <div className="flex gap-2">
                        {PIPELINE_STAGES.map(stage => (
                          <div key={stage} className="flex flex-col items-center gap-1">
                             <div className="w-8 h-12 bg-gray-50 rounded border border-gray-100 flex items-end overflow-hidden">
                                <div 
                                  className="w-full bg-[#d4af37]" 
                                  style={{ height: `${(leads.filter(l => l.status === stage).length / leads.length) * 100}%` }}
                                ></div>
                             </div>
                             <span className="text-[8px] uppercase font-bold text-gray-400">{stage.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                    <h3 className="text-xl font-bold serif ml-2">Priority Deal Flow</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {leads.filter(l => l.status === 'Negotiation' || l.status === 'Under Contract').map(lead => (
                        <LeadCard key={lead.id} lead={lead} onSelect={handleLeadSelect} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xl font-bold serif">Signature Asset</h3>
                  <PropertyCard property={LUXURY_PROPERTIES[1]} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-5 gap-6 min-h-[70vh]">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage} className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-4 py-2 bg-white/50 border border-gray-100 rounded-xl">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">{stage}</span>
                    <span className="text-xs font-bold text-[#d4af37]">{leads.filter(l => l.status === stage).length}</span>
                  </div>
                  <div className="flex-1 bg-gray-50/50 rounded-2xl p-3 border border-dashed border-gray-200 space-y-4">
                    {leads.filter(l => l.status === stage).map(lead => (
                      <div 
                        key={lead.id} 
                        onClick={() => handleLeadSelect(lead)}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                      >
                         <h4 className="font-bold text-sm group-hover:text-[#d4af37] transition-colors">{lead.name}</h4>
                         <p className="text-[10px] text-gray-400 mt-1">{lead.location}</p>
                         <div className="mt-3 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-700">{lead.investmentBudget}</span>
                            <div className="flex items-center gap-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                               <span className="text-[9px] font-bold uppercase text-gray-400">{lead.probability}% Prob.</span>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="flex gap-12">
              <div className={`${selectedLead ? 'w-1/3' : 'w-full'} space-y-6 transition-all duration-500`}>
                <div className="grid grid-cols-1 gap-6">
                  {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onSelect={handleLeadSelect} />
                  ))}
                </div>
              </div>

              {selectedLead && (
                <div className="flex-1 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl min-h-[600px] animate-fadeIn">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                           {selectedLead.status}
                         </span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedLead.citizenship}</span>
                      </div>
                      <h3 className="text-5xl font-bold text-gray-900 mb-4 serif">{selectedLead.name}</h3>
                      <div className="flex gap-8 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{selectedLead.email}</span>
                        <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{selectedLead.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {isAdmin && selectedLead.status !== 'Closed' && (
                        <button 
                          onClick={() => {
                            const currentIndex = PIPELINE_STAGES.indexOf(selectedLead.status);
                            if (currentIndex < PIPELINE_STAGES.length - 1) {
                              updateLeadStatus(selectedLead.id, PIPELINE_STAGES[currentIndex + 1]);
                            } else {
                              updateLeadStatus(selectedLead.id, 'Closed');
                            }
                          }}
                          className="bg-[#d4af37] text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                          Promote Deal
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-[10px] text-gray-400 uppercase tracking-widest mb-6 font-bold flex items-center gap-2">
                           <div className="w-4 h-[1px] bg-gray-300"></div> Portfolio Parameters
                        </h4>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                          <div>
                            <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Financial Backing</p>
                            <p className="text-lg font-bold text-gray-900 serif">{isAdmin ? selectedLead.netWorth : 'Confidential'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Mandate Ceiling</p>
                            <p className="text-lg font-bold text-gray-900 serif">{selectedLead.investmentBudget}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Asset Preferences</p>
                            <div className="flex gap-2 mt-2">
                               {selectedLead.preferredPropertyTypes.map(t => (
                                 <span key={t} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-700">{t}</span>
                               ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50/30 p-8 rounded-3xl border border-amber-100/50">
                        <h4 className="text-[10px] text-amber-700 uppercase tracking-widest mb-4 font-bold">Confidential Brief</h4>
                        <p className="text-gray-700 text-sm leading-relaxed serif italic">
                          "{selectedLead.notes}"
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#1a1c2c] rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[80px]"></div>
                      <div>
                        <h4 className="text-[10px] text-[#d4af37] uppercase tracking-widest mb-8 font-bold flex items-center gap-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          AI Mandate Strategist
                        </h4>
                        
                        {isAiLoading ? (
                          <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="w-12 h-12 border-t-2 border-[#d4af37] rounded-full animate-spin"></div>
                            <p className="text-[#d4af37] text-[10px] uppercase font-black tracking-widest animate-pulse">Analyzing HNI Behavioral Patterns...</p>
                          </div>
                        ) : (aiInsight && isAdmin) ? (
                          <div className="prose prose-invert prose-sm max-w-none animate-fadeIn">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-light text-sm italic border-l-2 border-[#d4af37]/30 pl-6">
                              {aiInsight}
                            </div>
                          </div>
                        ) : generatedEmail ? (
                           <div className="animate-fadeIn">
                            <div className="text-gray-400 text-[10px] uppercase font-bold mb-4 tracking-widest">Off-Market Outreach Draft</div>
                            <div className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-black/40 p-6 rounded-2xl border border-white/5">
                              {generatedEmail}
                            </div>
                            <button 
                              onClick={() => navigator.clipboard.writeText(generatedEmail)}
                              className="mt-6 text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all border-b border-[#d4af37]/30 pb-1"
                            >
                              Copy Transactional Script
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                              {isAdmin 
                                ? `Generate high-precision strategy for ${selectedLead.name}. Includes negotiation leverage, property matching, and outreach scripting.`
                                : `Generate bespoke marketing content for ${selectedLead.name}. Focus on wealth-preservation and lifestyle positioning.`
                              }
                            </p>
                            <div className="flex gap-4 pt-4">
                               {isAdmin && (
                                 <button onClick={() => fetchAiInsights(selectedLead)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Deep Analysis</button>
                               )}
                               <button onClick={() => handleGenerateEmail(selectedLead)} className="bg-[#d4af37] text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Draft Outreach</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sales' && isAdmin && (
            <div className="space-y-12 animate-fadeIn">
               <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Transaction ID</th>
                           <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Client Name</th>
                           <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Asset Title</th>
                           <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Closing Value</th>
                           <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Brokerage</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {closedSales.map(sale => (
                          <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                             <td className="px-10 py-8 font-mono text-xs text-gray-400 uppercase">EL-{sale.id}992X</td>
                             <td className="px-10 py-8 font-bold text-gray-900 serif text-lg">{sale.name}</td>
                             <td className="px-10 py-8 text-sm text-gray-500">{sale.preferredPropertyTypes[0]} Division</td>
                             <td className="px-10 py-8 font-bold text-[#d4af37] serif text-xl">${(sale.dealValue || 0).toLocaleString()}</td>
                             <td className="px-10 py-8 font-medium text-xs text-gray-900">${((sale.dealValue || 0) * 0.02).toLocaleString()} <span className="text-[10px] text-gray-400 ml-1">(2%)</span></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fadeIn">
              {LUXURY_PROPERTIES.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
