import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Gem, PieChart as PieChartIcon, IndianRupee, FileText, Users, BarChart3, Settings, Menu, X, Bell, LogOut, Loader2, ArrowUpRight, ArrowDownRight, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';

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
        { title: '💍 दागिने', path: '/jewelry', icon: <Gem size={20} /> },
        { title: '📊 श्रेणी', path: '/categories', icon: <PieChartIcon size={20} /> },
        { title: '💰 कर्ज नोंदी', path: '/loans', icon: <IndianRupee size={20} /> },
        { title: '📝 वसुली', path: '/collections', icon: <FileText size={20} /> },
        { title: '🛍️ दैनिक व्यवहार', path: '/transactions', icon: <ShoppingBag size={20} /> },
        { title: '👥 ग्राहक', path: '/customers', icon: <Users size={20} /> },
        { title: '📈 अहवाल', path: '/reports', icon: <BarChart3 size={20} /> },
        { title: '⚙️ सेटिंग्ज', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-[#0a1128] via-[#0f1e4e] to-royalBlue text-white shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-72 flex flex-col`}>
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

// ─── Mobile Bottom Navigation ──────────────────────────
const MobileBottomNav = () => {
    const location = useLocation();
    const items = [
        { path: '/', icon: <Home size={22} />, label: 'होम' },
        { path: '/transactions', icon: <ShoppingBag size={22} />, label: 'व्यवहार' },
        { path: '/loans', icon: <IndianRupee size={22} />, label: 'कर्ज' },
        { path: '/collections', icon: <FileText size={22} />, label: 'वसुली' },
        { path: '/jewelry', icon: <Gem size={22} />, label: 'दागिने' },
        { path: '/settings', icon: <Settings size={22} />, label: 'सेटिंग' },
    ];
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl">
            <div className="grid grid-cols-6 h-16">
                {items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}
                            className={`flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 relative ${isActive ? 'text-royalBlue' : 'text-gray-400'}`}
                        >
                            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                            <span className={`text-[9px] font-black tracking-wide ${isActive ? 'text-royalBlue' : 'text-gray-400'}`}>{item.label}</span>
                            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-royalBlue rounded-b-full" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

// ─── TopBar ────────────────────────────────────────────
const TopBar = ({ toggleSidebar }) => {
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
        window.addEventListener('storage', onStorage);
        const interval = setInterval(onStorage, 2000);
        return () => { window.removeEventListener('storage', onStorage); clearInterval(interval); };
    }, []);

    return (
        <header className="bg-white/90 backdrop-blur-md h-14 md:h-20 flex items-center px-3 md:px-8 justify-between border-b border-gray-100 sticky top-0 z-30">
            <div className="flex items-center gap-2 md:gap-4">
                <button className="md:hidden text-gray-500 hover:text-royalBlue transition-all p-2 rounded-xl active:scale-90" onClick={toggleSidebar}>
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-2 md:gap-6">
                    <div className="flex flex-col leading-tight">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest hidden md:block">सोन्याचा दर (२२K)</span>
                        <span className="text-xs md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">🥇 ₹{isNaN(Number(goldRate)) ? '—' : Number(goldRate).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-5 w-[1px] bg-gray-200" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest hidden md:block">चांदीचा दर</span>
                        <span className="text-xs md:text-base font-black text-gray-600">🥈 ₹{isNaN(Number(silverRate)) ? '—' : Number(silverRate).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-royalBlue hover:bg-royalBlue/5 rounded-xl transition-all">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center space-x-2 pl-2 md:pl-4 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-gray-800">कृष्णकांत ज्वेलर्स</p>
                        <p className="text-[10px] text-green-500 font-bold">● ऑनलाईन</p>
                    </div>
                    <div className="relative">
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-gold via-yellow-500 to-yellow-600 flex items-center justify-center text-royalBlue font-black text-sm md:text-base shadow-lg">अ</div>
                        <div className="absolute -bottom-1 -right-1 bg-royalBlue text-[7px] text-white px-1 py-0.5 rounded-md font-black">PRO</div>
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'शुभ प्रभात';
        if (hour < 17) return 'शुभ दुपार';
        return 'शुभ संध्याकाळ';
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${window.location.protocol}//${window.location.hostname}:5000/api/dashboard`);
                const data = await response.json();
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

    if (!stats || stats.error) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center text-red-500 font-bold">
                <p>माहिती लोड करण्यात त्रुटी आली. कृपया इंटरनेट तपासा आणि रीफ्रेश करा.</p>
                <p className="text-xs text-gray-400">{stats?.error}</p>
            </div>
        );
    }

    const { kpis, salesAnalytics, categoryPerformance, inventoryStatus, topProducts, purchaseVsSales, paymentMethods, staffPerformance } = stats;

    const COLORS = ['#FFD700', '#1E3A8A', '#059669', '#DC2626', '#64748B'];

    return (
        <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-8 animate-in fade-in duration-700 bg-[#f8fafc]">
            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-royalBlue">
                        {getGreeting()}, <span className="text-gold">ॲडमिन!</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-bold">व्यवसाय डॅशबोर्ड - {new Date().toLocaleDateString('mr-IN')}</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-gray-50">Filter ▼</button>
                    <button className="bg-royalBlue text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:bg-blue-800">Export 📥</button>
                </div>
            </div>

            {/* TOP ROW - KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Sales</p>
                        <span className="text-[10px] font-black bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{kpis.todaySales.trend}</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-2">₹{kpis.todaySales.value.toLocaleString()}</p>
                    <div className="h-10 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kpis.todaySales.chart.map((val, i) => ({ val, i }))}>
                                <Line type="monotone" dataKey="val" stroke="#1E3A8A" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current INVENTORY VALUE</p>
                    <p className="text-2xl font-black text-gray-800">₹{kpis.inventoryValue.value.toLocaleString()}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500">{kpis.inventoryValue.count} pieces</p>
                        <p className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{kpis.inventoryValue.lowStock} Low Stock Alert</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Profit Margin</p>
                    <p className="text-2xl font-black text-green-600">{kpis.profitMargin.value}%</p>
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${kpis.profitMargin.value}%` }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 text-right">Target: {kpis.profitMargin.target}%</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Customers</p>
                    <p className="text-2xl font-black text-gray-800">{kpis.activeCustomers.value}</p>
                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-xs font-bold text-gray-500">New this month: <span className="text-green-600 font-black">+{kpis.activeCustomers.newThisMonth}</span></p>
                        <p className="text-xs font-bold text-gray-500">Returning rate: <span className="text-royalBlue font-black">{kpis.activeCustomers.returningRate}%</span></p>
                    </div>
                </div>
            </div>

            {/* SECOND ROW - SALES ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest">Sales Performance (30 Days)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={salesAnalytics} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={v => `₹${v / 1000}k`} />
                                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <RechartsTooltip contentStyle={{ borderRadius: '10px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                <Bar yAxisId="left" dataKey="sales" name="Daily Sales" fill="#1E3A8A" radius={[4, 4, 0, 0]} opacity={0.8} />
                                <Line yAxisId="left" type="monotone" dataKey="profit" name="Daily Profit" stroke="#059669" strokeWidth={3} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="transactions" name="Transactions" stroke="#F59E0B" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-sm font-black text-gray-800 mb-2 uppercase tracking-widest">Category Performance</h3>
                    <div className="flex-1 w-full relative min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryPerformance} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {categoryPerformance.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip formatter={(val, name, props) => [`${val}% (₹${props.payload.amount.toLocaleString()})`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-gray-400">TOTAL</span>
                            <span className="text-lg font-black text-royalBlue">100%</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {categoryPerformance.map((c, i) => (
                            <div key={i} className="flex items-center gap-1.5 min-w-0">
                                <div className="w-2 h-2 flex-shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <span className="text-[9px] font-bold text-gray-600 truncate">{c.name.split('(')[0]}: {c.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* THIRD ROW - INVENTORY & PURCHASING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-800 mb-6 uppercase tracking-widest">Inventory Status</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={inventoryStatus} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4B5563', fontWeight: 'bold' }} width={80} />
                                <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {inventoryStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto lg:col-span-1">
                    <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest">Top Selling Items</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] text-gray-400 font-black uppercase border-b border-gray-100">
                                <th className="pb-2">Item Name</th>
                                <th className="pb-2 text-center">Units Sold</th>
                                <th className="pb-2 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topProducts.map((p, i) => (
                                <tr key={i}>
                                    <td className="py-3 text-[10px] font-bold text-gray-800 pr-2">{p.name}</td>
                                    <td className="py-3 text-xs font-bold text-gray-600 text-center">{p.units}</td>
                                    <td className="py-3 text-xs font-black text-royalBlue text-right">₹{(p.revenue / 1000).toFixed(0)}k</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest">Purchase vs Sales</h3>
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={purchaseVsSales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} tickFormatter={v => `${v / 1000}k`} />
                                <YAxis yAxisId="right" orientation="right" hide />
                                <RechartsTooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                <Bar yAxisId="left" dataKey="purchases" name="Purchases" fill="#64748B" barSize={10} radius={[2, 2, 0, 0]} />
                                <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#059669" barSize={10} radius={[2, 2, 0, 0]} />
                                <Line yAxisId="right" type="step" dataKey="margin" name="Margin %" stroke="#DC2626" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* FOURTH ROW - FINANCIAL & ALERTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-sm font-black text-gray-800 mb-2 uppercase tracking-widest">Payment Methods Breakdown</h3>
                    <div className="w-full" style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                                    {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip formatter={(val, name) => [`${val}%`, name]} contentStyle={{ borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
                        {paymentMethods.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 min-w-0">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-500 truncate leading-none">{p.name}</p>
                                    <p className="text-sm font-black text-gray-800 leading-snug">{p.value}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest border-b pb-2">Operational Alerts & Actions</h3>
                    <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
                        <div className="flex items-start gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                            <span className="text-red-500 mt-0.5">🔴</span>
                            <div>
                                <p className="text-xs font-black text-red-800">Critical Action Required</p>
                                <p className="text-[10px] font-bold text-red-600 mt-0.5">3 high-value items not moved in 6 months</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                            <span className="text-yellow-600 mt-0.5">🟡</span>
                            <div>
                                <p className="text-xs font-black text-yellow-800">Market Warning</p>
                                <p className="text-[10px] font-bold text-yellow-700 mt-0.5">Gold prices up 5% - consider repricing inventory</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                            <span className="text-green-500 mt-0.5">🟢</span>
                            <div>
                                <p className="text-xs font-black text-green-800">Goal Achieved</p>
                                <p className="text-[10px] font-bold text-green-700 mt-0.5">Monthly sales target exceeded by 4.2%</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-auto">
                        <Link to="/jewelry" className="bg-royalBlue text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-blue-800 text-center flex items-center justify-center">Add Product</Link>
                        <Link to="/settings" className="bg-gold text-royalBlue py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-yellow-500 text-center flex items-center justify-center">Update Prices</Link>
                        <Link to="/reports" className="bg-gray-800 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-black text-center flex items-center justify-center">Gen Report</Link>
                    </div>
                </div>
            </div>

            {/* FIFTH ROW - STAFF PERFORMANCE */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest">Staff Performance Dashboard</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[9px] text-gray-400 font-black uppercase border-b border-gray-100">
                            <th className="pb-3 text-left">Staff Member</th>
                            <th className="pb-3 text-right">Total Sales</th>
                            <th className="pb-3 text-right">Commission</th>
                            <th className="pb-3 text-right">Avg Transaction</th>
                            <th className="pb-3 text-center">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {staffPerformance.map((s, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                                <td className="py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-royalBlue font-black flex items-center justify-center text-xs flex-shrink-0">{s.name.charAt(0)}</div>
                                    <span className="text-sm font-black text-gray-800">{s.name}</span>
                                </td>
                                <td className="py-4 text-xs font-black text-gray-800 text-right">₹{s.sales.toLocaleString()}</td>
                                <td className="py-4 text-xs font-bold text-green-600 text-right">₹{s.comm.toLocaleString()}</td>
                                <td className="py-4 text-xs font-bold text-gray-500 text-right">₹{s.avg.toLocaleString()}</td>
                                <td className="py-4 text-xs tracking-widest text-gold text-center">{'⭐'.repeat(s.rating)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── App ─────────────────────────────────────────
function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ToastProvider>
            <BrowserRouter>
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
