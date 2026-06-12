import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Gem, IndianRupee } from 'lucide-react';
import { apiService } from '../services/api';

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
                            <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">सोने प्रतिग्राम</span>
                            <span className="text-[11px] font-black text-gray-800">₹{goldRate}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-1.5 shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">चांदी प्रतिग्राम</span>
                            <span className="text-[11px] font-black text-gray-800">₹{silverRate}</span>
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

export default TopBar;
