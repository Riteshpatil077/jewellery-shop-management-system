import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, Clock, ShoppingCart, ShoppingBag, Truck, Loader2, Send, Share2, Mail } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Transactions() {
    const toast = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState(''); // 'Sell', 'Purchase', 'Order'
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [profitData, setProfitData] = useState(null);
    const [showProfitSummary, setShowProfitSummary] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Purchase',
        customerName: '',
        supplierName: '',
        mobile: '',
        itemName: '',
        metalType: 'Gold',
        weight: '',
        rate: localStorage.getItem('goldRate') || '',
        makingCharges: '',
        totalAmount: '',
        advancePaid: 0,
        notes: '',
        dueDate: '',
        exchangeItemName: '',
        exchangeWeight: '',
        exchangePurity: '', // टंच (Fine)
        exchangeFineWeight: 0, // फाईन वजन
        exchangeRate: '',
        exchangeValue: 0,
        purchaseRate: '', // खरेदी दर
        productId: null
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await apiService.getTransactions({ search: searchTerm, type: filterType });
            setTransactions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfitData = async () => {
        try {
            const data = await apiService.getProfitAnalysis();
            setProfitData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await apiService.getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchProfitData();
        fetchProducts();
    }, [searchTerm, filterType]);

    useEffect(() => {
        const w = parseFloat(formData.weight) || 0;
        const r = parseFloat(formData.rate) || 0;
        const mc = parseFloat(formData.makingCharges) || 0;
        const exVal = parseFloat(formData.exchangeValue) || 0;

        if (w > 0 && r > 0) {
            setFormData(prev => ({ ...prev, totalAmount: Math.round((w * r) + mc) }));
        }
    }, [formData.weight, formData.rate, formData.makingCharges]);

    // Calculate Exchange Value (Fine based)
    useEffect(() => {
        const ew = parseFloat(formData.exchangeWeight) || 0;
        const ep = parseFloat(formData.exchangePurity) || 0; // percentage
        const er = parseFloat(formData.exchangeRate) || 0;

        const fineWeight = (ew * ep) / 100;
        const value = Math.round(fineWeight * er);

        setFormData(prev => ({
            ...prev,
            exchangeFineWeight: fineWeight.toFixed(3),
            exchangeValue: value
        }));
    }, [formData.exchangeWeight, formData.exchangePurity, formData.exchangeRate]);

    // Auto-fill rate from settings when metalType changes
    useEffect(() => {
        const rateMap = {
            'Gold': localStorage.getItem('goldRate') || '',
            'Silver': localStorage.getItem('silverRate') || '',
            'Diamond': ''
        };
        setFormData(prev => ({ ...prev, rate: rateMap[prev.metalType] || '' }));
    }, [formData.metalType]);

    // Auto-fetch purchase Rate from products when itemName matches
    useEffect(() => {
        if (!formData.itemName || formData.type === 'Purchase') return;

        const matchedProduct = products.find(p =>
            p.name.toLowerCase() === formData.itemName.toLowerCase() &&
            p.metalType === formData.metalType
        );

        if (matchedProduct) {
            setFormData(prev => ({
                ...prev,
                purchaseRate: matchedProduct.ratePerGram,
                weight: prev.weight || matchedProduct.weight // Optional: auto-fill weight if empty
            }));
        }
    }, [formData.itemName, formData.metalType, products]);

    // Handle product selection
    const handleProductSelect = (p) => {
        setFormData(prev => ({
            ...prev,
            itemName: p.name,
            metalType: p.metalType,
            weight: p.weight,
            purchaseRate: p.ratePerGram,
            productId: p.id,
            makingCharges: p.makingCharges || prev.makingCharges
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.addTransaction(formData);
            setShowAddForm(false);
            fetchTransactions();
            toast('व्यवहार यशस्वीरित्या नोंदवला गेला!', 'success');
            setFormData({
                type: 'Purchase', customerName: '', supplierName: '', mobile: '', itemName: '',
                metalType: 'Gold', weight: '', rate: localStorage.getItem('goldRate') || '',
                makingCharges: '', totalAmount: '', advancePaid: 0, notes: '', dueDate: '',
                exchangeItemName: '', exchangeWeight: '', exchangePurity: '', exchangeFineWeight: 0,
                exchangeRate: '', exchangeValue: 0, purchaseRate: '', productId: null
            });
        } catch (err) {
            toast('व्यवहार नोंदवताना त्रुटी आली!', 'error');
        }
    };

    const handlePay = async (id) => {
        const amount = paymentAmounts[id];
        if (!amount || amount <= 0) { toast('कृपया योग्य रक्कम टाका.', 'warning'); return; }
        try {
            await apiService.payTransaction(id, amount);
            setPaymentAmounts(prev => ({ ...prev, [id]: '' }));
            fetchTransactions();
        } catch (err) {
            toast('पेमेंट अपडेट करताना त्रुटी आली.', 'error');
        }
    };

    const getIconPrefix = (type) => {
        switch (type) {
            case 'Sell': return <ShoppingBag className="text-green-500" size={16} />;
            case 'Purchase': return <ShoppingCart className="text-blue-500" size={16} />;
            case 'Order': return <Truck className="text-orange-500" size={16} />;
            default: return null;
        }
    };

    const handleShareWhatsApp = (t) => {
        const message = `*श्री कृष्णा ज्वेलर्स - ऑर्डर तपशील*%0A---------------------------%0A*वस्तू:* ${t.itemName}%0A*धातू:* ${t.metalType}%0A*वजन:* ${t.weight}g%0A*एकूण रक्कम:* ₹${t.totalAmount.toLocaleString()}%0A*आगाऊ रक्कम:* ₹${t.advancePaid.toLocaleString()}%0A*बाकी रक्कम:* ₹${t.balanceAmount.toLocaleString()}%0A*डिलिव्हरी तारीख:* ${t.dueDate ? new Date(t.dueDate).toLocaleDateString('mr-IN') : '-'}%0A---------------------------%0Aधन्यवाद!`;
        const url = `https://wa.me/${t.mobile ? t.mobile.replace(/\+/g, '') : ''}?text=${message}`;
        window.open(url, '_blank');
    };

    const handleShareEmail = (t) => {
        const subject = `ऑर्डर तपशील - श्री कृष्णा ज्वेलर्स`;
        const body = `नमस्कार, %0D%0A%0D%0Aतुमच्या ऑर्डरचे तपशील खालीलप्रमाणे आहेत: %0D%0A%0D%0Aवस्तू: ${t.itemName} %0D%0Aवजन: ${t.weight}g %0D%0Aएकूण रक्कम: ₹${t.totalAmount.toLocaleString()} %0D%0Aआगाऊ रक्कम: ₹${t.advancePaid.toLocaleString()} %0D%0Aबाकी रक्कम: ₹${t.balanceAmount.toLocaleString()} %0D%0Aडिलिव्हरी तारीख: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString('mr-IN') : '-'} %0D%0A%0D%0Aधन्यवाद, %0D%0Aश्री कृष्णा ज्वेलर्स`;
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'Sell': return 'विक्री (Sale)';
            case 'Purchase': return 'खरेदी (Purchase)';
            case 'Order': return 'ऑर्डर (Order)';
            default: return type;
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">व्यवहार व्यवस्थापन (Sales & Orders)</h2>
                <div className="flex space-x-3">
                    <button onClick={() => setShowProfitSummary(!showProfitSummary)} className="bg-royalBlue text-white font-bold py-2 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all hover:scale-105 border-2 border-white/20">
                        <CheckCircle size={18} /><span>नफा विश्लेषण (Profit Analysis)</span>
                    </button>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="bg-gold hover:bg-yellow-500 text-royalBlue font-black py-2 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all hover:scale-105">
                        <Plus size={20} /><span>नवीन नोंद</span>
                    </button>
                </div>
            </div>

            {showProfitSummary && profitData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-xl text-white">
                        <div className="flex justify-between items-start mb-4">
                            <ShoppingBag size={30} className="opacity-50" />
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-1 rounded">विक्री (Sales)</span>
                        </div>
                        <p className="text-2xl font-black">₹{profitData.totalSales.toLocaleString()}</p>
                        <p className="text-xs font-bold opacity-80 mt-1">{profitData.salesWeight.toFixed(2)}g सोनं विक्री</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-xl text-white">
                        <div className="flex justify-between items-start mb-4">
                            <ShoppingCart size={30} className="opacity-50" />
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-1 rounded">खरेदी (Purchase)</span>
                        </div>
                        <p className="text-2xl font-black">₹{profitData.totalPurchases.toLocaleString()}</p>
                        <p className="text-xs font-bold opacity-80 mt-1">{profitData.purchaseWeight.toFixed(2)}g सोनं खरेदी</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-xl text-white">
                        <div className="flex justify-between items-start mb-4">
                            <Clock size={30} className="opacity-50" />
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-1 rounded">मजुरी (Making)</span>
                        </div>
                        <p className="text-2xl font-black">₹{profitData.totalMaking.toLocaleString()}</p>
                        <p className="text-xs font-bold opacity-80 mt-1">निव्वळ कारागिरी नफा</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border-t-8 border-royalBlue relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <CheckCircle size={30} className="text-royalBlue/20" />
                            <span className="text-[10px] font-black uppercase tracking-wider bg-royalBlue/10 text-royalBlue px-2 py-1 rounded">निव्वळ नफा (Calculated Profit)</span>
                        </div>
                        <p className={`text-3xl font-black ${profitData.calculatedProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>₹{profitData.calculatedProfit.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-2">*(Rate Diff + Making Charges)</p>
                        <div className="absolute -bottom-2 -right-2 transform rotate-12 opacity-5 pointer-events-none">
                            <CheckCircle size={100} className="text-royalBlue" />
                        </div>
                    </div>
                </div>
            )}

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-gold animate-in zoom-in duration-300">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">नवीन व्यवहार</h3>

                    <div className="flex space-x-6 mb-6">
                        {['Purchase', 'Sell', 'Order'].map(t => (
                            <label key={t} className="flex items-center space-x-2 cursor-pointer font-bold">
                                <input type="radio" value={t} checked={formData.type === t} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-4 h-4 text-royalBlue" />
                                <span>{getTypeLabel(t)}</span>
                            </label>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Name (Sell/Order) OR Supplier Name (Purchase) */}
                        {formData.type !== 'Purchase' && (
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2">ग्राहकाचे नाव</label>
                                <input required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                            </div>
                        )}
                        {formData.type === 'Purchase' && (
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2">🏢 होलसेलरचे नाव (Supplier / Wholesaler Shop)</label>
                                <input required value={formData.supplierName} onChange={e => setFormData({ ...formData, supplierName: e.target.value, customerName: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" placeholder="उदा. गणेश ज्वेलर्स, मुंबई" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">मोबाईल नंबर (पर्यायी)</label>
                            <input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">वस्तूचे नाव (Item Name)</label>
                            {formData.type === 'Sell' ? (
                                <select
                                    className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none font-bold"
                                    onChange={(e) => {
                                        const p = products.find(prod => prod.id === parseInt(e.target.value));
                                        if (p) handleProductSelect(p);
                                    }}
                                    value={formData.productId || ""}
                                >
                                    <option value="">-- स्टॉकमधून निवडा (Inventory Item) --</option>
                                    {products.filter(p => p.isAvailable).map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.weight}g - {p.metalType})</option>
                                    ))}
                                    <option value="custom">-- इतर (List मध्ये नाही) --</option>
                                </select>
                            ) : (
                                <input required value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" placeholder={formData.type === 'Order' ? "उदा. नवीन दागिन्यांची ऑर्डर" : "उदा. होलसेलरकडून खरेदी"} />
                            )}

                            {(formData.type === 'Sell' && formData.productId === null) && (
                                <input required value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} type="text" className="w-full border-2 rounded-xl p-3 mt-2 focus:border-gold outline-none placeholder-gray-300" placeholder="वस्तूचे नाव टाईप करा..." />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">धातू प्रकार</label>
                            <select value={formData.metalType} onChange={e => setFormData({ ...formData, metalType: e.target.value })} className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none font-bold text-gray-700">
                                <option value="Gold">सोने (Gold)</option>
                                <option value="Silver">चांदी (Silver)</option>
                                <option value="Diamond">डायमंड (Diamond)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">वजन (ग्रॅम)</label>
                            <input required value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} type="number" step="0.01" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">दर (Sale Rate / g)</label>
                            <input required value={formData.rate} onChange={e => setFormData({ ...formData, rate: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        {formData.type === 'Sell' && (
                            <div>
                                <label className="block text-xs font-black text-blue-400 uppercase mb-2 text-blue-600">खरेदी दर (Cost Rate / g)</label>
                                <input value={formData.purchaseRate} onChange={e => setFormData({ ...formData, purchaseRate: e.target.value })} type="number" className="w-full border-2 border-blue-100 rounded-xl p-3 focus:border-royalBlue outline-none bg-blue-50/30" placeholder="गुंतवणूक किंमत" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">मजुरी (Making Charges)</label>
                            <input value={formData.makingCharges} onChange={e => setFormData({ ...formData, makingCharges: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">एकूण किंमत (₹)</label>
                            <input required value={formData.totalAmount} onChange={e => setFormData({ ...formData, totalAmount: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none font-bold bg-gray-50" readOnly />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">भरलेली रक्कम (Paid Amount)</label>
                            <input value={formData.advancePaid} onChange={e => setFormData({ ...formData, advancePaid: e.target.value })} type="number" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" placeholder={formData.type === 'Purchase' ? "पूर्ण रक्कम" : "जमा रक्कम"} />
                        </div>
                        {formData.type === 'Order' && (
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2">डिलीव्हरी तारीख</label>
                                <input value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} type="date" className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" />
                            </div>
                        )}
                        <div className={(formData.type === 'Order' ? "md:col-span-3" : "md:col-span-1")}>
                            <label className="block text-xs font-black text-gray-400 uppercase mb-2">नोंद (Notes)</label>
                            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full border-2 rounded-xl p-3 focus:border-gold outline-none" rows="1" placeholder="अतिरिक्त माहिती..."></textarea>
                        </div>
                    </div>

                    {/* Exchange Section - Only for Sell or Order */}
                    {(formData.type === 'Sell' || formData.type === 'Order') && (
                        <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                            <h4 className="text-sm font-black text-royalBlue mb-4 flex items-center space-x-2">
                                <Plus size={16} className="bg-royalBlue text-white rounded-full p-0.5" />
                                <span>जुने सोने/चांदी मोड (Exchange / Return)</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">मोड वस्तूचे नाव</label>
                                    <input value={formData.exchangeItemName} onChange={e => setFormData({ ...formData, exchangeItemName: e.target.value })} type="text" className="w-full border rounded-lg p-2 focus:border-royalBlue outline-none text-sm" placeholder="उदा. जुनी अंगठी" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">वजन (g)</label>
                                    <input value={formData.exchangeWeight} onChange={e => setFormData({ ...formData, exchangeWeight: e.target.value })} type="number" step="0.01" className="w-full border rounded-lg p-2 focus:border-royalBlue outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">टंच/फाईन (%)</label>
                                    <input value={formData.exchangePurity} onChange={e => setFormData({ ...formData, exchangePurity: e.target.value })} type="number" step="0.1" className="w-full border rounded-lg p-2 focus:border-royalBlue outline-none text-sm" placeholder="उदा. 75" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">फाईन वजन</label>
                                    <input value={formData.exchangeFineWeight} readOnly type="number" className="w-full border rounded-lg p-2 bg-gray-100 outline-none text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">आजचा दर</label>
                                    <input value={formData.exchangeRate} onChange={e => setFormData({ ...formData, exchangeRate: e.target.value })} type="number" className="w-full border rounded-lg p-2 focus:border-royalBlue outline-none text-sm font-bold" />
                                </div>
                                <div className="md:col-span-6 flex justify-end">
                                    <div className="bg-white px-4 py-2 rounded-lg border border-blue-200">
                                        <span className="text-[10px] font-black text-gray-400 uppercase mr-3">मोड एकूण किंमत:</span>
                                        <span className="text-lg font-black text-blue-700">₹{formData.exchangeValue.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            {formData.exchangeValue > 0 && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg flex justify-between items-center border border-green-100">
                                    <span className="text-sm font-bold text-gray-600">निव्वळ देय रक्कम (Payable After Exchange):</span>
                                    <span className="text-lg font-black text-green-700">₹{(formData.totalAmount - formData.exchangeValue).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" className="px-6 py-2 text-gray-500 font-bold" onClick={() => setShowAddForm(false)}>रद्द करा</button>
                        <button type="submit" className="px-10 py-3 text-white bg-royalBlue rounded-xl shadow-xl font-black hover:bg-blue-800 transition-all">व्यवहार जतन करा</button>
                    </div>
                </form>
            )}

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-2">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="ग्राहक किंवा वस्तूच्या नावाने शोधा..."
                        className="w-full pl-12 pr-6 py-3 bg-transparent rounded-xl outline-none transition-all font-bold text-gray-700"
                    />
                </div>

                <div className="flex space-x-1 bg-gray-150 p-1.5 rounded-xl shadow-inner overflow-x-auto w-full md:w-max bg-gray-100 items-center hide-scrollbar">
                    <button onClick={() => setFilterType('')} className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${filterType === '' ? 'bg-white shadow-md border-b-2 border-royalBlue text-royalBlue' : 'text-gray-500 hover:bg-gray-200'}`}>सर्व (All)</button>
                    <button onClick={() => setFilterType('Purchase')} className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all flex items-center space-x-2 whitespace-nowrap ${filterType === 'Purchase' ? 'bg-white shadow-md border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}><ShoppingCart size={14} /><span>खरेदी (Buy)</span></button>
                    <button onClick={() => setFilterType('Sell')} className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all flex items-center space-x-2 whitespace-nowrap ${filterType === 'Sell' ? 'bg-white shadow-md border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:bg-gray-200'}`}><ShoppingBag size={14} /><span>विक्री (Sell)</span></button>
                    <button onClick={() => setFilterType('Order')} className={`px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition-all flex items-center space-x-2 whitespace-nowrap ${filterType === 'Order' ? 'bg-white shadow-md border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:bg-gray-200'}`}><Truck size={14} /><span>ऑर्डर्स (Order)</span></button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-4" size={50} />
                        <p className="font-bold">माहिती लोड होत आहे...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8fafc] hidden md:table-header-group">
                                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="p-6 border-b">प्रकार</th>
                                    <th className="p-6 border-b">ग्राहक / होलसेलर</th>
                                    <th className="p-6 border-b">वस्तूचा तपशील</th>
                                    <th className="p-6 border-b">एकूण रक्कम</th>
                                    <th className="p-6 border-b">स्थिती / बाकी</th>
                                    <th className="p-6 border-b text-center">कृती</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 flex flex-col md:table-row-group">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gold/5 transition-colors group flex flex-col md:table-row bg-white md:bg-transparent rounded-xl md:rounded-none mb-4 md:mb-0 shadow-sm md:shadow-none border border-gray-100 md:border-none p-4 md:p-0">
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 border-b md:border-none flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black text-gray-400 uppercase">प्रकार:</span>
                                            <div className="flex flex-col md:flex-col gap-1 items-end md:items-start">
                                                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-gray-100 rounded-full">{getIconPrefix(t.type)} {getTypeLabel(t.type)}</span>
                                                <p className="text-[9px] text-gray-400 font-bold">{new Date(t.date).toLocaleDateString('mr-IN')}</p>
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black text-gray-400 uppercase">नाव:</span>
                                            <div className="text-right md:text-left">
                                                <p className="font-black text-gray-800">{t.type === 'Purchase' ? `🏢 ${t.customerName}` : t.customerName}</p>
                                                {t.mobile && <p className="text-[10px] text-gray-400 font-bold">{t.mobile}</p>}
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 flex justify-between md:table-cell items-center bg-gray-50/50 md:bg-transparent rounded-lg md:rounded-none">
                                            <span className="md:hidden text-[10px] font-black text-gray-400 uppercase">तपशील:</span>
                                            <div className="text-right md:text-left">
                                                <p className="text-gray-700 font-bold">{t.itemName}</p>
                                                <p className="text-[10px] md:text-xs text-gray-400 font-bold">{t.metalType} • {t.weight}g @ ₹{t.rate}</p>
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black text-gray-400 uppercase">रक्कम:</span>
                                            <div className="text-right md:text-left">
                                                <p className="font-black text-lg text-gray-800">₹{t.totalAmount.toLocaleString()}</p>
                                                {t.exchangeValue > 0 && (
                                                    <div className="mt-1 text-[9px] md:text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm inline-block">
                                                        - ₹{t.exchangeValue.toLocaleString()} मोड ({t.exchangeItemName})
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-4 md:mb-0 flex justify-between md:table-cell items-center border-t md:border-none pt-4 md:pt-6">
                                            <span className="md:hidden text-[10px] font-black text-gray-400 uppercase">स्थिती:</span>
                                            <div className="flex flex-col items-end md:items-start">
                                                <span className={`text-[10px] md:text-xs font-black uppercase px-2 py-1 rounded w-max ${t.status === 'Completed' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{t.status === 'Completed' ? 'पूर्ण' : 'बाकी'}</span>
                                                {t.balanceAmount > 0 && <span className="font-black text-red-600 mt-1">₹{t.balanceAmount.toLocaleString()} बाकी</span>}
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 text-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-none flex justify-center md:table-cell">
                                            <div className="flex flex-col md:flex-col gap-2 items-center w-full md:w-auto">
                                                {t.balanceAmount > 0 ? (
                                                    <>
                                                        <input
                                                            type="number"
                                                            placeholder="रक्कम"
                                                            value={paymentAmounts[t.id] || ''}
                                                            onChange={(e) => setPaymentAmounts(prev => ({ ...prev, [t.id]: e.target.value }))}
                                                            className="w-full md:w-24 text-center border-2 border-gray-200 rounded-xl p-2 md:p-1.5 focus:border-royalBlue outline-none text-sm font-bold shadow-sm"
                                                        />
                                                        <button
                                                            onClick={() => handlePay(t.id)}
                                                            className="w-full bg-royalBlue text-white text-xs font-black px-4 py-2.5 md:py-2 rounded-xl shadow-md hover:bg-blue-800 transition-all active:scale-95"
                                                        >
                                                            जमा करा
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-300">✅ पूर्ण</span>
                                                )}
                                                {(t.type === 'Sell' || t.type === 'Order') && (
                                                    <div className="flex gap-2 w-full justify-center mt-2">
                                                        <button onClick={() => setSelectedTransaction(t)} title="Profit Analysis" className="text-[10px] font-black text-royalBlue hover:underline flex items-center gap-1 justify-center bg-blue-50 py-1 px-2 rounded-lg">
                                                            <CheckCircle size={12} /> नफा रसीद
                                                        </button>
                                                        {t.type === 'Order' && (
                                                            <>
                                                                <button onClick={() => handleShareWhatsApp(t)} title="WhatsApp Share" className="text-green-600 bg-green-50 p-1.5 rounded-lg hover:scale-110 transition-all">
                                                                    <Send size={16} />
                                                                </button>
                                                                <button onClick={() => handleShareEmail(t)} title="Email Share" className="text-royalBlue bg-blue-50 p-1.5 rounded-lg hover:scale-110 transition-all">
                                                                    <Mail size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Profit Receipt Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print-overlay overflow-y-auto">
                    <style>{`
                        @media print {
                            body * { visibility: hidden !important; }
                            .print-target, .print-target * { visibility: visible !important; color: black !important; background: white !important; }
                            .print-target { 
                                position: absolute;
                                left: 50%;
                                top: 0;
                                transform: translateX(-50%);
                                width: 100%;
                                max-width: 400px;
                                padding: 20px;
                                box-shadow: none !important;
                                border: none !important;
                            }
                            .no-print { display: none !important; }
                            .print-border-black { border: 2px solid black !important; border-radius: 0px !important; }
                            .print-bg-light { background: #f9f9f9 !important; border: 1px solid #ddd !important; }
                        }
                    `}</style>
                    <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 print-target print-border-black my-auto">
                        <div className="bg-gradient-to-r from-royalBlue to-blue-900 p-6 text-white text-center relative no-print">
                            <h3 className="text-xl font-black tracking-widest text-gold drop-shadow-md">नफा विश्लेषण रसीद</h3>
                        </div>

                        {/* Printable Header */}
                        <div className="text-center border-b-2 border-black border-dashed pb-4 mb-6 pt-6 px-8">
                            <h1 className="text-3xl font-black text-black tracking-tighter">श्री कृष्णा ज्वेलर्स</h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">शुद्धतेची व विश्वासाची परंपरा</p>
                            <div className="mt-4 border-y border-black py-1.5">
                                <p className="text-[11px] font-black text-black uppercase tracking-widest bg-gray-100 py-1 print-bg-light">व्यवहार नफा अहवाल</p>
                            </div>
                        </div>

                        <div className="px-8 pb-10 space-y-6">
                            <div className="flex justify-between border-b border-gray-300 pb-4">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">वस्तू (Item)</p>
                                    <p className="font-black text-lg text-black">{selectedTransaction.itemName}</p>
                                    <p className="text-[10px] font-bold text-gray-500">{selectedTransaction.metalType} • {selectedTransaction.weight}g</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">तारीख (Date)</p>
                                    <p className="font-bold text-black border-b border-gray-300 pb-0.5">{new Date(selectedTransaction.date).toLocaleDateString('mr-IN')}</p>
                                    <p className="text-[9px] font-black text-gray-400 mt-1 uppercase">Ref: #{selectedTransaction.id}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs font-bold text-gray-600">खरेदी किंमत (Cost):</span>
                                    <span className="font-black text-sm text-gray-800">₹{(selectedTransaction.purchaseRate * selectedTransaction.weight).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs font-bold text-gray-600">विक्री किंमत (Sales):</span>
                                    <span className="font-black text-sm text-gray-800">₹{selectedTransaction.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs font-bold text-gray-600">मजुरी किंमत (Making):</span>
                                    <span className="font-black text-sm text-gray-800">₹{selectedTransaction.makingCharges.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="border-2 border-black rounded-2xl p-5 flex justify-between items-center bg-gray-50 print-bg-light shadow-inner shadow-gray-200/50">
                                    <span>
                                        <p className="text-xl font-black text-black">निव्वळ नफा</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Total Net Profit</p>
                                    </span>
                                    <span className="text-3xl font-black text-green-700 print:text-black drop-shadow-sm">
                                        ₹{Math.round(((selectedTransaction.rate - selectedTransaction.purchaseRate) * selectedTransaction.weight) + selectedTransaction.makingCharges).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-12 flex justify-between items-end px-2">
                                <div className="text-center w-32 border-t border-black border-dashed pt-2">
                                    <p className="text-[10px] font-bold">व्यवस्थापकाची सही</p>
                                </div>
                                <div className="text-center w-32 border-t border-black border-dashed pt-2">
                                    <p className="text-[10px] font-bold">ग्राहकाची सही</p>
                                </div>
                            </div>

                            <div className="text-center pt-8 opacity-60">
                                <p className="text-[8px] text-black italic tracking-[0.4em] font-black">।। धन्यवाद ।।</p>
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-gray-50 flex gap-4 no-print border-t border-gray-200">
                            <button onClick={() => setSelectedTransaction(null)} className="flex-1 bg-white border border-gray-300 text-gray-600 py-3.5 rounded-xl font-black text-sm shadow-sm hover:bg-gray-100 hover:text-red-500 transition-colors">
                                रद्द करा (Cancel)
                            </button>
                            <button onClick={() => window.print()} className="flex-1 bg-royalBlue text-white py-3.5 rounded-xl font-black text-sm shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                🖨️ प्रिंट रसीद
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
