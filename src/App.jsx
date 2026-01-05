import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  MapPin, 
  Users, 
  Heart, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Ship,
  Sun,
  DollarSign,
  Star,
  Check,
  Printer,
  Mail,
  Info,
  Wine,
  Calendar,
  Navigation,
  ShoppingBag,
  Ticket,
  PlusCircle,
  AlertTriangle,
  LogOut,
  Compass,
  Filter,
  Palmtree,
  ExternalLink
} from 'lucide-react';

// --- FONTS & STYLES ---
const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Russo+One&display=swap');
      
      .font-brand { font-family: 'Russo One', sans-serif; }
      .font-body { font-family: 'Roboto', sans-serif; }

      @media print {
        @page { margin: 1cm; size: portrait; }
        body { background-color: white; -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
      .print-only { display: none; }
      
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

      /* Nautical Porthole Effect */
      .porthole {
        box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 0 0 4px #c2b280, 0 10px 20px rgba(0,0,0,0.5);
        border-radius: 50%;
        overflow: hidden;
        transition: transform 0.3s ease;
      }
      .porthole:hover {
        transform: scale(1.02);
      }
      
      /* Subtle Ocean Animation */
      @keyframes ocean {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .bg-ocean {
        background: linear-gradient(270deg, #0f172a, #1e293b, #0f172a);
        background-size: 200% 200%;
        animation: ocean 30s ease infinite;
      }
    `}
  </style>
);

// --- BRAND CONFIG ---
const MAIN_BRAND_COLOR = "#34a4b8"; 

// --- CRUISE LINE BRAND COLORS ---
const LINE_COLORS = {
  "Royal Caribbean": "#005DAA", 
  "Disney Cruise Line": "#002664", 
  "Norwegian Cruise Line": "#0033A0", 
  "Holland America Line": "#152F4E", 
  "Princess Cruises": "#005DAA", 
  "Celebrity Cruises": "#0B1F3F", 
  "Virgin Voyages": "#E3001B", 
  "Regent Seven Seas Cruises": "#1E232C", 
  "Explora Journeys": "#A48E66", 
  "Oceania Cruises": "#9DA6AB", 
  "Windstar Cruises": "#004B87", 
  "Cunard Line": "#111111", 
  "Carnival Cruise Line": "#E32726", 
  "MSC Cruises": "#00325F", 
  "Costa Cruises": "#FECB00", 
  "Viking Ocean Cruises": "#98002E",
};

const LOGIC_ENGINE = {
  family: { label: "Family Fun", icon: Users, desc: "Action & Kids" },
  adults: { label: "Adults Only", icon: Wine, desc: "Romance & Nightlife" },
  relaxing: { label: "Relaxing", icon: Sun, desc: "Quiet & Scenic" },
  luxury: { label: "Luxury", icon: Star, desc: "All-Inclusive" },
  budget: { label: "Best Value", icon: DollarSign, desc: "Deals" }
};

const MOCK_CRUISE_DATA = [
  {
    id: 1,
    title: "7-Night Perfect Day at CocoCay",
    line: "Royal Caribbean",
    ship: "Icon of the Seas",
    destination: "Caribbean",
    travelStyle: "family",
    date: "Dec 2025",
    price: 1199,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    affiliateLink: "#",
    description: "Experience the ultimate family vacation on the world's largest cruise ship. Featuring the largest waterpark at sea, 7 pools, and the dedicated Surfside neighborhood for young families.",
    ports: ["Miami, FL", "Perfect Day at CocoCay", "St. Thomas", "St. Maarten"],
    features: ["Category 6 Waterpark", "AquaDome", "Surfside Family Neighborhood"],
    amazonProducts: [], 
    excursions: [] 
  }
];

const SUGGESTED_ESSENTIALS = [
  { id: 'sugg-1', name: "Magnetic Cruise Ship Fan", price: "19.99", link: "https://amzn.to/4jmVuc8", image: "https://m.media-amazon.com/images/I/71tXcZksPJL._AC_SL1500_.jpg" },
  { id: 'sugg-2', name: "Large Waterproof Phone Pouch (2 Pack)", price: "9.99", link: "https://amzn.to/3NufGNh", image: "https://m.media-amazon.com/images/I/71L7M0vCvXL._AC_SX679_.jpg" }
];

const App = () => {
  const [filters, setFilters] = useState({ destination: '', style: '' });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredCruises, setFilteredCruises] = useState([]);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [cruiseData, setCruiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cruiseCartV6');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) { console.warn("Storage restricted"); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cruiseCartV6', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    const WP_API_URL = "https://cruisytravel.com/wp-json/wp/v2/cruises?per_page=100&_fields=id,title,acf";

    const fetchCruises = async () => {
      if (WP_API_URL.includes("YOUR-WEBSITE.com")) {
        setCruiseData(MOCK_CRUISE_DATA);
        setDebugError("API URL not configured");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${WP_API_URL}&t=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const wpData = await response.json();
        const formattedData = wpData.map(post => {
          const acf = post.acf;
          const parseJSON = (str) => { try { return str ? JSON.parse(str) : []; } catch (e) { return []; }};
          const parseList = (text) => text ? text.split('\n') : [];
          return {
            id: post.id,
            title: post.title.rendered,
            line: acf.cruise_line,
            ship: acf.ship_name,
            destination: acf.destination,
            travelStyle: acf.travel_style, 
            date: "Check Dates", 
            price: acf.price,
            image: acf.cruise_image, 
            rating: acf.rating,
            affiliateLink: acf.affiliate_link,
            description: acf.description,
            ports: parseList(acf.ports),
            features: parseList(acf.features),
            amazonProducts: parseJSON(acf.amazon_json),
            excursions: parseJSON(acf.excursions_json)
          };
        });
        setCruiseData(formattedData.length > 0 ? formattedData : MOCK_CRUISE_DATA);
        if (formattedData.length === 0) setDebugError("No cruises found. Using Mock Data.");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cruises:", error);
        setCruiseData(MOCK_CRUISE_DATA);
        setDebugError(error.message); 
        setLoading(false);
      }
    };
    fetchCruises();
  }, []);

  useEffect(() => {
    if (loading) return;
    let results = cruiseData;
    if (filters.destination) results = results.filter(c => c.destination === filters.destination);
    if (filters.style) results = results.filter(c => c.travelStyle === filters.style);
    setFilteredCruises(results);
  }, [filters, cruiseData, loading]);

  const addToCart = (item, type) => {
    const itemId = item.id || `${type}-${item.name}-${Date.now()}`;
    // Allow multiple items of type 'cruise' to be added for comparison
    // For other types, prevent duplicates based on title/name
    const isDuplicate = cart.find(c => (c.title === item.title || c.name === item.name) && c.type === type);
    
    if (!isDuplicate || type === 'cruise') {
       // Check for exact duplicate ID to prevent accidental double-clicks
       if(!cart.find(c => c.id === item.id)) {
          setCart([...cart, { ...item, id: itemId, type, checked: false }]);
       }
    }
    setIsCartOpen(true);
  };
  
  const handleRemoveFromCart = (id) => setCart(cart.filter(c => c.id !== id));
  
  const toggleItemCheck = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const resetFilters = () => setFilters({ destination: '', style: '' });

  const handleEmailShare = () => {
    const subject = encodeURIComponent("My Cruisy Vacation Checklist");
    let bodyText = "My Vacation Plan:\n\n";
    cart.forEach(item => bodyText += `[${item.checked ? 'X' : ' '}] ${item.title || item.name} - ${item.affiliateLink || item.link}\n`);
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  // --- SUB-COMPONENTS ---

  const CruiseDetailsModal = () => {
    if (!selectedCruise) return null;
    const color = LINE_COLORS[selectedCruise.line] || MAIN_BRAND_COLOR;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedCruise(null)} />
        <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-slate-700">
          <div className="relative h-64 bg-slate-900">
            <img src={selectedCruise.image} className="w-full h-full object-cover opacity-80" alt={selectedCruise.title} />
            <button onClick={() => setSelectedCruise(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black transition-all"><X size={20} /></button>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
              <h2 className="text-2xl font-brand text-white">{selectedCruise.title}</h2>
              <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">{selectedCruise.line} | {selectedCruise.ship}</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <p className="font-body text-slate-600 leading-relaxed">{selectedCruise.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-brand text-sm text-slate-800 mb-2 flex items-center gap-1"><Navigation size={14} className="text-teal-500"/> Itinerary</h4>
                <ul className="text-sm text-slate-500 space-y-1">
                  {selectedCruise.ports?.map((p,i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
              <div>
                 <h4 className="font-brand text-sm text-slate-800 mb-2 flex items-center gap-1"><Star size={14} className="text-orange-500"/> Features</h4>
                 <ul className="text-sm text-slate-500 space-y-1">
                   {selectedCruise.features?.map((f,i) => <li key={i}>• {f}</li>)}
                 </ul>
              </div>
            </div>

            {/* ADD TO TRIP SECTION */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-brand text-sm text-slate-800 mb-4">Add to your trip</h4>
              <div className="space-y-4">
                
                {/* 1. Activities Button */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3">
                     <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Ticket size={20} /></div>
                     <div>
                       <div className="font-bold text-slate-700 text-sm">Shore Excursions & Activities</div>
                       <div className="text-xs text-slate-500">Book tours for your trip</div>
                     </div>
                   </div>
                   <a href="https://cruisytravel.com/contact/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors flex items-center gap-1">
                     Book Activities <ExternalLink size={12} />
                   </a>
                </div>

                {/* 2. Amazon Essentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_ESSENTIALS.map((prod, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <img src={prod.image} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                          <div className="truncate">
                             <div className="font-bold text-xs text-slate-700 truncate">{prod.name}</div>
                             <div className="text-[10px] text-teal-600 font-bold">${prod.price}</div>
                          </div>
                       </div>
                       <button onClick={() => addToCart(prod, 'product')} className="text-teal-600 hover:text-teal-700 font-bold text-xs border border-teal-200 p-2 rounded bg-slate-50 hover:bg-white"><PlusCircle size={16} /></button>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
               <div className="text-2xl font-brand text-slate-800">${selectedCruise.price}</div>
               <div className="flex gap-2">
                 <button onClick={() => addToCart(selectedCruise, 'cruise')} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Save</button>
                 <a 
                   href={selectedCruise.affiliateLink} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="px-6 py-2 rounded-lg text-white font-bold text-sm hover:opacity-90 shadow-md transition-all" 
                   style={{ backgroundColor: color }} 
                 >
                   Availability
                 </a>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PrintableItinerary = () => (
    <div className="print-only p-8 font-body text-black">
      <h1 className="font-brand text-3xl mb-6">Cruisy Travel Checklist</h1>
      <div className="space-y-6">
        {cart.map(item => (
           <div key={item.id} className="border-b pb-2">
             <div className="font-bold">{item.title || item.name}</div>
             <div className="text-sm">{item.price ? `$${item.price}` : ''} - {item.line || 'Essential'}</div>
           </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ocean font-body text-slate-200 pb-10 selection:bg-teal-500 selection:text-white">
      <GlobalStyles />
      <PrintableItinerary />
      <CruiseDetailsModal />

      {/* HEADER */}
      <header className="no-print sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-700 shadow-lg h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
             <img src="https://cruisytravel.com/wp-content/uploads/2024/01/cropped-20240120_025955_0000.png" className="h-8 w-auto object-contain" alt="Logo" />
             <div className="hidden sm:block font-brand text-lg text-white tracking-wide">Cruisy<span style={{ color: MAIN_BRAND_COLOR }}>Travel</span></div>
        </div>
        <div className="flex items-center gap-3">
           <a href="https://cruisytravel.com" className="text-xs font-bold text-slate-400 hover:text-white flex items-center transition-colors"><LogOut size={14} className="mr-1" /> Back to cruisytravel.com</a>
           <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 border border-red-500 transition-colors">
              <Heart size={18} className={cart.length > 0 ? "fill-teal-400 text-teal-400" : "text-slate-400"} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
           </button>
        </div>
      </header>

      {/* DASHBOARD CONTROLS */}
      <div className="no-print max-w-6xl mx-auto px-4 py-8">
         <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="cursor-pointer group" onClick={resetFilters}>
                   <h2 className="font-brand text-2xl text-white mb-1 flex items-center gap-2 group-hover:text-teal-400 transition-colors">
                     <Compass style={{ color: MAIN_BRAND_COLOR }} /> Cruise Matchmaker
                   </h2>
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-bold group-hover:text-white transition-colors">Configure Your Voyage</p>
                </div>

                <div className="flex-1 w-full md:w-auto flex flex-col gap-4">
                   {/* DESTINATIONS */}
                   <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {['Caribbean', 'Mediterranean', 'Alaska', 'Europe', 'Transatlantic'].map(dest => {
                          const isSelected = filters.destination === dest;
                          const borderColors = {
                              'Caribbean': 'border-cyan-500',
                              'Mediterranean': 'border-blue-500',
                              'Alaska': 'border-indigo-500',
                              'Europe': 'border-rose-500',
                              'Transatlantic': 'border-violet-500'
                          };
                          return (
                            <button 
                              key={dest} 
                              onClick={() => setFilters({...filters, destination: dest === filters.destination ? '' : dest})}
                              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${isSelected ? `bg-[${MAIN_BRAND_COLOR}] text-white shadow-lg` : 'bg-slate-900 text-slate-400 hover:border-slate-500'} ${borderColors[dest] || 'border-slate-700'}`}
                              style={{ backgroundColor: isSelected ? MAIN_BRAND_COLOR : '' }}
                            >
                              {dest}
                            </button>
                          )
                      })}
                   </div>
                   
                   {/* VIBES */}
                   <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {Object.entries(LOGIC_ENGINE).map(([key, data]) => {
                        const Icon = data.icon;
                        const isSelected = filters.style === key;
                        const borderColors = {
                            family: 'border-sky-500',
                            adults: 'border-rose-500',
                            relaxing: 'border-emerald-500',
                            luxury: 'border-violet-500',
                            budget: 'border-amber-500'
                        };
                        return (
                          <button 
                            key={key} 
                            onClick={() => setFilters({...filters, style: key === filters.style ? '' : key})}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${isSelected ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:border-slate-500'} ${borderColors[key] || 'border-slate-700'}`}
                            style={{ borderColor: isSelected ? '' : (borderColors[key] || '#334155') }}
                          >
                            <Icon size={14} /> {data.label}
                          </button>
                        )
                      })}
                   </div>
                </div>
            </div>
         </div>

         {/* RESULTS GRID */}
         {debugError && <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6 border border-red-800 text-sm text-center">{debugError}</div>}
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCruises.length === 0 ? (
               <div className="col-span-full text-center py-20">
                  <Palmtree size={48} className="mx-auto mb-4 text-slate-600" />
                  <p className="font-brand text-xl text-slate-400">No matches found for this combination.</p>
                  <button onClick={resetFilters} className="mt-4 text-teal-400 underline">Reset Filters</button>
               </div>
            ) : (
              filteredCruises.map(cruise => {
                 const cardColor = LINE_COLORS[cruise.line] || MAIN_BRAND_COLOR;
                 return (
                   <div key={cruise.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl group hover:border-slate-500 transition-all duration-300">
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                         <div className="absolute inset-0 bg-black/40 z-10" />
                         <img src={cruise.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         
                         {/* PORTHOLE IMAGE EFFECT */}
                         <div className="absolute -bottom-10 right-4 z-20 w-24 h-24 border-4 border-slate-800 rounded-full overflow-hidden shadow-xl porthole bg-slate-800">
                            <img src={cruise.image} className="w-full h-full object-cover" />
                         </div>

                         <div className="absolute top-3 left-3 z-20">
                            <span className="px-2 py-1 bg-slate-900/90 text-[10px] font-bold uppercase text-white rounded border border-slate-600 tracking-wider">{cruise.line}</span>
                         </div>
                      </div>
                      
                      <div className="p-5 pt-6">
                         <div className="mb-4 pr-20"> {/* Padding for porthole */}
                            <h3 className="font-brand text-lg text-white leading-tight mb-1">{cruise.title}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{cruise.ship}</p>
                         </div>
                         
                         <div className="flex items-end justify-between border-t border-slate-700 pt-4 mt-4">
                            <div>
                               <p className="text-[10px] text-slate-500 uppercase font-bold">Starting From</p>
                               <p className="font-brand text-2xl text-white">${cruise.price}</p>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => setSelectedCruise(cruise)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold px-3">
                                 <Info size={14}/> Details
                               </button>
                               <button onClick={() => addToCart(cruise, 'cruise')} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"><Heart size={18}/></button>
                               <a href={cruise.affiliateLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-white font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5" style={{ backgroundColor: cardColor }}>Availability</a>
                            </div>
                         </div>
                      </div>
                   </div>
                 )
              })
            )}
         </div>
      </div>

      {/* CHECKLIST DRAWER */}
      {isCartOpen && (
        <>
          <div className="no-print fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setIsCartOpen(false)} />
          <div className="no-print fixed top-0 right-0 h-full w-full sm:w-96 bg-slate-900 z-[100] shadow-2xl border-l border-slate-700 flex flex-col">
             <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/95">
               <h2 className="font-brand text-xl text-white flex items-center gap-2"><Heart className="text-teal-400 fill-teal-400" size={20} /> Saved Items</h2>
               <button onClick={() => setIsCartOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {['cruise', 'product', 'activity'].map(type => {
                   const items = cart.filter(c => c.type === type);
                   if (!items.length) return null;
                   const label = { cruise: 'Cruises', product: 'Gear', activity: 'Excursions' }[type];
                   return (
                     <div key={type}>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</h3>
                        <div className="space-y-3">
                           {items.map(item => {
                             const itemLink = item.affiliateLink || item.link;
                             return (
                               <div key={item.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-3 group relative">
                                  <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0">
                                     <img src={item.image} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <div className={`text-sm font-bold truncate ${item.checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{item.title || item.name}</div>
                                     <div className="text-xs text-slate-500">${item.price}</div>
                                  </div>
                                  <div className="flex flex-col justify-between items-end">
                                     <button onClick={() => handleRemoveFromCart(item.id)} className="text-slate-600 hover:text-red-400"><X size={14} /></button>
                                     <div className="flex gap-2">
                                        <a href={itemLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-500">Book</a>
                                        <input type="checkbox" checked={item.checked} onChange={() => toggleItemCheck(item.id)} className="accent-teal-500 w-4 h-4 mt-0.5" />
                                     </div>
                                  </div>
                               </div>
                             )
                           })}
                        </div>
                     </div>
                   )
                })}

                <div className="border-t border-slate-800 pt-6">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Essentials</h3>
                   <div className="grid grid-cols-1 gap-2">
                      {SUGGESTED_ESSENTIALS.map(item => {
                         if (cart.find(c => c.name === item.name)) return null;
                         return (
                            <div key={item.id} className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                               <img src={item.image} className="w-10 h-10 rounded-md object-cover" />
                               <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-300 truncate">{item.name}</div>
                                  <div className="text-[10px] text-slate-500">${item.price}</div>
                               </div>
                               <button onClick={() => addToCart(item, 'product')} className="text-teal-400 hover:text-white"><PlusCircle size={18} /></button>
                            </div>
                         )
                      })}
                   </div>
                </div>
             </div>

             <div className="p-5 border-t border-slate-800 bg-slate-900 sticky bottom-0 space-y-2">
                <button onClick={handleEmailShare} className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-700 flex items-center justify-center gap-2"><Mail size={16} /> Email List</button>
                <button onClick={() => window.print()} className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-500 flex items-center justify-center gap-2"><Printer size={16} /> Print</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
