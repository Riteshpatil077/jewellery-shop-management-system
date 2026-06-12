import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, IndianRupee, FileText, Users, Gem, PieChart as PieChartIcon, BarChart3, Settings, Menu } from 'lucide-react';

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

export default MobileBottomNav;
