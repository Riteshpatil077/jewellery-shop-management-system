import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Gem, PieChart, IndianRupee, FileText, Users, BarChart3, Settings, Menu, X, Bell, LogOut, Loader2, ArrowUpRight, ArrowDownRight, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from './services/api';

import Jewelry from './pages/Jewelry';
import Loans from './pages/Loans';
import Collections from './pages/Collections';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import Transactions from './pages/Transactions';

// ─── Sidebar ───────────────────────────────────────────
const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const menuItems = [
        { title: '🏠 मुख्यपृष्ठ', path: '/', icon: <Home size={20} /> },
        { title: '💍 दागिने', path: '/jewelry', icon: <Gem size={20} /> },
        { title: '📊 श्रेणी', path: '/categories', icon: <PieChart size={20} /> },
        { title: '💰 कर्ज नोंदी', path: '/loans', icon: <IndianRupee size={20} /> },
        { title: '📝 वसुली', path: '/collections', icon: <FileText size={20} /> },
        { title: '🛍️ दैनिक व्यवहार', path: '/transactions', icon: <ShoppingBag size={20} /> },
        { title: '👥 ग्राहक', path: '/customers', icon: <Users size={20} /> },
        { title: '📈 अहवाल', path: '/reports', icon: <BarChart3 size={20} /> },
        { title: '⚙️ सेटिंग्ज', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-[#0a1128] via-[#0f1e4e] to-royalBlue text-white shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-72 flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-royalBlue text-2xl animate-pulse shadow-lg shadow-gold/20">🕉️</div>
                        <div>
                            <h1 className="text-xl font-black text-gold tracking-tight leading-none">श्री कृष्णा</h1>
                            <p className="text-[10px] uppercase font-bold text-blue-300/60 tracking-[0.2em] mt-1">ज्वेलर्स मॅनॅजमेंट</p>
                        </div>
                    </div>
                    <button className="md:hidden text-white/50 hover:text-gold transition-colors" onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={index} to={item.path} onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-gold/10 text-gold shadow-inner border-r-4 border-gold' : 'hover:bg-white/5 text-blue-200/70 hover:text-white'}`}
                            >
                                {isActive && <div className="absolute inset-0 bg-gold/5 animate-pulse" />}
                                <span className={`transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${isActive ? 'text-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : ''}`}>{item.icon}</span>
                                <span className={`font-bold text-sm tracking-wide ${isActive ? 'translate-x-1' : ''}`}>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/20">
                    <button className="flex items-center space-x-3 text-blue-300/50 hover:text-red-400 transition-all w-full p-3 rounded-xl hover:bg-white/5 group">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[10px]">सिस्टम लॉग आउट</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// ─── TopBar ────────────────────────────────────────────
const TopBar = ({ toggleSidebar }) => {
    const [goldRate, setGoldRate] = useState(() => localStorage.getItem('goldRate') || '६,५००');
    const [silverRate, setSilverRate] = useState(() => localStorage.getItem('silverRate') || '८५');

    // Listen for Settings saves so the rates update immediately without page refresh
    useEffect(() => {
        const onStorage = () => {
            setGoldRate(localStorage.getItem('goldRate') || '—');
            setSilverRate(localStorage.getItem('silverRate') || '—');
        };
        window.addEventListener('storage', onStorage);
        // Also poll every 2s in case same-tab updates (localStorage events don't fire in same tab)
        const interval = setInterval(onStorage, 2000);
        return () => { window.removeEventListener('storage', onStorage); clearInterval(interval); };
    }, []);

    return (
        <header className="bg-white/80 backdrop-blur-md h-20 flex items-center px-6 md:px-8 justify-between border-b border-gray-100 sticky top-0 z-30">
            <button className="md:hidden text-gray-500 hover:text-royalBlue transition-all" onClick={toggleSidebar}>
                <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center space-x-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">सोन्याचा दर (२२K)</span>
                    <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">₹ {Number(goldRate).toLocaleString('en-IN')} / ग्रॅम</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-100" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">चांदीचा दर</span>
                    <span className="text-lg font-black text-gray-700">₹ {Number(silverRate).toLocaleString('en-IN')}/ ग्रॅम</span>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-400 hover:text-royalBlue hover:bg-royalBlue/5 rounded-xl transition-all group">
                    <Bell size={24} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-150 transition-transform"></span>
                </button>
                <div className="flex items-center space-x-3 pl-6 border-l border-gray-100 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-gray-800 uppercase tracking-tight">कृष्णकांत ज्वेलर्स</p>
                        <p className="text-[10px] text-green-500 font-bold">● ऑनलाईन</p>
                    </div>
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold via-yellow-500 to-yellow-600 flex items-center justify-center text-royalBlue font-black text-lg shadow-xl shadow-gold/20 transform group-hover:rotate-12 transition-transform">अ</div>
                        <div className="absolute -bottom-1 -right-1 bg-royalBlue text-[8px] text-white px-1.5 py-0.5 rounded-md font-black italic">PRO</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// ─── Dashboard ─────────────────────────────────────────
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiService.getStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-gold" size={60} />
        </div>
    );

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-[#0a1128] rounded-[2.5rem] p-10 text-white shadow-2xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
                            🙏 शुभ प्रभात, <span className="text-gold">ॲडमिन!</span>
                        </h2>
                        <p className="text-xl text-blue-200/70 font-medium">श्री कृष्णा ज्वेलर्स - आपल्या व्यवसायाची प्रगती पहा.</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-sm font-black text-blue-300 uppercase tracking-[0.3em] mb-1">३१ मे २०२६</p>
                        <div className="h-1 w-24 bg-gold rounded-full" />
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'एकूण गोल्ड स्टॉक', value: stats.totalProducts + ' आयटम', icon: <Gem size={28} />, color: 'gold', growth: '+८%', trend: 'up' },
                    { label: 'एक्टिव्ह कर्ज वाटप', value: '₹ ' + stats.totalLoanAmount.toLocaleString(), icon: <IndianRupee size={28} />, color: 'royalBlue', growth: '+१२%', trend: 'up' },
                    { label: 'वसुली थकित', value: '₹ ' + stats.pendingAmount.toLocaleString(), icon: <FileText size={28} />, color: 'red', growth: '-५%', trend: 'down' },
                    { label: 'एकूण नफा (M)', value: '₹ ४.५L', icon: <BarChart3 size={28} />, color: 'green', growth: '+२२%', trend: 'up' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 border border-gray-50 flex flex-col justify-between h-48">
                        <div className="flex items-center justify-between">
                            <div className={`p-4 rounded-2xl ${stat.color === 'gold' ? 'bg-gold/10 text-gold' : stat.color === 'royalBlue' ? 'bg-royalBlue/10 text-royalBlue' : stat.color === 'red' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.growth}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-black text-gray-800">📊 अलीकडील व्यवहार</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">रिअल-टाइम अपडेट्स</p>
                        </div>
                        <button className="text-xs font-black text-royalBlue bg-royalBlue/5 px-4 py-2 rounded-xl hover:bg-royalBlue hover:text-white transition-all uppercase tracking-widest">सर्व पहा</button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">
                                    <th className="p-4">ग्राहक</th>
                                    <th className="p-4">व्यवहार प्रकार</th>
                                    <th className="p-4 text-right">रक्कम</th>
                                    <th className="p-4 text-center">स्थिती</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { name: 'अनिता शर्मा', type: 'विक्री - गोल्ड नेकलेस', amount: '८५,०००', status: 'यशस्वी', color: 'green' },
                                    { name: 'रमेश पाटील', type: 'कर्ज वितरीत', amount: '५०,०००', status: 'पेन्डिंग', color: 'orange' },
                                    { name: 'सुनील कुलकर्णी', type: 'वसुली हप्ता #४', amount: '५,०००', status: 'यशस्वी', color: 'green' },
                                    { name: 'प्रिया देशमुख', type: 'विक्री - डायमंड रिंग', amount: '४५,०००', status: 'यशस्वी', color: 'green' },
                                ].map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-royalBlue text-xs">{t.name[0]}</div>
                                                <p className="text-sm font-bold text-gray-700">{t.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-gray-500">{t.type}</td>
                                        <td className="p-4 text-right font-black text-gray-800">₹{t.amount}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg ${t.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{t.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Insights */}
                <div className="space-y-6">
                    <div className="bg-[#0f1e4e] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">आगामी पेमेंट्स (Upcoming)</h3>
                        <div className="space-y-6">
                            {[
                                { name: 'सुरेश जाधव', info: 'कर्ज व्याज', date: '०१ जून', amount: '१,५००', icon: '💰' },
                                { name: 'अनिता शर्मा', info: 'हप्ता #५', date: '१५ जून', amount: '७,०००', icon: '📝' },
                            ].map((pay, i) => (
                                <div key={i} className="flex items-center justify-between group/item cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-2xl group-hover/item:scale-125 transition-transform">{pay.icon}</span>
                                        <div>
                                            <p className="font-black text-white text-sm">{pay.name}</p>
                                            <p className="text-[10px] font-bold text-blue-300/50 uppercase">{pay.info}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gold text-sm">₹{pay.amount}</p>
                                        <p className="text-[10px] font-bold text-blue-300/50">{pay.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 w-full py-4 bg-white/10 hover:bg-gold hover:text-royalBlue rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest">रिमाइंडर पाठवा</button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-4">स्टॉक कमी आहे (Low Stock)</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-700">डायमंड हार</span>
                                    <span className="text-xs font-black text-red-600 bg-white px-2 py-1 rounded-lg shadow-sm">२ शिल्लक</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-700">सोन्याचे कडे</span>
                                    <span className="text-xs font-black text-red-600 bg-white px-2 py-1 rounded-lg shadow-sm">१ शिल्लक</span>
                                </div>
                            </div>
                        </div>
                        <Link to="/jewelry" className="mt-6 text-center text-[10px] font-black text-royalBlue uppercase tracking-widest hover:underline">स्टॉक अपडेट करा →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── App ───────────────────────────────────────────────
function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-marathi">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <TopBar toggleSidebar={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/jewelry" element={<Jewelry />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/loans" element={<Loans />} />
                            <Route path="/collections" element={<Collections />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
