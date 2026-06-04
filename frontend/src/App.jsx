import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Gem, PieChart as PieChartIcon, IndianRupee, FileText, Users, BarChart3, Settings, Menu, X, Bell, LogOut, Loader2, ArrowUpRight, ArrowDownRight, ShoppingBag, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import {
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Line, Bar, PieChart, Pie, Cell, ComposedChart, Legend
} from 'recharts';

import Jewelry from './pages/Jewelry';
import Loans from './pages/Loans';
import Collections from './pages/Collections';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import Transactions from './pages/Transactions';
import { ToastProvider } from './context/ToastContext';

// ─── Sidebar ───────────────────────────────────────────
const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const menuItems = [
        { title: '🏠 मुख्यपृष्ठ', path: '/', icon: <Home size={20} /> },
        { title: '🛍️ दैनिक व्यवहार', path: '/transactions', icon: <ShoppingBag size={20} /> },
        { title: '💍 दागिने', path: '/jewelry', icon: <Gem size={20} /> },
        { title: '📊 श्रेणी', path: '/categories', icon: <PieChartIcon size={20} /> },
        { title: '💰 कर्ज नोंदी', path: '/loans', icon: <IndianRupee size={20} /> },
        { title: '📝 वसुली', path: '/collections', icon: <FileText size={20} /> },
        { title: '👥 ग्राहक', path: '/customers', icon: <Users size={20} /> },
        { title: '📈 अहवाल', path: '/reports', icon: <BarChart3 size={20} /> },
        { title: '⚙️ सेटिंग्ज', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-500" onClick={() => setIsOpen(false)} />}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0a1128] to-[#0d173a] text-white shadow-[10px_0_40px_rgba(0,0,0,0.3)] transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-72 flex flex-col border-r border-white/5`}>
                <div className="flex items-center justify-between p-7 border-b border-white/5">
                    <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center p-1.5 shadow-inner border border-white/10 backdrop-blur-xl group overflow-hidden">
                            <img src="/logo.png" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="श्री कृष्णा ज्वेलर्स" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight leading-none">श्री कृष्णा</h1>
                            <p className="text-[9px] uppercase font-bold text-gold/60 tracking-[0.2em] mt-1.5">ज्वेलर्स मॅनॅजमेंट</p>
                        </div>
                    </div>
                    <button className="md:hidden text-white/40 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                        <X size={22} />
                    </button>
                </div>
                <nav className="flex-1 p-5 space-y-2.5 overflow-y-auto custom-scrollbar pt-8">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={index} to={item.path} onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group relative ${isActive ? 'bg-royalBlue text-white shadow-[0_8px_20px_rgba(30,58,138,0.4)] border border-white/10' : 'hover:bg-white/5 text-blue-200/50 hover:text-white'}`}
                            >
                                <span className={`transition-all duration-500 group-hover:scale-125 ${isActive ? 'text-gold' : ''}`}>{item.icon}</span>
                                <span className={`font-black text-sm tracking-wide ${isActive ? 'translate-x-1' : ''}`}>{item.title}</span>
                                {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-gold rounded-full" />}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-7 border-t border-white/5 bg-black/10">
                    <button className="flex items-center space-x-3 text-red-400/60 hover:text-red-400 transition-all w-full p-4 rounded-2xl hover:bg-red-500/10 group border border-transparent hover:border-red-500/20">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest leading-none">लॉग आउट</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// ─── Mobile Bottom Navigation ──────────────────────────
const MobileBottomNav = () => {
    const location = useLocation();
    const [showMore, setShowMore] = useState(false);
    const primaryItems = [
        { path: '/', icon: <Home size={22} />, label: 'होम' },
        { path: '/transactions', icon: <ShoppingBag size={22} />, label: 'व्यवहार' },
        { path: '/loans', icon: <IndianRupee size={22} />, label: 'कर्ज' },
        { path: '/collections', icon: <FileText size={22} />, label: 'वसुली' },
    ];
    const moreItems = [
        { path: '/customers', icon: <Users size={22} />, label: 'ग्राहक' },
        { path: '/jewelry', icon: <Gem size={22} />, label: 'दागिने' },
        { path: '/categories', icon: <PieChartIcon size={22} />, label: 'श्रेणी' },
        { path: '/reports', icon: <BarChart3 size={22} />, label: 'अहवाल' },
        { path: '/settings', icon: <Settings size={22} />, label: 'सेटिंग्ज' },
    ];
    return (
        <>
            {showMore && (
                <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end" onClick={() => setShowMore(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-t-3xl p-6 pb-24 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">सर्व विभाग</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {moreItems.map(item => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link key={item.path} to={item.path} onClick={() => setShowMore(false)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${isActive ? 'bg-royalBlue text-white shadow-lg' : 'bg-gray-50 text-gray-600'}`}>
                                        <span>{item.icon}</span>
                                        <span className="text-[11px] font-black">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="grid grid-cols-5 h-16">
                    {primaryItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}
                                className={`flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 relative ${isActive ? 'text-royalBlue' : 'text-gray-400'}`}
                            >
                                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-royalBlue rounded-b-full" />}
                                <span className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                                <span className={`text-[9px] font-black ${isActive ? 'text-royalBlue' : 'text-gray-400'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                    <button onClick={() => setShowMore(s => !s)}
                        className={`flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 ${showMore ? 'text-royalBlue' : 'text-gray-400'}`}>
                        <Menu size={22} />
                        <span className="text-[9px] font-black">अधिक</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

// ─── PWA Install Banner ──────────────────────────────
const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowBanner(true); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setShowBanner(false);
        setDeferredPrompt(null);
    };
    if (!showBanner) return null;
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-royalBlue to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
                <span className="text-2xl">💍</span>
                <div>
                    <p className="text-xs font-black">अॅप इन्स्टॉल करा - फोनवर वापरा</p>
                    <p className="text-[10px] text-blue-200 font-bold">इंटरनेटशिवायही काम करते</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleInstall} className="bg-gold text-royalBlue text-[11px] font-black px-4 py-2 rounded-xl active:scale-95 transition-all">इन्स्टॉल</button>
                <button onClick={() => setShowBanner(false)} className="text-blue-200 p-1"><X size={18} /></button>
            </div>
        </div>
    );
};

// ─── TopBar ────────────────────────────────────────────
const TopBar = ({ toggleSidebar }) => {
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const pageNames = { '/': 'मुख्यपृष्ठ', '/jewelry': 'दागिने', '/categories': 'श्रेणी', '/loans': 'कर्ज नोंदी', '/collections': 'वसुली', '/transactions': 'व्यवहार', '/customers': 'ग्राहक', '/reports': 'अहवाल', '/settings': 'सेटिंग्ज' };
    const [goldRate, setGoldRate] = useState(() => {
        const v = localStorage.getItem('goldRate');
        return (v && !isNaN(Number(v))) ? v : '7000';
    });
    const [silverRate, setSilverRate] = useState(() => {
        const v = localStorage.getItem('silverRate');
        return (v && !isNaN(Number(v))) ? v : '90';
    });

    useEffect(() => {
        const onStorage = () => {
            const g = localStorage.getItem('goldRate');
            const s = localStorage.getItem('silverRate');
            setGoldRate((g && !isNaN(Number(g))) ? g : goldRate);
            setSilverRate((s && !isNaN(Number(s))) ? s : silverRate);
        };

        const fetchNotifications = async () => {
            try {
                const res = await apiService.getDashboardStats();
                const newAlerts = [];
                if (res.kpis?.inventoryValue?.lowStock > 0) {
                    newAlerts.push({ type: 'stock', message: `${res.kpis.inventoryValue.lowStock} वस्तूंचा स्टॉक कमी आहे!`, time: 'आत्ता' });
                }
                if (res.collectionStats?.pending > 0) {
                    newAlerts.push({ type: 'collection', message: `₹${res.collectionStats.pending.toLocaleString()} वसुली प्रलंबित आहे.`, time: 'आज' });
                }
                setNotifications(newAlerts);
            } catch (error) {
                console.error('Notif error:', error);
            }
        };

        window.addEventListener('storage', onStorage);
        const interval = setInterval(onStorage, 2000);
        fetchNotifications();
        const notifInterval = setInterval(fetchNotifications, 30000);

        return () => {
            window.removeEventListener('storage', onStorage);
            clearInterval(interval);
            clearInterval(notifInterval);
        };
    }, []);

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
            {/* ── Mobile ── */}
            <div className="md:hidden flex items-center justify-between px-5 h-16">
                <div className="flex items-center gap-3">
                    <button onClick={toggleSidebar} className="p-2 -ml-2 text-royalBlue active:scale-95">
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-sm font-black text-royalBlue tracking-tight leading-none uppercase">श्री कृष्णा</h1>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{pageNames[location.pathname] || ''}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-1.5 shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">Gold</span>
                            <span className="text-[11px] font-black text-gray-800">₹{goldRate}</span>
                        </div>
                    </div>
                    <button className="relative p-2 text-gray-400 active:scale-90">
                        <Bell size={22} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                </div>
            </div>
            {/* ── Desktop ── */}
            <div className="hidden md:flex items-center px-8 h-20 justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-2 shadow-sm">
                        <div className="flex flex-col leading-none">
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">सोने (22K) प्रतिग्राम</span>
                            <span className="text-lg font-black text-amber-700">₹{isNaN(Number(goldRate)) ? '—' : Number(goldRate).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-slate-100 border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                        <div className="flex flex-col leading-none">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">चांदी प्रतिग्राम</span>
                            <span className="text-lg font-black text-gray-700">₹{isNaN(Number(silverRate)) ? '—' : Number(silverRate).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <button className="relative p-2 text-gray-400 hover:text-royalBlue hover:bg-royalBlue/5 rounded-xl transition-all">
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                            )}
                        </button>
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">सूचना (Notifications)</h3>
                                <span className="text-[10px] font-bold text-royalBlue bg-blue-50 px-2 py-0.5 rounded-full">{notifications.length} नवीन</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-300">
                                            <Bell size={20} />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">कोणतीही नवीन सूचना नाही</p>
                                    </div>
                                ) : (
                                    notifications.map((n, i) => (
                                        <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${n.type === 'stock' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {n.type === 'stock' ? <Gem size={14} /> : <IndianRupee size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{n.message}</p>
                                                <p className="text-[9px] text-gray-400 mt-0.5">{n.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pl-4 border-l border-gray-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-gray-800">{localStorage.getItem('ownerName') || 'ॲडमिन'}</p>
                            <p className="text-[10px] text-green-500 font-bold">● ऑनलाईन</p>
                        </div>
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
    const [selectedRange, setSelectedRange] = useState(15);
    const [selectedMonth, setSelectedMonth] = useState('');

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'शुभ प्रभात';
        if (h < 17) return 'शुभ दुपार';
        return 'शुभ संध्याकाळ';
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const params = { range: selectedRange };
                if (selectedMonth) params.month = selectedMonth;
                const data = await apiService.getDashboardStats(params);
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [selectedRange, selectedMonth]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin text-royalBlue mx-auto" size={48} />
                    <p className="text-sm font-bold text-gray-400">डॅशबोर्ड लोड होत आहे...</p>
                </div>
            </div>
        );
    }

    if (!stats || stats.error) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center text-red-500 font-bold">
                <p>माहिती लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.</p>
                {stats?.error && <p className="text-xs text-gray-400">{stats.error}</p>}
            </div>
        );
    }

    const { kpis, salesAnalytics, categoryPerformance, inventoryStatus, topProducts, purchaseVsSales, meta, loanStats, collectionStats, recentTransactions, calendarDays } = stats;
    const selectedMonthLabel = selectedMonth || meta?.selectedMonth || new Date().toISOString().slice(0, 7);
    const previousMonthLabel = meta?.previousMonth || '';
    const rawMonthChange = kpis.previousMonthTotalSales > 0
        ? Math.round(((kpis.monthTotalSales - kpis.previousMonthTotalSales) / kpis.previousMonthTotalSales) * 100)
        : 0;
    const monthChange = Math.max(-100, Math.min(100, rawMonthChange));
    const colors = ['#FFD700', '#1E3A8A', '#059669', '#DC2626', '#64748B'];

    const kpiCards = [
        { label: 'आजची विक्री', value: `₹${kpis.todaySales.value.toLocaleString('en-IN')}`, trend: kpis.todaySales.trendValue, trendLabel: kpis.todaySales.trend, gradient: 'from-blue-600 to-royalBlue', icon: '💰' },
        { label: 'स्टॉक मूल्य', value: `₹${kpis.inventoryValue.value.toLocaleString('en-IN')}`, sub: `${kpis.inventoryValue.count} उत्पादने`, gradient: 'from-indigo-500 to-purple-700', icon: '💍' },
        { label: 'नफा मार्जिन', value: `${kpis.profitMargin.value}%`, sub: `लक्ष्य ${kpis.profitMargin.target}%`, gradient: kpis.profitMargin.value >= kpis.profitMargin.target ? 'from-emerald-500 to-green-700' : 'from-orange-500 to-red-600', icon: '📈' },
        { label: 'ग्राहक', value: kpis.activeCustomers.value, sub: `नवीन +${kpis.activeCustomers.newThisMonth}`, gradient: 'from-amber-500 to-orange-600', icon: '👥' },
        { label: 'सक्रिय कर्ज', value: loanStats?.activeCount ?? 0, sub: `₹${(loanStats?.interestEarned ?? 0).toLocaleString('en-IN')} व्याज मिळाले`, gradient: 'from-red-500 to-rose-700', icon: '📋' },
        { label: 'प्रलंबित वसुली', value: `₹${(collectionStats?.pending ?? 0).toLocaleString('en-IN')}`, sub: `₹${(collectionStats?.collected ?? 0).toLocaleString('en-IN')} वसूल`, gradient: 'from-teal-500 to-cyan-700', icon: '📝' },
    ];

    const quickActions = [
        { label: 'नवीन व्यवहार', sub: 'नोंद करा', path: '/transactions', icon: <ShoppingBag size={18} />, color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50/50' },
        { label: 'नवीन कर्ज', sub: 'कर्ज द्या', path: '/loans', icon: <IndianRupee size={18} />, color: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50/50' },
        { label: 'वसुली नोंद', sub: 'पैसे जमा', path: '/collections', icon: <FileText size={18} />, color: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50/50' },
        { label: 'दागिने स्टॉक', sub: 'स्टॉक पहा', path: '/jewelry', icon: <Gem size={18} />, color: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50/50' },
    ];

    const maxCalSales = Math.max(...(calendarDays || []).map(d => d.sales), 1);

    return (
        <div className="p-3 md:p-6 space-y-5 pb-24 md:pb-8 bg-[#f8fafc]">

            {/* ── Hero Header ── */}
            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a1128] via-[#12308a] to-[#1E3A8A] text-white p-5 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">🏆 व्यवसाय डॅशबोर्ड</p>
                        <h2 className="text-2xl md:text-4xl font-black tracking-tight mt-1 md:mt-2 leading-tight">
                            {getGreeting()}, <br className="md:hidden" />
                            <span className="text-gold">{localStorage.getItem('ownerName') || 'अॅडमिन'}</span>
                        </h2>
                        <p className="text-xs md:text-sm text-blue-100/80 font-bold mt-1.5">
                            {new Date().toLocaleDateString('mr-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-3 mt-4">
                            <div className="bg-white/10 border border-white/15 rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-center flex-1 md:flex-none min-w-[120px]">
                                <p className="text-[8px] md:text-[9px] text-blue-200 font-black uppercase tracking-widest whitespace-nowrap">महिन्याची विक्री</p>
                                <p className="text-lg md:text-xl font-black text-gold">₹{kpis.monthTotalSales.toLocaleString('en-IN')}</p>
                            </div>
                            <div className={`rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-center flex-1 md:flex-none min-w-[120px] ${monthChange >= 0 ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                                <p className="text-[8px] md:text-[9px] text-blue-200 font-black uppercase tracking-widest whitespace-nowrap">मागील महिन्यापेक्षा</p>
                                <p className={`text-lg md:text-xl font-black flex items-center justify-center gap-1 ${monthChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {monthChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {monthChange > 0 ? `+${monthChange}%` : `${monthChange}%`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 scroll-hide">
                        <button onClick={() => setSelectedRange(15)} className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${selectedRange === 15 ? 'bg-gold text-royalBlue shadow-lg shadow-gold/30' : 'bg-white/10 text-white border border-white/15'}`}>15 दिवस</button>
                        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-[10px] md:text-xs font-black outline-none text-white shrink-0" />
                        <button onClick={() => setSelectedMonth(previousMonthLabel)} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest bg-white/10 text-white border border-white/15 shrink-0">मागील</button>
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map(a => (
                    <Link key={a.path} to={a.path} className={`bg-white hover:${a.bg} border ${a.border} rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300 group shadow-sm hover:shadow-md`}>
                        <div className={`p-2 rounded-lg ${a.bg} ${a.color} transition-colors group-hover:bg-white`}>
                            {a.icon}
                        </div>
                        <span className={`font-black text-[11px] md:text-sm uppercase tracking-wider ${a.color}`}>{a.label}</span>
                    </Link>
                ))}
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {kpiCards.map((card, i) => (
                    <div key={i} className={`bg-gradient-to-br ${card.gradient} p-4 md:p-5 rounded-xl md:rounded-2xl shadow-lg text-white relative overflow-hidden`}>
                        <div className="absolute top-3 right-3 text-2xl md:text-3xl opacity-20 select-none">{card.icon}</div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/70 mb-1 md:mb-2">{card.label}</p>
                        <p className="text-xl md:text-2xl font-black">{card.value}</p>
                        {card.trendLabel && (
                            <p className={`text-[10px] md:text-xs font-bold mt-1.5 md:mt-2 flex items-center gap-1 ${(card.trend ?? 0) > 0 ? 'text-emerald-200' : (card.trend ?? 0) < 0 ? 'text-red-200' : 'text-white/60'}`}>
                                {(card.trend ?? 0) > 0 ? <ArrowUpRight size={12} /> : (card.trend ?? 0) < 0 ? <ArrowDownRight size={12} /> : null}
                                {card.trendLabel} कालच्यापेक्षा
                            </p>
                        )}
                        {card.sub && <p className="text-[10px] md:text-xs font-bold mt-1.5 md:mt-2 text-white/60">{card.sub}</p>}
                    </div>
                ))}
            </div>

            {/* ── Sales Performance Chart ── */}
            <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                        <h3 className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-widest leading-none">📊 विक्री कामगिरी – {selectedRange} दिवस</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold mt-1">महिना: {selectedMonthLabel}</p>
                    </div>
                    <div className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg w-fit ${monthChange >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        मागील महिन्यापेक्षा {monthChange > 0 ? `+${monthChange}%` : `${monthChange}%`}
                    </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar -mx-4 px-4 pb-2">
                    <div className="h-64 md:h-72 min-w-[500px] md:min-w-0 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={salesAnalytics} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                    formatter={(value, name) => [name === 'विक्री' || name === 'नफा' ? `₹${value.toLocaleString('en-IN')}` : value, name]}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                                <Bar yAxisId="left" dataKey="sales" name="विक्री" fill="#1E3A8A" radius={[3, 3, 0, 0]} opacity={0.85} barSize={10} />
                                <Line yAxisId="left" type="monotone" dataKey="profit" name="नफा" stroke="#059669" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── 3-col section ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category Pie */}
                <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xs md:text-sm font-black text-gray-800 mb-1 uppercase tracking-widest leading-none">🏷️ श्रेणी कामगिरी</h3>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold mb-3 uppercase">या महिन्यातील विक्री</p>
                    {categoryPerformance.length === 0 ? (
                        <div className="h-48 md:h-56 flex items-center justify-center text-gray-300 font-bold text-xs">माहिती उपलब्ध नाही</div>
                    ) : (
                        <div className="h-48 md:h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryPerformance} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                        {categoryPerformance.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                                    </Pie>
                                    <RechartsTooltip formatter={(value, name, props) => [`${value}% (₹${props.payload.amount?.toLocaleString('en-IN')})`, name]} />
                                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Stock + Top Products */}
                <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 space-y-5">
                    <div>
                        <h3 className="text-xs md:text-sm font-black text-gray-800 mb-3 uppercase tracking-widest leading-none">📦 स्टॉक स्थिती</h3>
                        <div className="space-y-2.5">
                            {inventoryStatus.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.fill }} />
                                        <span className="text-xs font-bold text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ color: item.fill, background: `${item.fill}15` }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-gray-50 pt-4">
                        <h3 className="text-xs md:text-sm font-black text-gray-800 mb-3 uppercase tracking-widest leading-none">⭐ टॉप उत्पादने</h3>
                        <div className="space-y-2.5">
                            {topProducts.map((item, i) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-[9px] font-black text-gray-400 w-4">{i + 1}.</span>
                                        <span className="text-[11px] font-bold text-gray-700 truncate">{item.name}</span>
                                    </div>
                                    <span className="text-[11px] font-black text-royalBlue shrink-0 ml-2">₹{item.revenue?.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Calendar Heatmap */}
                <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xs md:text-sm font-black text-gray-800 mb-1 uppercase tracking-widest leading-none">🗓️ महिना हीटमॅप</h3>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold mb-3 uppercase">{selectedMonthLabel}</p>
                    <div className="grid grid-cols-7 gap-1">
                        {['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'].map(d => (
                            <div key={d} className="text-center text-[9px] font-black text-gray-400 uppercase pb-1">{d}</div>
                        ))}
                        {calendarDays && calendarDays.length > 0 && (() => {
                            const firstDay = new Date(calendarDays[0].date).getDay();
                            const blanks = Array(firstDay).fill(null);
                            return [...blanks, ...calendarDays].map((day, idx) => {
                                if (!day) return <div key={`b-${idx}`} className="aspect-square" />;
                                const intensity = day.sales > 0 ? Math.max(0.15, day.sales / maxCalSales) : 0;
                                return (
                                    <div key={day.date} title={`₹${day.sales.toLocaleString('en-IN')}`}
                                        className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-black cursor-default transition-all ${day.isToday ? 'ring-2 ring-royalBlue scale-90' : ''}`}
                                        style={{ background: day.sales > 0 ? `rgba(30,58,138,${intensity})` : '#F3F4F6', color: intensity > 0.5 ? 'white' : '#374151' }}>
                                        {day.day}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-4">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">कमी</span>
                        {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                            <div key={o} className="w-3.5 h-3.5 rounded-sm" style={{ background: `rgba(30,58,138,${o})` }} />
                        ))}
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">जास्त</span>
                    </div>
                </div>
            </div>

            {/* ── Bottom 2-col section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Previous Month Chart */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest">📅 मागील महिना तुलना</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={purchaseVsSales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                                <RechartsTooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                <Bar dataKey="purchases" name="खरेदी" fill="#64748B" barSize={10} radius={[2, 2, 0, 0]} />
                                <Bar dataKey="sales" name="विक्री" fill="#059669" barSize={10} radius={[2, 2, 0, 0]} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions Feed */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">🔔 अलीकडील व्यवहार</h3>
                        <Link to="/transactions" className="text-[10px] font-black text-royalBlue bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">सर्व पहा →</Link>
                    </div>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                        {(!recentTransactions || recentTransactions.length === 0) ? (
                            <p className="text-xs text-gray-400 font-bold text-center py-8">कोणतेही व्यवहार नाहीत</p>
                        ) : recentTransactions.slice(0, 10).map((tx, i) => {
                            const typeColor = tx.type === 'Sell' ? 'bg-green-50 text-green-700 border-green-200'
                                : tx.type === 'Purchase' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200';
                            const typeName = tx.type === 'Sell' ? 'विक्री' : tx.type === 'Purchase' ? 'खरेदी' : 'ऑर्डर';
                            return (
                                <div key={tx.id || i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${typeColor}`}>{typeName}</span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-gray-800 truncate">{tx.customerName || tx.supplierName || '—'}</p>
                                            <p className="text-[10px] text-gray-400 font-bold truncate">{tx.itemName || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm font-black text-royalBlue">₹{(tx.totalAmount || 0).toLocaleString('en-IN')}</p>
                                        <p className="text-[9px] text-gray-400 font-bold">{new Date(tx.date).toLocaleDateString('mr-IN')}</p>
                                    </div>
                                </div>
                            );
                        })}
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
        <ToastProvider>
            <BrowserRouter>
                <PWAInstallBanner />
                <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-marathi">
                    <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <TopBar toggleSidebar={() => setSidebarOpen(true)} />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar pb-16 md:pb-0">
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
                        <MobileBottomNav />
                    </div>
                </div>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
