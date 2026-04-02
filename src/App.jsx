import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Home, Building, CreditCard, Bell, 
  CheckCircle, XCircle, Menu, X, ChevronRight, BarChart3, 
  User, Phone, Mail, ShieldCheck, Zap
} from 'lucide-react';

// --- MOCK DATA FOR NIGERIAN CONTEXT ---
const STATES_LGA = {
  "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
  "Abuja": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
  "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balega", "Toro", "Warji", "Zaki"],
  "Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  "Benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "Cross River": ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
  "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  "Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
  "Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
  "Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
  "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
  "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  "Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  "Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu"],
  "Ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  "Osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  "Oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  "Plateau": ["Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kware", "Kebbe", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  "Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  "Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Zurmi"]
};

const INITIAL_PROPERTIES = [
  { id: 1, title: "Executive 3 Bedroom Flat", state: "Lagos", lga: "Lekki", area: "Phase 1", type: "Flat", price: 3500000, status: "Available", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", landlordId: "L1", applicants: 2, addedAt: "2 days ago" },
  { id: 2, title: "Spacious Self-Contain", state: "Lagos", lga: "Yaba", area: "Akoka", type: "Self-Contain", price: 650000, status: "Available", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", landlordId: "L2", applicants: 5, addedAt: "5 hrs ago" },
  { id: 3, title: "Luxury 5 Bedroom Duplex", state: "Abuja", lga: "Maitama", area: "Minister's Hill", type: "Duplex", price: 15000000, status: "Taken", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", landlordId: "L1", applicants: 0, addedAt: "1 week ago" },
  { id: 4, title: "Standard 2 Bedroom Apartment", state: "Rivers", lga: "Port Harcourt", area: "G.R.A Phase 2", type: "Flat", price: 1200000, status: "Available", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", landlordId: "L3", applicants: 1, addedAt: "1 day ago" },
  { id: 5, title: "Clean 1 Room Self-Contain", state: "Anambra", lga: "Awka", area: "Ifite", type: "Self-Contain", price: 250000, status: "Available", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", landlordId: "L2", applicants: 8, addedAt: "3 days ago" },
  { id: 6, title: "Newly Built 4 Bedroom Terrace", state: "Abuja", lga: "Gwarinpa", area: "3rd Avenue", type: "Duplex", price: 4500000, status: "Available", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", landlordId: "L1", applicants: 0, addedAt: "Just now" },
];

const MOCK_APPLICANTS = [
  { id: "A1", name: "Chukwudi Okafor", phone: "08012345678", email: "chukwudi@example.com", propertyId: 1, status: "Pending" },
  { id: "A2", name: "Aisha Mohammed", phone: "07087654321", email: "aisha.m@example.com", propertyId: 1, status: "Contacted" },
];

// --- UTILS ---
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

// --- COMPONENTS ---

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, explore, landlord
  const [userRole, setUserRole] = useState('guest'); // guest, tenant, landlord
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [searchParams, setSearchParams] = useState({ state: '', lga: '', minPrice: '', maxPrice: '' });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [authFormData, setAuthFormData] = useState({ name: '', phone: '', email: '', password: '', role: 'tenant' });
  const [showRoleInfo, setShowRoleInfo] = useState(true);

  // --- DERIVED STATE / ANALYTICS ---
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (searchParams.state && p.state !== searchParams.state) return false;
      if (searchParams.lga && p.lga !== searchParams.lga) return false;
      if (searchParams.minPrice && p.price < parseInt(searchParams.minPrice)) return false;
      if (searchParams.maxPrice && p.price > parseInt(searchParams.maxPrice)) return false;
      return true;
    });
  }, [properties, searchParams]);

  const analytics = useMemo(() => {
    const available = filteredProperties.filter(p => p.status === 'Available');
    const statesCount = new Set(available.map(p => p.state)).size;
    const avgPrice = available.length ? available.reduce((acc, p) => acc + p.price, 0) / available.length : 0;
    return { count: available.length, statesCount, avgPrice };
  }, [filteredProperties]);

  const landlordListings = properties.filter(p => p.landlordId === 'L1'); // Mocking logged in landlord L1

  // --- HANDLERS ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authView === 'signup' && (!authFormData.name || !authFormData.email || !authFormData.password)) {
      alert("Please fill all required fields.");
      return;
    }
    if (authView === 'login' && (!authFormData.email || !authFormData.password)) {
      alert("Please enter your email and password.");
      return;
    }
    
    // Mock successful authentication
    setCurrentUser({
      name: authView === 'signup' ? authFormData.name : 'Chukwudi Okafor',
      email: authFormData.email
    });
    
    // Set the user's role based on what they selected in the dropdown
    setUserRole(authFormData.role);
    
    // Route them to the correct dashboard based on their role
    if (authFormData.role === 'landlord') {
      setCurrentView('landlord');
    } else if (currentView === 'home') {
      setCurrentView('explore');
    }

    setShowAuthModal(false);
    setAuthFormData({ name: '', phone: '', email: '', password: '', role: 'tenant' });
  };

  const openAuth = (view) => {
    setAuthView(view);
    setShowRoleInfo(true); // Reset the info box to be visible when opening modal
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleConnectClick = (property) => {
    if (userRole === 'guest') {
      openAuth('signup');
      return;
    }
    setSelectedProperty(property);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    alert(`Success! ₦2,000 paid. You are now connected with the landlord of ${selectedProperty.title}. They have received your details.`);
    setSelectedProperty(null);
  };

  const togglePropertyStatus = (id) => {
    setProperties(properties.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'Available' ? 'Taken' : 'Available' };
      }
      return p;
    }));
  };

  // --- SUB-COMPONENTS ---

  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-indigo-600 p-2 rounded-xl mr-3">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-indigo-950">
              Easy<span className="text-orange-500">Accommodation</span>
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setCurrentView('explore')} className={`font-medium ${currentView === 'explore' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Explore Homes</button>
            {userRole === 'landlord' && (
              <button onClick={() => setCurrentView('landlord')} className={`font-medium ${currentView === 'landlord' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>My Dashboard</button>
            )}
            
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              {userRole === 'guest' ? (
                <>
                  <button onClick={() => openAuth('login')} className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">Log In</button>
                  <button onClick={() => openAuth('signup')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Sign Up</button>
                </>
              ) : (
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-sm text-gray-700">{userRole === 'landlord' ? 'Landlord Mode' : currentUser?.name?.split(' ')[0] || 'User'}</span>
                  <button onClick={() => {setUserRole('guest'); setCurrentUser(null); setCurrentView('home');}} className="text-xs text-red-500 ml-2 font-bold uppercase hover:text-red-700">Log Out</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4 shadow-xl absolute w-full left-0 z-50">
          <button onClick={() => {setCurrentView('explore'); setMobileMenuOpen(false);}} className="block w-full text-left font-medium text-gray-800 p-2 hover:bg-gray-50 rounded-lg">Explore Homes</button>
          {userRole === 'landlord' && (
            <button onClick={() => {setCurrentView('landlord'); setMobileMenuOpen(false);}} className="block w-full text-left font-medium text-gray-800 p-2 hover:bg-gray-50 rounded-lg">My Dashboard</button>
          )}
          <hr className="border-gray-100" />
          {userRole === 'guest' ? (
            <div className="flex flex-col space-y-3">
              <button onClick={() => openAuth('login')} className="block w-full text-center text-indigo-600 border border-indigo-600 p-3 rounded-xl font-medium">Log In</button>
              <button onClick={() => openAuth('signup')} className="block w-full text-center bg-indigo-600 text-white p-3 rounded-xl font-medium shadow-md shadow-indigo-200">Sign Up</button>
            </div>
          ) : (
            <button onClick={() => {setUserRole('guest'); setCurrentUser(null); setCurrentView('home'); setMobileMenuOpen(false);}} className="block w-full text-center bg-red-50 text-red-600 p-3 rounded-xl font-bold hover:bg-red-100">Log Out</button>
          )}
        </div>
      )}
    </nav>
  );

  const HomeView = () => (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative bg-indigo-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Nigerian Homes" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-linear-to-t from-indigo-950 via-indigo-950/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-900/50 rounded-full px-4 py-1.5 mb-6 border border-indigo-700/50 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-indigo-100">Zero Agent Wahala. Direct Connections.</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Find Your Next Home.<br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">Stress Free.</span>
          </h1>
          <p className="mt-4 text-xl text-indigo-200 max-w-2xl mx-auto mb-10">
            Browse thousands of verified homes across Nigeria. Connect directly with landlords for just ₦2,000. No more exorbitant agent fees.
          </p>

          {/* Quick Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <MapPin className="text-gray-400 w-5 h-5 mr-3" />
              <select 
                className="bg-transparent border-none outline-none w-full text-gray-700 font-medium cursor-pointer"
                value={searchParams.state}
                onChange={(e) => setSearchParams({...searchParams, state: e.target.value, lga: ''})}
              >
                <option value="">Any State</option>
                {Object.keys(STATES_LGA).map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <Building className="text-gray-400 w-5 h-5 mr-3" />
              <select 
                className="bg-transparent border-none outline-none w-full text-gray-700 font-medium cursor-pointer"
                value={searchParams.lga}
                onChange={(e) => setSearchParams({...searchParams, lga: e.target.value})}
                disabled={!searchParams.state}
              >
                <option value="">Any LGA</option>
                {searchParams.state && STATES_LGA[searchParams.state].map(lga => <option key={lga} value={lga}>{lga}</option>)}
              </select>
            </div>
            <button 
              onClick={() => setCurrentView('explore')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center md:w-auto w-full"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Homes
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">How EasyAccommodation Works</h2>
            <p className="mt-4 text-lg text-gray-600">We've cut out the middleman to save you time and money.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Search, title: "1. Search Freely", desc: "Browse through thousands of vacant homes across Nigeria. Use our smart filters to find exactly what you need without paying a kobo." },
              { icon: CreditCard, title: "2. Pay Token to Connect", desc: "Found the one? Pay a flat token of just ₦2,000 to indicate interest and get direct access to the landlord's contact details." },
              { icon: ShieldCheck, title: "3. Close the Deal", desc: "Meet with the landlord, inspect the property, and pay your rent directly. No agency percentage, no hidden fees." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ExploreView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Analytics Banner */}
      <div className="bg-linear-to-r from-indigo-900 to-indigo-800 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Market Overview</h2>
            <p className="text-indigo-200 text-sm">Real-time data based on your filters</p>
          </div>
        </div>
        <div className="flex space-x-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-orange-400">{analytics.count}</p>
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">Available Homes</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{analytics.statesCount}</p>
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mt-1">States Covered</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button 
                onClick={() => setSearchParams({ state: '', lga: '', minPrice: '', maxPrice: '' })}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                Reset All
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={searchParams.state}
                  onChange={(e) => setSearchParams({...searchParams, state: e.target.value, lga: ''})}
                >
                  <option value="">All States</option>
                  {Object.keys(STATES_LGA).map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">L.G.A</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
                  value={searchParams.lga}
                  onChange={(e) => setSearchParams({...searchParams, lga: e.target.value})}
                  disabled={!searchParams.state}
                >
                  <option value="">All LGAs</option>
                  {searchParams.state && STATES_LGA[searchParams.state].map(lga => <option key={lga} value={lga}>{lga}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                  <input 
                    type="number" 
                    placeholder="₦0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={searchParams.minPrice}
                    onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                  <input 
                    type="number" 
                    placeholder="₦ Any"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={searchParams.maxPrice}
                    onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="flex-1">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No homes found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProperties.map(property => (
                <div key={property.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${property.status === 'Taken' ? 'grayscale opacity-80' : ''}`}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                        property.status === 'Available' ? 'bg-green-500/90 text-white border-green-400' : 'bg-red-500/90 text-white border-red-400'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">
                      {property.addedAt}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-orange-500 tracking-wide uppercase">{property.type}</p>
                      <p className="text-xl font-extrabold text-indigo-950">{formatNaira(property.price)}<span className="text-sm text-gray-500 font-normal">/yr</span></p>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-6">
                      <MapPin className="w-4 h-4 mr-1.5 shrink-0" />
                      <span className="truncate">{property.area}, {property.lga}, {property.state}</span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex -space-x-2">
                         {/* Mock Avatars for interested applicants to create social proof/urgency */}
                         <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">+{property.applicants}</div>
                         <span className="pl-4 text-xs text-gray-500 font-medium hidden sm:block">interested</span>
                      </div>
                      
                      <button 
                        onClick={() => handleConnectClick(property)}
                        disabled={property.status === 'Taken'}
                        className={`flex items-center px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                          property.status === 'Taken' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        {property.status === 'Taken' ? 'Unavailable' : 'Connect'}
                        {property.status === 'Available' && <ChevronRight className="w-4 h-4 ml-1" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const LandlordDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Landlord Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your properties and connect with potential tenants.</p>
        </div>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          List New Property (₦10k/mo)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Home className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Listings</p>
            <p className="text-2xl font-bold text-gray-900">{landlordListings.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Bell className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Applicants</p>
            <p className="text-2xl font-bold text-gray-900">{landlordListings.reduce((acc, p) => acc + p.applicants, 0)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><CheckCircle className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Taken Properties</p>
            <p className="text-2xl font-bold text-gray-900">{landlordListings.filter(p => p.status === 'Taken').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Your Properties</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-semibold">Property</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Applicants</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {landlordListings.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="font-bold text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-500">{formatNaira(p.price)}/yr</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.area}, {p.state}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {p.applicants} interested
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => togglePropertyStatus(p.id)}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                        p.status === 'Available' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      Mark as {p.status === 'Available' ? 'Taken' : 'Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mock Applicants Section */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Applicant Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_APPLICANTS.map(applicant => {
          const prop = properties.find(p => p.id === applicant.propertyId);
          return (
            <div key={applicant.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                {applicant.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{applicant.name}</h4>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-medium">New</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Interested in <span className="font-semibold text-indigo-600">{prop?.title}</span></p>
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" /> {applicant.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" /> {applicant.email}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  const AuthModal = () => {
    if (!showAuthModal) return null;
    
    return (
      <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
          <button 
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-2">
              {authView === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-center text-gray-600 mb-6 text-sm">
              {authView === 'signup' 
                ? 'Join EasyAccommodation to connect with verified landlords directly.'
                : 'Log in to continue your home search without the wahala.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* ROLE SELECTOR */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">ACCOUNT TYPE</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium"
                  value={authFormData.role}
                  onChange={(e) => {
                    setAuthFormData({...authFormData, role: e.target.value});
                    setShowRoleInfo(true); // Re-trigger the info box when they switch roles
                  }}
                >
                  <option value="tenant">Tenant</option>
                  <option value="landlord">Landlord</option>
                </select>
                
                {/* Animated Transparent Dialog Box */}
                {showRoleInfo && (
                  <div key={authFormData.role} className="mt-3 relative animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-300 bg-indigo-50/80 p-4 rounded-xl border border-indigo-200 text-sm text-gray-700 shadow-sm backdrop-blur-md">
                    <button 
                      type="button"
                      onClick={() => setShowRoleInfo(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:bg-red-500 hover:text-white p-1 rounded-full transition-all duration-200 active:scale-95 cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-start pr-6">
                      {authFormData.role === 'tenant' ? (
                        <>
                          <Home className="w-6 h-6 text-indigo-500 mr-3 shrink-0 mt-0.5"/> 
                          <div>
                            <strong className="block text-indigo-900 mb-1">Tenant Account</strong>
                            <span>I want to <strong>browse and rent</strong> an accommodation stress-free, skipping the agent wahala.</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Building className="w-6 h-6 text-orange-500 mr-3 shrink-0 mt-0.5"/> 
                          <div>
                            <strong className="block text-orange-900 mb-1">Landlord Account</strong>
                            <span>I want to <strong>enlist my property</strong>, manage listings, and connect directly with verified tenants.</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {authView === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">FULL NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Chukwudi Okafor"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={authFormData.name}
                      onChange={(e) => setAuthFormData({...authFormData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 0801 234 5678"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={authFormData.phone}
                      onChange={(e) => setAuthFormData({...authFormData, phone: e.target.value})}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={authFormData.email}
                  onChange={(e) => setAuthFormData({...authFormData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PASSWORD</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={authFormData.password}
                  onChange={(e) => setAuthFormData({...authFormData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 mt-2"
              >
                {authView === 'signup' ? 'Sign Up Now' : 'Log In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              {authView === 'signup' ? (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button onClick={() => setAuthView('login')} className="text-indigo-600 font-bold hover:underline">Log in</button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button onClick={() => setAuthView('signup')} className="text-indigo-600 font-bold hover:underline">Sign up</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaymentModal = () => {
    if (!showPaymentModal || !selectedProperty) return null;
    return (
      <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
          <button 
            onClick={() => setShowPaymentModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="p-8">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-2">Connect with Landlord</h2>
            <p className="text-center text-gray-600 mb-6 text-sm">
              You are about to get direct contact details for the landlord of <span className="font-bold text-gray-900">{selectedProperty.title}</span>.
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 flex justify-between items-center">
              <span className="font-medium text-gray-600">Connection Fee</span>
              <span className="font-extrabold text-xl text-indigo-950">₦2,000</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-gray-600">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Direct Phone & WhatsApp access</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Landlord notified of your interest</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Valid until property is taken</li>
            </ul>

            <button 
              onClick={handlePaymentSuccess}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex justify-center items-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay ₦2,000 Now
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 mr-1" /> Secure payment powered by Paystack
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-200 selection:text-indigo-900">
      <Navbar />
      
      <main>
        {currentView === 'home' && <HomeView />}
        {currentView === 'explore' && <ExploreView />}
        {currentView === 'landlord' && <LandlordDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center & text-center gap-4">
            <div className="flex items-center mb-4 md:mb-0">
               <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
                 <Home className="h-5 w-5 text-white" />
               </div>
               <span className="font-extrabold text-xl tracking-tight text-indigo-950">
                 Easy<span className="text-orange-500">Accommodation</span>
               </span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Easy Accommodation Nigeria. Bye-bye to Agent Wahala.</p>
          </div>
        </div>
      </footer>

      {AuthModal()}
      {PaymentModal()}
    </div>
  );
}