import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Loader2, IndianRupee, PieChart as PieChartIcon, Eye } from 'lucide-react';
import { apiService } from '../services/api';
import * as XLSX from 'xlsx';
import ReceiptModal from '../components/ReceiptModal';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('monthly');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [billType, setBillType] = useState('transaction');
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const res = await apiService.getReports();
                setData(res);
                if (res?.monthlySales?.length > 0) {
                    setSelectedMonth(res.monthlySales[0].month);
                }
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

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const shopName = 'श्री कृष्णा ज्वेलर्स';
        const today = new Date().toLocaleDateString('en-IN');

        // ── Sheet 1: Monthly Summary ──────────────────────────────────────
        const monthlySummaryData = [
            [`${shopName} — मासिक व्यवसाय अहवाल (Monthly Business Report)`],
            [`निर्यात तारीख: ${today}`],
            [],
            ['महिना (Month)', 'एकूण बिले (Bills)', 'एकूण विक्री रक्कम (₹)', 'अंदाजे नफा (₹)'],
            ...(data.monthlySales.map(s => [
                s.month,
                s.count,
                s.total,
                Math.round(s.profit)
            ]))
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(monthlySummaryData);
        ws1['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 26 }, { wch: 22 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'मासिक सारांश');

        // ── Sheet 2: All Transactions ─────────────────────────────────────
        const txHeaders = [
            [`${shopName} — व्यवहार तपशील (All Transactions)`],
            [`निर्यात तारीख: ${today}`],
            [],
            ['दिनांक', 'रसीद क्र.', 'प्रकार', 'ग्राहक / पक्ष', 'वस्तू', 'धातू', 'वजन (g)', 'दर (₹/g)', 'मजुरी (₹)', 'एकूण (₹)', 'अग्रीम (₹)', 'बाकी (₹)', 'स्थिती'],
        ];
        const txRows = (data.recentTransactions || []).map(t => [
            new Date(t.date).toLocaleDateString('en-IN'),
            `INV-${t.id}`,
            t.type === 'Sell' ? 'विक्री' : t.type === 'Purchase' ? 'खरेदी' : 'ऑर्डर',
            t.customerName || t.supplierName || '',
            t.itemName,
            t.metalType,
            t.weight,
            t.rate,
            t.makingCharges || 0,
            t.totalAmount,
            t.advancePaid || 0,
            t.balanceAmount || 0,
            t.status
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([...txHeaders, ...txRows]);
        ws2['!cols'] = [
            { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 22 }, { wch: 18 },
            { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 14 },
            { wch: 12 }, { wch: 12 }, { wch: 10 }
        ];
        XLSX.utils.book_append_sheet(wb, ws2, 'व्यवहार यादी');

        // ── Sheet 3: Loans & Interest ─────────────────────────────────────
        const loanHeaders = [
            [`${shopName} — कर्ज व व्याज अहवाल (Loans & Interest)`],
            [`निर्यात तारीख: ${today}`],
            [],
            ['कर्ज क्र.', 'ग्राहक', 'मोबाईल', 'गहाण वस्तू', 'शुद्धता', 'वजन (g)', 'कर्ज रक्कम (₹)', 'व्याजदर (%)', 'मुदत (महिने)', 'एकूण व्याज (₹)', 'भरलेले मुद्दल (₹)', 'भरलेले व्याज (₹)', 'शिल्लक मुद्दल (₹)', 'शिल्लक व्याज (₹)', 'परतफेड तारीख', 'स्थिती'],
        ];
        const loanRows = (data.loansList || []).map(l => {
            const expectedInt = l.totalInterest || (((l.loanAmount * l.interestRate) / 100) * (l.durationMonths || 12));
            return [
                `LN-${l.id}`,
                l.customerName,
                l.mobileNumber,
                l.collateralItem,
                l.purity || '',
                l.weight || '',
                l.loanAmount,
                l.interestRate,
                l.durationMonths,
                Math.round(expectedInt),
                l.amountPaid || 0,
                l.interestPaid || 0,
                Math.max(0, l.loanAmount - (l.amountPaid || 0)),
                Math.max(0, expectedInt - (l.interestPaid || 0)),
                new Date(l.repaymentDate).toLocaleDateString('en-IN'),
                l.status
            ];
        });
        const ws3 = XLSX.utils.aoa_to_sheet([...loanHeaders, ...loanRows]);
        ws3['!cols'] = [
            { wch: 8 }, { wch: 22 }, { wch: 14 }, { wch: 20 }, { wch: 8 },
            { wch: 8 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 16 },
            { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 10 }
        ];
        XLSX.utils.book_append_sheet(wb, ws3, 'कर्ज व व्याज');

        // ── Sheet 4: Profit Analysis ──────────────────────────────────────
        const profitHeaders = [
            [`${shopName} — नफा-तोटा विश्लेषण (Profit Analysis)`],
            [`निर्यात तारीख: ${today}`],
            [],
            ['महिना', 'एकूण विक्री (₹)', 'अंदाजे नफा (₹)', 'नफा %'],
        ];
        const profitRows = data.monthlySales.map(s => [
            s.month,
            s.total,
            Math.round(s.profit),
            s.total > 0 ? `${((s.profit / s.total) * 100).toFixed(1)}%` : '0%'
        ]);
        // Summary row
        const totalSales = data.monthlySales.reduce((sum, s) => sum + s.total, 0);
        const totalProfit = data.monthlySales.reduce((sum, s) => sum + Math.round(s.profit), 0);
        profitRows.push([], ['एकूण (Total)', totalSales, totalProfit, totalSales > 0 ? `${((totalProfit / totalSales) * 100).toFixed(1)}%` : '0%']);

        const ws4 = XLSX.utils.aoa_to_sheet([...profitHeaders, ...profitRows]);
        ws4['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, ws4, 'नफा विश्लेषण');

        // ── Download ──────────────────────────────────────────────────────
        const fileName = `ShreeKrishna_Report_${today.replace(/\//g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-royalBlue tracking-tight">📊 व्यवसाय अहवाल (Analysis)</h2>
                <button onClick={exportToExcel} className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-green-500/30 flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95">
                    <Download size={20} /><span>📊 Excel डाउनलोड (.xlsx)</span>
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
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-royalBlue" size={24} />
                                        <h3 className="text-lg font-black text-gray-700">महिना निवडा (Select Month):</h3>
                                    </div>
                                    <select
                                        className="px-6 py-2 border-2 border-gray-300 rounded-lg font-black text-royalBlue bg-white shadow-sm outline-none focus:border-royalBlue"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {data.monthlySales.map(s => (
                                            <option key={s.month} value={s.month}>{s.month}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dynamically Filtered Bills Section */}
                                <div className="overflow-x-auto rounded-xl border border-gray-100">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-royalBlue to-blue-800 text-[10px] font-black text-white uppercase tracking-widest border-b">
                                                <th className="p-4 rounded-tl-lg">दिनांक</th>
                                                <th className="p-4">रसीद क्र. (बिल)</th>
                                                <th className="p-4">प्रकार (Type)</th>
                                                <th className="p-4">ग्राहक/पार्टी</th>
                                                <th className="p-4">वस्तू तपशील</th>
                                                <th className="p-4 text-right">रक्कम</th>
                                                <th className="p-4 text-center rounded-tr-lg">कृती</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.recentTransactions
                                                .filter(t => t.date.startsWith(selectedMonth))
                                                .map((t, i) => (
                                                    <tr key={i} className="hover:bg-blue-50/50 transition-colors bg-white">
                                                        <td className="p-4 text-xs font-bold text-gray-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString('mr-IN')}</td>
                                                        <td className="p-4 font-bold text-red-600">INV-{t.id}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 text-[10px] font-black rounded border ${t.type === 'Sell' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                t.type === 'Purchase' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                    'bg-orange-50 text-orange-700 border-orange-200'
                                                                }`}>
                                                                {t.type === 'Sell' ? 'विक्री (Sale)' : t.type === 'Purchase' ? 'खरेदी (Purchase)' : 'ऑर्डर (Order)'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-black text-gray-800">{t.customerName || t.supplierName}</td>
                                                        <td className="p-4 font-medium text-sm text-gray-600">{t.itemName} ({t.weight}g, {t.metalType})</td>
                                                        <td className="p-4 text-right font-black text-royalBlue whitespace-nowrap">₹ {t.totalAmount.toLocaleString('en-IN')}</td>
                                                        <td className="p-4 text-center">
                                                            <button onClick={() => { setBillType('transaction'); setSelectedBill(t); }} className="bg-gray-50 border border-gray-200 text-royalBlue p-2 rounded-lg hover:bg-gold shadow-sm transition-all"><Eye size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {data.recentTransactions.filter(t => t.date.startsWith(selectedMonth)).length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="p-8 text-center text-gray-400 font-bold bg-gray-50">या महिन्यात कोणतेही व्यवहार आढळले नाहीत.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profit' && (
                        <div className="space-y-6">
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

                    {activeTab === 'loan' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-700">व्याज आणि कर्ज यादी (Interest & Loans List)</h3>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b">
                                            <th className="p-4">रसीद क्र.</th>
                                            <th className="p-4">ग्राहक</th>
                                            <th className="p-4">कर्ज रक्कम</th>
                                            <th className="p-4 text-orange-600">भरलेले व्याज</th>
                                            <th className="p-4 text-center">कृती</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.loansList?.filter(l => l.interestPaid > 0 || l.status === 'Active').map((l, i) => (
                                            <tr key={i} className="hover:bg-orange-50/50 transition-colors">
                                                <td className="p-4 font-bold text-gray-700">LN-{l.id}</td>
                                                <td className="p-4 font-black">{l.customerName}</td>
                                                <td className="p-4 font-bold text-gray-600">₹ {l.loanAmount.toLocaleString('en-IN')}</td>
                                                <td className="p-4 font-black text-orange-600">₹ {l.interestPaid.toLocaleString('en-IN')}</td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => { setBillType('loan'); setSelectedBill(l); }} className="bg-white border border-gray-200 text-royalBlue p-2 rounded-lg hover:bg-gold shadow-sm"><Eye size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'collection' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🏗️</div>
                            <h3 className="text-xl font-black text-gray-800">वसुली अहवाल लवकरच येत आहे</h3>
                            <p className="text-gray-500 font-medium text-sm max-w-md">सध्या तुम्ही वरील कार्ड्समध्ये थकित आणि प्राप्त रक्कम पाहू शकता.</p>
                        </div>
                    )}
                </div>
            </div>

            <ReceiptModal
                isOpen={!!selectedBill}
                onClose={() => setSelectedBill(null)}
                data={selectedBill}
                type={billType}
            />
        </div>
    );
}
