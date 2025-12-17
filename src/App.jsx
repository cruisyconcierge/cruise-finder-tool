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
  PlusCircle
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
      
      /* Checkbox styles - Updated to use Brand Teal */
      .custom-checkbox:checked + div {
         background-color: #34a4b8;
         border-color: #34a4b8;
         color: white;
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

// --- LOGIC ENGINE ---
const LOGIC_ENGINE = {
  family: {
    label: "Family Fun",
    description: "Slides, kids clubs, active",
    allowedLines: ["Royal Caribbean", "Disney Cruise Line", "Norwegian Cruise Line", "MSC Cruises"]
  },
  adults: {
    label: "Adults Only",
    description: "Romantic, nightlife, 18+",
    allowedLines: ["Virgin Voyages", "Viking Ocean Cruises", "Saga Cruises"]
  },
  relaxing: {
    label: "Relaxing & Scenic",
    description: "Quiet, nature, premium",
    allowedLines: ["Holland America Line", "Princess Cruises", "Celebrity Cruises"]
  },
  luxury: {
    label: "Luxury & Culture",
    description: "All-inclusive, smaller ships",
    allowedLines: ["Regent Seven Seas Cruises", "Explora Journeys", "Oceania Cruises", "Windstar Cruises", "Cunard Line"]
  },
  budget: {
    label: "Best Value",
    description: "Great deals, quick getaways",
    allowedLines: ["Carnival Cruise Line", "MSC Cruises", "Costa Cruises"]
  }
};

// --- MOCK DATA ---
const CRUISE_DATA = [
  {
    id: 1,
    title: "7-Night Perfect Day at CocoCay",
    line: "Royal Caribbean",
    ship: "Icon of the Seas",
    destination: "Caribbean",
    date: "Dec 2025",
    price: 1199,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    affiliateLink: "#",
    description: "Experience the ultimate family vacation on the world's largest cruise ship. Featuring the largest waterpark at sea, 7 pools, and the dedicated Surfside neighborhood for young families.",
    ports: ["Miami, FL", "Perfect Day at CocoCay", "St. Thomas", "St. Maarten"],
    features: ["Category 6 Waterpark", "AquaDome", "Surfside Family Neighborhood"],
    amazonProducts: [
      { name: "Waterproof Phone Pouch", link: "#", price: "9.99", image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=200" },
      { name: "Reef Safe Sunscreen", link: "#", price: "14.50", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=200" }
    ],
    excursions: [
      { name: "CocoCay Waterpark Pass", link: "#", price: "89", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" },
      { name: "St. Maarten Catamaran Snorkel", link: "#", price: "120", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 2,
    title: "8-Night Eastern Caribbean",
    line: "Virgin Voyages",
    ship: "Scarlet Lady",
    destination: "Caribbean",
    date: "Feb 2026",
    price: 1600,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    affiliateLink: "#",
    description: "A strictly adults-only experience that redefines luxury. With over $600 in value included (WiFi, dining, tips), this is the perfect romantic getaway with modern nightlife.",
    ports: ["Miami, FL", "Puerto Plata", "Bimini Beach Club", "San Juan"],
    features: ["Adults Only (18+)", "20+ Eateries Included", "Bimini Beach Club Party"],
    amazonProducts: [
      { name: "Elegant Evening Clutch", link: "#", price: "24.99", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200" },
      { name: "Red Party Outfit Essentials", link: "#", price: "45.00", image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&q=80&w=200" }
    ],
    excursions: [
      { name: "San Juan Food Tour", link: "#", price: "75", image: "https://images.unsplash.com/photo-1599021406414-119777175396?auto=format&fit=crop&q=80&w=200" },
      { name: "Waterfall Jumping in Puerto Plata", link: "#", price: "95", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 3,
    title: "7-Day Alaskan Glaciers",
    line: "Holland America Line",
    ship: "Koningsdam",
    destination: "Alaska",
    date: "May 2025",
    price: 1100,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    affiliateLink: "#",
    description: "Immerse yourself in the wild beauty of Alaska. Holland America is the leader in Alaskan cruising, offering exclusive access to Glacier Bay National Park.",
    ports: ["Vancouver, BC", "Juneau", "Skagway", "Glacier Bay", "Ketchikan"],
    features: ["BBC Earth Experiences", "Music Walk", "Regional Cooking Demonstrations"],
    amazonProducts: [
      { name: "Waterproof Binoculars", link: "#", price: "55.00", image: "https://images.unsplash.com/photo-1526487034633-90d09d3b763e?auto=format&fit=crop&q=80&w=200" },
      { name: "Warm Fleece Jacket", link: "#", price: "39.99", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=200" }
    ],
    excursions: [
      { name: "White Pass Railway", link: "#", price: "145", image: "https://images.unsplash.com/photo-1517411606011-275d35a3922f?auto=format&fit=crop&q=80&w=200" },
      { name: "Whale Watching Juneau", link: "#", price: "160", image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 4,
    title: "10-Night Mediterranean",
    line: "Norwegian Cruise Line",
    ship: "Norwegian Viva",
    destination: "Mediterranean",
    date: "Jun 2025",
    price: 1450,
    image: "https://images.unsplash.com/photo-1599640845513-5c2b12a32c46?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    affiliateLink: "#",
    description: "Island hop through the Mediterranean in style on NCL's newest class of ships. Enjoy freestyle cruising with no fixed dining times.",
    ports: ["Rome (Civitavecchia)", "Santorini", "Mykonos", "Corfu", "Naples"],
    features: ["Viva Speedway Go-Karts", "Indulge Food Hall", "The Drop Slide"],
    amazonProducts: [
      { name: "European Power Adapter", link: "#", price: "15.99", image: "https://images.unsplash.com/photo-1621255562770-692736b4e727?auto=format&fit=crop&q=80&w=200" },
      { name: "Comfortable Walking Shoes", link: "#", price: "60.00", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200" }
    ],
    excursions: [] 
  },
  {
    id: 5,
    title: "4-Day Bahamas Getaway",
    line: "Carnival Cruise Line",
    ship: "Carnival Conquest",
    destination: "Caribbean",
    date: "Aug 2025",
    price: 299,
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600",
    rating: 4.2,
    affiliateLink: "#",
    description: "The perfect quick escape. Enjoy fun in the sun, burgers by Guy Fieri, and the best comedy clubs at sea.",
    ports: ["Miami, FL", "Nassau", "Half Moon Cay"],
    features: ["Guy's Burger Joint", "Punchliner Comedy Club", "Serenity Adult Retreat"],
    amazonProducts: [],
    excursions: [
      { name: "Atlantis Day Pass", link: "#", price: "110", image: "https://images.unsplash.com/photo-1563861826100-9cb868c06c74?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 6,
    title: "15-Day Viking Homelands",
    line: "Viking Ocean Cruises",
    ship: "Viking Mars",
    destination: "Europe",
    date: "Jul 2025",
    price: 5499,
    image: "https://images.unsplash.com/photo-1516484392579-38374d6b5e02?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    affiliateLink: "#",
    description: "A culturally enriching journey for the thinking person. No casinos, no kids, just pure exploration and Scandinavian design.",
    ports: ["Stockholm", "Copenhagen", "Berlin", "Oslo", "Bergen"],
    features: ["All Veranda Staterooms", "Shore Excursion Included in Every Port", "Nordic Spa Included"],
    amazonProducts: [],
    excursions: []
  }
];

// --- EXTRA SUGGESTIONS (NOT IN CART YET) ---
const SUGGESTED_ESSENTIALS = [
  { id: 'sugg-1', name: "Universal Travel Adapter", price: "19.99", link: "#", image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=150" },
  { id: 'sugg-2', name: "Magnetic Cabin Hooks", price: "12.50", link: "#", image: "https://images.unsplash.com/photo-1624823183492-3599690f3319?auto=format&fit=crop&q=80&w=150" }
];

const App = () => {
  const [step, setStep] = useState('wizard');
  const [filters, setFilters] = useState({ destination: '', style: '' });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredCruises, setFilteredCruises] = useState([]);
  const [selectedCruise, setSelectedCruise] = useState(null);
  
  // NEW: State for real data
  const [cruiseData, setCruiseData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safe Mode Storage
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

  // --- 1. FETCH DATA FROM WORDPRESS ---
  useEffect(() => {
    // Replace this with YOUR actual WordPress URL
    const WP_API_URL = "https://YOUR-WEBSITE.com/wp-json/wp/v2/cruises?per_page=100&_fields=id,title,acf";

    const fetchCruises = async () => {
      try {
        const response = await fetch(WP_API_URL);
        const wpData = await response.json();

        // Map WordPress Data to App Structure
        const formattedData = wpData.map(post => {
          const acf = post.acf;
          
          // Helper to parse the JSON text areas safely
          const parseJSON = (jsonString) => {
            try { return jsonString ? JSON.parse(jsonString) : []; } 
            catch (e) { return []; }
          };

          // Helper to turn newlines into arrays
          const parseList = (text) => text ? text.split('\n') : [];

          return {
            id: post.id,
            title: post.title.rendered,
            line: acf.cruise_line,
            ship: acf.ship_name,
            destination: acf.destination, // Matches 'Caribbean', etc.
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

        setCruiseData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cruises:", error);
        setLoading(false);
      }
    };

    fetchCruises();
  }, []);

  // --- LOGIC ENGINE ---
  useEffect(() => {
    // Wait for data to load
    if (loading) return;

    let results = cruiseData;

    // 1. Destination Filter
    if (filters.destination) {
      results = results.filter(c => c.destination === filters.destination);
    }
    
    // 2. Style Filter
    if (filters.style) {
      results = results.filter(c => c.travelStyle === filters.style);
    }

    setFilteredCruises(results);
  }, [filters, cruiseData, loading]);

  const addToCart = (item, type, parentContext = '') => {
    const itemId = item.id || `${type}-${item.name}-${Date.now()}`;
    if (!cart.find(c => (c.title === item.title || c.name === item.name) && c.type === type)) {
      setCart([...cart, { ...item, id: itemId, type, parentContext, checked: false }]);
    }
    setIsCartOpen(true);
  };
  
  const handleRemoveFromCart = (id) => setCart(cart.filter(c => c.id !== id));
  
  const toggleItemCheck = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const resetTool = () => {
    setStep('wizard');
    setFilters({ destination: '', style: '' });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("My Cruisy Vacation Checklist");
    let bodyText = "My Vacation Plan:\n\n";
    
    const cruises = cart.filter(i => i.type === 'cruise');
    const products = cart.filter(i => i.type === 'product');
    const activities = cart.filter(i => i.type === 'activity');

    if (cruises.length) {
      bodyText += "--- CRUISES ---\n";
      cruises.forEach(i => bodyText += `[${i.checked ? 'X' : ' '}] ${i.title} (${i.line}) - $${i.price}\nLink: ${i.affiliateLink}\n\n`);
    }
    if (products.length) {
      bodyText += "--- GEAR TO BUY ---\n";
      products.forEach(i => bodyText += `[${i.checked ? 'X' : ' '}] ${i.name} - $${i.price}\nLink: ${i.link}\n\n`);
    }
    if (activities.length) {
      bodyText += "--- ACTIVITIES ---\n";
      activities.forEach(i => bodyText += `[${i.checked ? 'X' : ' '}] ${i.name} - $${i.price}\nLink: ${i.link}\n\n`);
    }

    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  // --- SUB-COMPONENTS ---

  const CruiseDetailsModal = () => {
    if (!selectedCruise) return null;
    
    const color = LINE_COLORS[selectedCruise.line] || MAIN_BRAND_COLOR;
    const hasAmazon = selectedCruise.amazonProducts && selectedCruise.amazonProducts.length > 0;
    const hasExcursions = selectedCruise.excursions && selectedCruise.excursions.length > 0;

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCruise(null)} />
        <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
          
          <div className="relative h-64">
            <img src={selectedCruise.image} className="w-full h-full object-cover" alt={selectedCruise.title} />
            <button onClick={() => setSelectedCruise(null)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white text-gray-800 transition-all"><X size={24} /></button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 inline-block border border-white/30">{selectedCruise.line}</span>
              <h2 className="text-3xl font-brand text-white leading-tight">{selectedCruise.title}</h2>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-6">
              <div className="text-center"><Ship className="w-6 h-6 mx-auto mb-2 text-gray-400" /><p className="text-xs text-gray-400 font-bold uppercase">Ship</p><p className="font-bold text-gray-800 text-sm">{selectedCruise.ship}</p></div>
              <div className="text-center border-l border-gray-100"><Calendar className="w-6 h-6 mx-auto mb-2 text-gray-400" /><p className="text-xs text-gray-400 font-bold uppercase">Date</p><p className="font-bold text-gray-800 text-sm">{selectedCruise.date}</p></div>
              <div className="text-center border-l border-gray-100"><Star className="w-6 h-6 mx-auto mb-2 text-yellow-400 fill-current" /><p className="text-xs text-gray-400 font-bold uppercase">Rating</p><p className="font-bold text-gray-800 text-sm">{selectedCruise.rating}/5</p></div>
            </div>

            <div>
              <h3 className="font-brand text-xl text-gray-800 mb-3 flex items-center gap-2"><Info size={20} style={{ color: color }} /> About this Sailing</h3>
              <p className="font-body text-gray-600 leading-relaxed">{selectedCruise.description}</p>
            </div>

            <div>
              <h3 className="font-brand text-xl text-gray-800 mb-3 flex items-center gap-2"><Navigation size={20} style={{ color: color }} /> Ports of Call</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCruise.ports ? selectedCruise.ports.map((port, idx) => (<span key={idx} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center"><MapPin size={12} className="mr-1 opacity-50" /> {port}</span>)) : null}
              </div>
            </div>

            {hasExcursions && (
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <h3 className="font-brand text-xl text-gray-800 mb-3 flex items-center gap-2"><Ticket size={20} className="text-orange-500" /> Top Shore Excursions</h3>
                <div className="space-y-3">
                  {selectedCruise.excursions.map((exc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img src={exc.image} className="w-10 h-10 rounded-md object-cover" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">{exc.name}</div>
                          <div className="text-xs text-gray-400">From ${exc.price}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => addToCart(exc, 'activity', selectedCruise.title)} className="p-2 bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-orange-600 rounded-lg transition-colors" title="Save to List"><Heart size={18} /></button>
                        <a href={exc.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 font-bold text-xs flex items-center">Book <ChevronRight size={14} /></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasAmazon && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-brand text-xl text-gray-800 mb-3 flex items-center gap-2"><ShoppingBag size={20} className="text-gray-600" /> Pack Like a Pro</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCruise.amazonProducts.map((prod, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={prod.image} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-gray-800 truncate">{prod.name}</div>
                          <div className="text-xs text-teal-600 font-bold">${prod.price}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => addToCart(prod, 'product', selectedCruise.title)} className="p-1.5 bg-gray-50 hover:bg-teal-50 rounded text-gray-400 hover:text-teal-500"><Heart size={16} /></button>
                        <a href={prod.link} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"><ShoppingBag size={16} /></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-white pb-2">
               <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Starting From</p><p className="font-brand text-3xl" style={{ color: color }}>${selectedCruise.price}</p></div>
               <div className="flex gap-3">
                 <button onClick={() => addToCart(selectedCruise, 'cruise')} className="px-6 py-2 rounded-xl border-2 font-body font-bold text-base transition-all hover:bg-gray-50" style={{ borderColor: color, color: color }}>Save</button>
                 <a href={selectedCruise.affiliateLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-xl text-white font-body font-bold text-base shadow-md hover:shadow-xl hover:-translate-y-1 transition-all" style={{ backgroundColor: color }}>View Deal</a>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PrintableItinerary = () => (
    <div className="print-only p-8 max-w-3xl mx-auto font-body text-black">
      <div className="flex items-center gap-4 mb-8 border-b-2 pb-6 border-gray-800">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 text-white">
          <Anchor size={24} />
        </div>
        <div>
          <h1 className="font-brand text-4xl">Cruisy</h1>
          <p className="uppercase tracking-widest text-sm">Vacation Checklist</p>
        </div>
      </div>

      <div className="space-y-8">
        {[
          { type: 'cruise', title: 'Cruises to Book' }, 
          { type: 'activity', title: 'Activities & Excursions' }, 
          { type: 'product', title: 'Packing List' }
        ].map(section => {
          const items = cart.filter(c => c.type === section.type);
          if (items.length === 0) return null;
          return (
            <div key={section.type}>
              <h3 className="font-brand text-xl border-b pb-2 mb-4 uppercase">{section.title}</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center"></div>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{item.title || item.name}</div>
                      <div className="text-sm text-gray-500">{item.line || item.parentContext} - ${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const Header = () => (
    <header className="no-print sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetTool}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: MAIN_BRAND_COLOR }}>
            <Anchor size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-brand text-xl tracking-wide text-gray-800">Cruisy</span>
            <span className="font-brand text-sm tracking-widest text-gray-500">Cruise Finder</span>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <div className="relative">
            <Heart className={`w-7 h-7 ${cart.length > 0 ? 'fill-current' : ''}`} style={{ color: MAIN_BRAND_COLOR }} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full font-body">{cart.length}</span>
            )}
          </div>
        </button>
      </div>
    </header>
  );

  const Wizard = () => (
    <div className="no-print max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-brand text-4xl md:text-5xl text-gray-900 mb-4">
          Find Your Perfect <span style={{ color: MAIN_BRAND_COLOR }}>Cruise</span>
        </h1>
        <p className="font-body text-gray-500 text-lg font-medium">Select a destination and your vibe to see curated matches.</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-10">
          
          <div className="space-y-5">
            <label className="flex items-center gap-2 font-brand text-gray-700 text-xl"><MapPin className="w-6 h-6" style={{ color: MAIN_BRAND_COLOR }} /> Where to?</label>
            <div className="grid grid-cols-2 gap-3">
               {['Caribbean', 'Mediterranean', 'Alaska', 'Europe', 'Transatlantic'].map(dest => {
                const destColors = {
                  'Caribbean': 'border-cyan-300 hover:bg-cyan-50 text-cyan-800',
                  'Mediterranean': 'border-blue-300 hover:bg-blue-50 text-blue-800',
                  'Alaska': 'border-indigo-300 hover:bg-indigo-50 text-indigo-800',
                  'Europe': 'border-rose-300 hover:bg-rose-50 text-rose-800',
                  'Transatlantic': 'border-violet-300 hover:bg-violet-50 text-violet-800',
                };
                const colorClass = destColors[dest];
                const isSelected = filters.destination === dest;
                const activeStyles = {
                  'Caribbean': { bg: '#ecfeff', border: '#22d3ee' }, 
                  'Mediterranean': { bg: '#eff6ff', border: '#60a5fa' }, 
                  'Alaska': { bg: '#eef2ff', border: '#818cf8' }, 
                  'Europe': { bg: '#fff1f2', border: '#fb7185' }, 
                  'Transatlantic': { bg: '#f5f3ff', border: '#a78bfa' }, 
                };
                const active = activeStyles[dest];

                return (
                  <button
                    key={dest}
                    onClick={() => setFilters({ ...filters, destination: dest })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all font-body font-medium ${colorClass} ${isSelected ? 'shadow-sm' : 'bg-white'}`}
                    style={{ backgroundColor: isSelected ? active.bg : '', borderColor: isSelected ? active.border : '', borderWidth: '2px' }}
                  >
                    <span className="block">{dest}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-2 font-brand text-gray-700 text-xl"><Sun className="w-6 h-6" style={{ color: MAIN_BRAND_COLOR }} /> What's the Vibe?</label>
            <div className="space-y-3">
              {Object.entries(LOGIC_ENGINE).map(([key, data]) => {
                 const icons = { family: Users, adults: Wine, relaxing: Sun, luxury: Star, budget: DollarSign };
                 const Icon = icons[key];
                 const isSelected = filters.style === key;
                 const vibeColors = {
                   family: "bg-sky-100 text-sky-600",
                   adults: "bg-rose-100 text-rose-600",
                   relaxing: "bg-emerald-100 text-emerald-600",
                   luxury: "bg-violet-100 text-violet-600",
                   budget: "bg-amber-100 text-amber-600"
                 };
                 return (
                  <button key={key} onClick={() => setFilters({ ...filters, style: key })} className={`w-full p-3 rounded-2xl border-2 flex items-center gap-4 transition-all font-body group hover:bg-gray-50 ${isSelected ? 'shadow-sm' : 'bg-white'}`} style={{ borderColor: isSelected ? MAIN_BRAND_COLOR : '#f3f4f6', backgroundColor: isSelected ? '#f0fdff' : '' }}>
                    <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-teal-100 text-teal-700' : vibeColors[key]}`}>
                      <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-800 text-lg group-hover:text-gray-900">{data.label}</div>
                      <div className="text-xs text-gray-500 font-medium">{data.description}</div>
                    </div>
                    {isSelected && <Check className="ml-auto w-6 h-6" style={{ color: MAIN_BRAND_COLOR }} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t flex justify-end">
          <button onClick={() => setStep('results')} disabled={!filters.destination || !filters.style} className="px-8 py-3 rounded-xl font-brand text-lg text-white shadow-lg transition-all hover:scale-105" style={{ backgroundColor: (!filters.destination || !filters.style) ? '#ccc' : MAIN_BRAND_COLOR }}>Show Cruises <ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );

  const Results = () => (
    <div className="no-print max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button onClick={() => setStep('wizard')} className="font-body text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4 font-bold text-sm"><ChevronLeft size={16} /> Edit Filters</button>
        <h2 className="font-brand text-3xl text-gray-800">Recommended Sailings</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCruises.map((cruise) => {
          const cardColor = LINE_COLORS[cruise.line] || MAIN_BRAND_COLOR;
          const inCart = cart.find(c => c.id === cruise.id && c.type === 'cruise');
          return (
            <div key={cruise.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col">
              <div className="relative h-56">
                <img src={cruise.image} className="w-full h-full object-cover" alt={cruise.title} />
                <button onClick={() => addToCart(cruise, 'cruise')} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md">
                  <Heart size={20} className={inCart ? "fill-current" : "text-gray-300"} style={{ color: inCart ? MAIN_BRAND_COLOR : '' }} />
                </button>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-brand text-xl text-gray-900 mb-2">{cruise.title}</h3>
                <div className="mt-auto pt-4 flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <p className="font-brand text-2xl" style={{ color: cardColor }}>${cruise.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedCruise(cruise)}
                      className="px-3 py-1.5 rounded-lg text-gray-600 font-body font-bold text-sm border border-gray-200 hover:bg-gray-50"
                    >
                      Details
                    </button>
                    <a 
                      href={cruise.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-lg text-white font-body font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                      style={{ backgroundColor: cardColor }}
                    >
                      View Deal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-body text-gray-800 pb-20">
      <GlobalStyles />
      <PrintableItinerary />
      <CruiseDetailsModal />
      <Header />
      {step === 'wizard' ? <Wizard /> : <Results />}
      
      {isCartOpen && (
        <>
          <div className="no-print fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setIsCartOpen(false)} />
          <div className="no-print fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[60] shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-brand text-xl text-gray-800 flex items-center gap-2"><Heart className="w-5 h-5 fill-current" style={{ color: MAIN_BRAND_COLOR }} /> My Checklist</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {[
                { type: 'cruise', label: 'Cruises', icon: Ship },
                { type: 'product', label: 'Gear to Buy', icon: ShoppingBag },
                { type: 'activity', label: 'Excursions', icon: Ticket }
              ].map(section => {
                const items = cart.filter(c => c.type === section.type);
                if (items.length === 0) return null;
                return (
                  <div key={section.type}>
                     <h3 className="font-brand text-sm text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><section.icon size={14} /> {section.label}</h3>
                     <div className="space-y-3">
                       {items.map(item => {
                         const itemLink = item.affiliateLink || item.link;
                         return (
                           <div key={item.id} className="flex gap-3 items-start group">
                              <label className="relative flex items-center pt-1 cursor-pointer">
                                <input type="checkbox" className="custom-checkbox sr-only" checked={item.checked} onChange={() => toggleItemCheck(item.id)} />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${item.checked ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300'}`} style={{ backgroundColor: item.checked ? MAIN_BRAND_COLOR : '', borderColor: item.checked ? MAIN_BRAND_COLOR : '' }}>
                                  {item.checked && <Check size={12} strokeWidth={4} />}
                                </div>
                              </label>
                              {/* UPDATED: Thumbnail Image */}
                              <img src={item.image} className="w-12 h-12 rounded-md object-cover flex-shrink-0 bg-gray-100" />
                              <div className="flex-1">
                                <div className={`font-bold text-sm leading-tight transition-all ${item.checked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                  {item.title || item.name}
                                </div>
                                <div className="text-xs text-gray-400 mb-1">{item.line || item.parentContext}</div>
                                <div className="flex items-center gap-3">
                                  <a href={itemLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-600 hover:underline">Book/Buy</a>
                                  
                                  {item.type === 'cruise' && (
                                    <button 
                                      onClick={() => { setIsCartOpen(false); setSelectedCruise(item); }}
                                      className="text-xs text-gray-400 hover:text-teal-600 flex items-center gap-1"
                                      title="View Details"
                                    >
                                      <Info size={12} /> Details
                                    </button>
                                  )}

                                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-xs text-gray-400 hover:text-gray-600">Remove</button>
                                </div>
                              </div>
                           </div>
                         )
                       })}
                     </div>
                  </div>
                )
              })}
              {cart.length === 0 && <div className="text-center py-10 text-gray-400">Your list is empty.</div>}

              {/* UPDATED: Suggested Items Section */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="font-brand text-sm text-gray-400 uppercase tracking-widest mb-3">Don't Forget Essentials</h3>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_ESSENTIALS.map(item => {
                    // Don't show if already added
                    if (cart.find(c => c.name === item.name)) return null;
                    return (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <img src={item.image} className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700 truncate">{item.name}</div>
                          <div className="text-xs text-gray-500">${item.price}</div>
                        </div>
                        <button onClick={() => addToCart(item, 'product', 'Essentials')} className="text-teal-600 hover:bg-teal-100 p-1.5 rounded-full transition-colors"><PlusCircle size={20} /></button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50 space-y-3">
                <button onClick={handleEmailShare} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 rounded-xl font-brand text-gray-700 hover:bg-gray-50">
                  <Mail size={18} /> Email Checklist
                </button>
                <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 py-3 text-white rounded-xl font-brand shadow-md hover:opacity-90" style={{ backgroundColor: MAIN_BRAND_COLOR }}>
                  <Printer size={18} /> Print Checklist
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
