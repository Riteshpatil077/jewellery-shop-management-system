import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Loader2, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { apiService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('monthly');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const res = await apiService.getReports();
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const tabs = [
        { key: 'monthly', label: 'मासिक विक्री' },
        { key: 'profit', label: 'नफा-तोटा' },
        { key: 'loan', label: 'कर्ज अहवाल' },
        { key: 'collection', label: 'वसुली अहवाल' },
    ];

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-royalBlue" size={50} /></div>;

    if (!data || data.error || !data.monthlySales) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center text-red-500 font-bold">
                <p>माहिती लोड करण्यात त्रुटी आली. कृपया इंटरनेट तपासा आणि रीफ्रेश करा.</p>
                <p className="text-xs text-gray-400">{data?.error}</p>
            </div>
        );
    }

    const exportToCSV = () => {
        // Simple CSV export logic
        const headers = "महिना, एकूण विक्री, एकूण व्यवहार, नफा\n";
        const rows = data.monthlySales.map(s => `${s.month},${s.total},${s.count},${s.profit}`).join('\n');
        const csv = headers + rows;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reports_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-royalBlue tracking-tight">📊 व्यवसाय अहवाल (Analysis)</h2>
                <button onClick={exportToCSV} className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-green-500/30 flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95">
                    <Download size={20} /><span>Excel डाउनलोड</span>
                </button>
            </div>

            {/* Summary Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <BarChart3 size={100} />
                    </div>
                    <p className="text-xs opacity-70 font-black uppercase tracking-widest">एकूण मासिक विक्री</p>
                    <p className="text-2xl font-black mt-2">₹ {data?.monthlySales[0]?.total?.toLocaleString('en-IN') || 0}</p>
                    <p className="text-[10px] mt-1 font-bold text-blue-200">{data?.monthlySales[0]?.month || 'चालू महिना'}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp size={100} />
                    </div>
                    <p className="text-xs opacity-70 font-black uppercase tracking-widest">अंदाजे मासिक नफा</p>
                    <p className="text-2xl font-black mt-2">₹ {Math.round(data?.monthlySales[0]?.profit || 0).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] mt-1 font-bold text-green-200">१५% मार्जिन गृहीत</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <IndianRupee size={100} />
                    </div>
                    <p className="text-xs opacity-70 font-black uppercase tracking-widest">कर्ज व व्याज उत्पन्न</p>
                    <p className="text-2xl font-black mt-2">₹ {data?.loanStats?.interestEarned?.toLocaleString('en-IN') || 0}</p>
                    <p className="text-[10px] mt-1 font-bold text-orange-200">{data?.loanStats?.activeCount} कार्यरत कर्ज</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                        <PieChartIcon size={100} />
                    </div>
                    <p className="text-xs opacity-70 font-black uppercase tracking-widest">थकित वसुली</p>
                    <p className="text-2xl font-black mt-2">₹ {data?.collectionStats?.pending?.toLocaleString('en-IN') || 0}</p>
                    <p className="text-[10px] mt-1 font-bold text-purple-200">प्राप्त: ₹{data?.collectionStats?.collected?.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="flex border-b overflow-x-auto bg-gray-50/50 custom-scrollbar">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-white border-t-4 border-gold text-royalBlue shadow-sm' : 'text-gray-400 hover:text-gray-800 hover:bg-white/50'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'monthly' && (
                        <div className="space-y-6">
                            <div className="h-80 w-full bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[...data.monthlySales].reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={80} />
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'विक्री']} />
                                        <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b">
                                            <th className="p-4">महिना</th>
                                            <th className="p-4">एकूण व्यवहार</th>
                                            <th className="p-4 text-right">एकूण रक्कम</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.monthlySales.map((s, i) => (
                                            <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="p-4 font-black text-gray-700">{s.month}</td>
                                                <td className="p-4 text-sm font-bold text-gray-500">{s.count} बिल</td>
                                                <td className="p-4 text-right font-black text-royalBlue text-lg">₹ {s.total.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profit' && (
                        <div className="space-y-6">
                            <div className="h-80 w-full bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[...data.monthlySales].reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={80} />
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'नफा']} />
                                        <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b">
                                            <th className="p-4">महिना</th>
                                            <th className="p-4">विक्री</th>
                                            <th className="p-4 text-right">अंदाजे नफा (Profit)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.monthlySales.map((s, i) => (
                                            <tr key={i} className="hover:bg-green-50/50 transition-colors">
                                                <td className="p-4 font-black text-gray-700">{s.month}</td>
                                                <td className="p-4 text-sm font-bold text-gray-500">₹ {s.total.toLocaleString('en-IN')}</td>
                                                <td className="p-4 text-right font-black text-green-600 text-lg">₹ {Math.round(s.profit).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'loan' || activeTab === 'collection') && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🏗️</div>
                            <h3 className="text-xl font-black text-gray-800">सविस्तर अहवाल लवकरच येत आहे</h3>
                            <p className="text-gray-500 font-medium text-sm max-w-md">या विभागाचे सखोल विश्लेषण (Deep Analysis) ॲपच्या पुढील अपडेटमध्ये उपलब्ध होईल. सध्या तुम्ही वरील कार्ड्समध्ये थकित आणि प्राप्त रक्कम पाहू शकता.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
