import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('daily');
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
        { key: 'daily', label: 'दैनिक विक्री' },
        { key: 'loan', label: 'कर्ज अहवाल' },
        { key: 'collection', label: 'वसुली अहवाल' },
        { key: 'profit', label: 'नफा-तोटा' },
    ];

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-royalBlue" size={50} /></div>;

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">अहवाल (Reports)</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center space-x-2 transition-colors">
                    <Download size={20} /><span>Excel डाउनलोड</span>
                </button>
            </div>

            {/* Summary Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl text-white shadow-xl">
                    <p className="text-xs opacity-70 font-black uppercase">विक्री अहवाल</p>
                    <p className="text-2xl font-black mt-2">₹ {data?.salesReport[0]?.total?.toLocaleString() || 0}</p>
                    <div className="flex items-center mt-3 text-[10px] font-bold"><TrendingUp size={14} className="mr-1" /> +१५% प्रगती</div>
                </div>
                {/* ... Other stats ... */}
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="flex border-b overflow-x-auto bg-gray-50/50">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.key ? 'bg-white border-t-4 border-gold text-royalBlue' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                                    <th className="p-4">तारीख</th>
                                    <th className="p-4">विक्री संख्या</th>
                                    <th className="p-4 text-right">एकूण रक्कम</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data?.salesReport.map((s, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-700">{s._id}</td>
                                        <td className="p-4 text-sm font-bold text-gray-500">{s.count} उत्पादने</td>
                                        <td className="p-4 text-right font-black text-green-600">₹ {s.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {data?.salesReport.length === 0 && <tr><td colSpan="3" className="p-10 text-center text-gray-400 font-bold">माहिती उपलब्ध नाही.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
