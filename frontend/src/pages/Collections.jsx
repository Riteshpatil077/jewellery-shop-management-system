import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, CheckCircle, AlertCircle, Loader2, Edit3 } from 'lucide-react';
import { apiService } from '../services/api';

export default function Collections() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [collections, setCollections] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        customerName: '',
        purchasedJewelry: '',
        totalAmount: '',
        advancePayment: 0,
        totalInstallments: 12,
        nextDueDate: ''
    });

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const data = await apiService.getCollections({ search: searchTerm });
            setCollections(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, [searchTerm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await apiService.updateCollection(editId, formData);
                setEditId(null);
            } else {
                await apiService.addCollection(formData);
            }
            setShowAddForm(false);
            fetchCollections();
            setFormData({
                customerName: '',
                purchasedJewelry: '',
                totalAmount: '',
                advancePayment: 0,
                totalInstallments: 12,
                nextDueDate: ''
            });
        } catch (err) {
            alert("वसुली माहिती जतन करताना त्रुटी आली!");
        }
    };

    const handleEdit = (c) => {
        setFormData({
            customerName: c.customerName,
            purchasedJewelry: c.purchasedJewelry,
            totalAmount: c.totalAmount,
            advancePayment: c.advancePayment || 0,
            totalInstallments: c.totalInstallments,
            nextDueDate: c.nextDueDate ? new Date(c.nextDueDate).toISOString().split('T')[0] : ''
        });
        setEditId(c.id);
        setShowAddForm(true);
    };

    const handlePay = async (id, amount) => {
        try {
            await fetch(`http://localhost:5000/api/collections/${id}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount || 0 })
            });
            setPaymentAmounts(prev => ({ ...prev, [id]: '' })); // Reset input
            fetchCollections();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAmountChange = (id, val) => {
        setPaymentAmounts(prev => ({ ...prev, [id]: val }));
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">वसुली व्यवस्थापन (Collections)</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="bg-gold hover:bg-yellow-500 text-royalBlue font-black py-2 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all hover:scale-105">
                    <Plus size={20} /><span>नवीन वसुली नोंद</span>
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-2xl border-t-8 border-gold animate-in zoom-in duration-300">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">{editId ? '✏️ वसुली एडिट करा' : '🏠 नवीन वसुली फॉर्म'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">ग्राहकाचे नाव</label>
                            <input required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">खरेदी केलेला दागिना</label>
                            <input required value={formData.purchasedJewelry} onChange={e => setFormData({ ...formData, purchasedJewelry: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">एकूण किंमत (₹)</label>
                            <input required value={formData.totalAmount} onChange={e => setFormData({ ...formData, totalAmount: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">आगाऊ रक्कम (₹)</label>
                            <input value={formData.advancePayment} onChange={e => setFormData({ ...formData, advancePayment: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">हप्त्याची संख्या</label>
                            <input required value={formData.totalInstallments} onChange={e => setFormData({ ...formData, totalInstallments: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">पहिल्या हप्त्याची तारीख</label>
                            <input required value={formData.nextDueDate} onChange={e => setFormData({ ...formData, nextDueDate: e.target.value })} type="date" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" className="px-6 py-2 text-gray-500 font-bold" onClick={() => { setShowAddForm(false); setEditId(null); setFormData({ customerName: '', purchasedJewelry: '', totalAmount: '', advancePayment: 0, totalInstallments: 12, nextDueDate: '' }); }}>रद्द करा</button>
                        <button type="submit" className="px-10 py-3 text-white bg-royalBlue rounded-xl shadow-xl font-black hover:bg-blue-800 transition-all">नोंद जतन करा</button>
                    </div>
                </form>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-yellow-400">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">चालू वसुली</p>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-3xl font-black text-gray-800">{collections.filter(c => c.status === 'Pending').length}</p>
                        <Calendar className="text-yellow-400" size={30} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-green-500">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">पूर्ण झालेले</p>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-3xl font-black text-green-600">{collections.filter(c => c.status === 'Completed').length}</p>
                        <CheckCircle className="text-green-500" size={30} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-red-500">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">थकित हप्ते</p>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-3xl font-black text-red-600">₹ {collections.reduce((acc, curr) => acc + curr.balanceAmount, 0).toLocaleString()}</p>
                        <AlertCircle className="text-red-500" size={30} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="ग्राहक नावाने शोधा..."
                        className="w-full pl-12 pr-6 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-4" size={50} />
                        <p className="font-bold">माहिती लोड होत आहे...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8fafc]">
                                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="p-6 border-b">ग्राहक तपशील</th>
                                    <th className="p-6 border-b">दागिना</th>
                                    <th className="p-6 border-b">एकूण / शिल्लक</th>
                                    <th className="p-6 border-b">हप्ते प्रगती</th>
                                    <th className="p-6 border-b">पुढील हप्ता</th>
                                    <th className="p-6 border-b text-center">कृती</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {collections.map((c) => (
                                    <tr key={c.id} className="hover:bg-gold/5 transition-colors group relative">
                                        <td className="p-6 relative">
                                            <button onClick={() => handleEdit(c)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white text-gray-400 hover:text-royalBlue rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-10"><Edit3 size={14} /></button>
                                            <div className="ml-6">
                                                <p className="font-black text-gray-800">{c.customerName}</p>
                                                <p className="text-[10px] text-gray-400 inline-block px-2 py-0.5 bg-gray-100 rounded mt-1 font-bold">ID: {c.id}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-gray-700 font-bold">{c.purchasedJewelry}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 font-bold">एकूण: ₹{c.totalAmount.toLocaleString()}</span>
                                                <span className="text-lg font-black text-red-600">बाकी: ₹{c.balanceAmount.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="w-32 bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
                                                <div className="bg-gold h-full transition-all duration-1000" style={{ width: `${Math.min(100, ((c.totalAmount - c.balanceAmount) / c.totalAmount) * 100)}%` }}></div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 w-32">
                                                <p className="text-[10px] font-black text-gray-500 uppercase">₹{(c.totalAmount - c.balanceAmount).toLocaleString()} वसूल</p>
                                                <p className="text-[10px] font-black text-gold uppercase">{Math.round(((c.totalAmount - c.balanceAmount) / c.totalAmount) * 100)}%</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`p-2 rounded-lg text-center ${c.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                <p className="text-[10px] font-black uppercase tracking-tighter">{c.status === 'Completed' ? 'पूर्ण' : 'तारीख'}</p>
                                                <p className="font-bold">{c.status === 'Completed' ? '✅' : new Date(c.nextDueDate).toLocaleDateString('mr-IN')}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {c.status !== 'Completed' && (
                                                <div className="flex flex-col space-y-2 items-center">
                                                    <input
                                                        type="number"
                                                        placeholder={`उदा. ${c.monthlyAmount}`}
                                                        value={paymentAmounts[c.id] !== undefined ? paymentAmounts[c.id] : c.monthlyAmount}
                                                        onChange={(e) => handleAmountChange(c.id, e.target.value)}
                                                        className="w-24 text-center border-2 border-gray-200 rounded-lg p-1.5 focus:border-royalBlue outline-none text-sm font-bold shadow-sm"
                                                    />
                                                    <button
                                                        onClick={() => handlePay(c.id, paymentAmounts[c.id] !== undefined ? paymentAmounts[c.id] : c.monthlyAmount)}
                                                        className="bg-royalBlue text-white text-xs font-black px-5 py-2 rounded-xl hover:shadow-xl hover:bg-blue-800 transition-all hover:-translate-y-1 w-full"
                                                    >
                                                        हप्ता भरा
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
