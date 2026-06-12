import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowUpRight, ArrowDownRight, ShoppingBag, IndianRupee, FileText, Gem } from 'lucide-react';
import { apiService } from '../services/api';
import {
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Line, Bar, PieChart, Pie, Cell, ComposedChart, Legend
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState(15);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [goldRateInput, setGoldRateInput] = useState(localStorage.getItem('goldRate') || '7,200');
    const [silverRateInput, setSilverRateInput] = useState(localStorage.getItem('silverRate') || '92');
    const [isSavingRates, setIsSavingRates] = useState(false);

    const handleSaveRates = () => {
        setIsSavingRates(true);
        localStorage.setItem('goldRate', goldRateInput);
        localStorage.setItem('silverRate', silverRateInput);
        window.dispatchEvent(new Event('storage')); // Notify other components
        setTimeout(() => {
            setIsSavingRates(false);
        }, 800);
    };

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
                <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="flex-1">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">🏆 व्यवसाय डॅशबोर्ड</p>
                        <h2 className="text-2xl md:text-4xl font-black tracking-tight mt-1 md:mt-2 leading-tight">
                            {getGreeting()}, <br className="md:hidden" />
                            <span className="text-gold">{localStorage.getItem('ownerName') || 'रमेश पाटील'}</span>
                        </h2>
                        <p className="text-xs md:text-sm text-blue-100/80 font-bold mt-1.5 line-clamp-1">
                            {new Date().toLocaleDateString('mr-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        {/* Highlights Row */}
                        <div className="flex flex-wrap gap-2 md:gap-3 mt-5">
                            <div className="bg-white/10 border border-white/15 rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-center flex-1 md:flex-none min-w-[110px]">
                                <p className="text-[8px] md:text-[9px] text-blue-200 font-black uppercase tracking-widest whitespace-nowrap">महिन्याची विक्री</p>
                                <p className="text-base md:text-xl font-black text-gold">₹{kpis.monthTotalSales.toLocaleString('en-IN')}</p>
                            </div>
                            <div className={`rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-center flex-1 md:flex-none min-w-[110px] ${monthChange >= 0 ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                                <p className="text-[8px] md:text-[9px] text-blue-200 font-black uppercase tracking-widest whitespace-nowrap">तुलना</p>
                                <p className={`text-base md:text-xl font-black flex items-center justify-center gap-1 ${monthChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {monthChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {monthChange > 0 ? `+${monthChange}%` : `${monthChange}%`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rates & Filters Column */}
                    <div className="flex flex-col gap-4 lg:items-end shrink-0">
                        {/* Daily Rates Update Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 w-full lg:w-72 shadow-xl shadow-black/20">
                            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gold flex items-center gap-1.5">⚡ आजचे भाव अपडेट</span>
                                {isSavingRates && <span className="text-[8px] font-bold text-emerald-300 animate-pulse uppercase">जतन केले...</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <label className="block text-[8px] uppercase font-black text-blue-200 tracking-tighter">सोने (22K) प्रतिग्राम</label>
                                    <input type="text" value={goldRateInput} onChange={(e) => setGoldRateInput(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs font-black text-white outline-none focus:border-gold/50 transition-colors" placeholder="15,500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[8px] uppercase font-black text-blue-200 tracking-tighter">चांदी प्रतिग्राम</label>
                                    <input type="text" value={silverRateInput} onChange={(e) => setSilverRateInput(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs font-black text-white outline-none focus:border-gold/50 transition-colors" placeholder="250" />
                                </div>
                            </div>
                            <button onClick={handleSaveRates} className="w-full bg-gold hover:bg-gold/90 text-[#0a1128] py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">भाव अपडेट करा</button>
                        </div>

                        {/* Chart Filters */}
                        <div className="flex flex-wrap gap-2 items-center justify-end">
                            <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                                {[7, 15, 30, 60].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setSelectedRange(r)}
                                        className={`px-2 md:px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedRange === r ? 'bg-gold text-[#0a1128] shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {r} दिवस
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-[10px] md:text-xs font-black outline-none text-white shrink-0" />
                                <button onClick={() => setSelectedMonth(previousMonthLabel)} className="whitespace-nowrap px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest bg-white/10 text-white border border-white/15 shrink-0 hover:bg-white/20 transition-all">मागील</button>
                            </div>
                        </div>
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

export default Dashboard;
