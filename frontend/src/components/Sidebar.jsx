import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gem, PieChart as PieChartIcon, IndianRupee, FileText, Users, BarChart3, Settings, X, LogOut, ShoppingBag } from 'lucide-react';

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

export default Sidebar;
