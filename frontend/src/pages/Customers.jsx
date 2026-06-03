import React, { useState, useEffect } from 'react';
import { Plus, Search, Phone, MapPin, User, Eye, Loader2, X, FileText, Calendar, IndianRupee } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Customers() {
    const toast = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        address: '',
        aadhaar: '',
        email: ''
    });

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getCustomers({ search: searchTerm });
            setCustomers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [searchTerm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.addCustomer(formData);
            setShowAddForm(false);
            fetchCustomers();
            setFormData({ name: '', mobile: '', address: '', aadhaar: '', email: '' });
            toast('नवीन ग्राहक यशस्वीरित्या जोडला!', 'success');
        } catch (err) {
            toast('ग्राहक नोंदणी करताना त्रुटी आली!', 'error');
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">ग्राहक यादी (Customers)</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="bg-royalBlue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow flex items-center space-x-2 transition-transform hover:scale-105">
                    <Plus size={20} /><span>नवीन ग्राहक</span>
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-royalBlue animate-in slide-in-from-top duration-300">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">नवीन ग्राहक नोंदणी</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">ग्राहकाचे नाव</label>
                            <input required name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-royalBlue" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">मोबाईल नंबर</label>
                            <input required name="mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} type="text" className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-royalBlue" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">पत्ता</label>
                            <input name="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} type="text" className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-royalBlue" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">आधार कार्ड नंबर</label>
                            <input name="aadhaar" value={formData.aadhaar} onChange={e => setFormData({ ...formData, aadhaar: e.target.value })} type="text" className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-royalBlue" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">ईमेल (पर्यायी)</label>
                            <input name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-royalBlue" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 text-gray-600 bg-gray-100 rounded" onClick={() => setShowAddForm(false)}>रद्द करा</button>
                        <button type="submit" className="px-6 py-2 text-white bg-royalBlue rounded shadow font-bold">नोंदणी करा</button>
                    </div>
                </form>
            )}

            {/* Search */}
            <div className="bg-white p-4 rounded shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="ग्राहक नावाने शोधा..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-royalBlue"
                    />
                </div>
            </div>

            {/* Customer Cards */}
            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-royalBlue" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map((c) => (
                        <div key={c.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-gold p-5">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-royalBlue flex items-center justify-center text-white font-bold text-lg">
                                    {c.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{c.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1"><Phone size={12} /> {c.mobile}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-3"><MapPin size={14} /> {c.address || 'पत्ता उपलब्ध नाही'}</p>
                            <div className="grid grid-cols-3 gap-2 text-center border-t pt-3">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">व्यवहार</p>
                                    <p className="font-bold text-green-600">₹{(c.totalBusiness || 0) / 1000}K</p>
                                </div>
                                <div className="col-span-2">
                                    <button
                                        onClick={() => setSelectedCustomer(c)}
                                        className="w-full text-center text-xs border border-royalBlue text-royalBlue py-1.5 rounded hover:bg-royalBlue hover:text-white transition-colors flex items-center justify-center gap-1 font-bold"
                                    >
                                        <Eye size={14} /> तपशील
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {customers.length === 0 && <div className="col-span-3 text-center text-gray-500 p-10 font-bold">कोणतेही ग्राहक साखडले नाहीत.</div>}
                </div>
            )}

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setSelectedCustomer(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-royalBlue to-blue-800 p-6 text-white relative">
                            <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 text-blue-200 hover:text-white bg-white/10 p-1 rounded-full"><X size={20} /></button>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-royalBlue font-black text-2xl shadow-lg border-2 border-white/20">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                                    <p className="text-blue-200 text-sm flex items-center gap-1"><Phone size={14} /> {selectedCustomer.mobile}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1"><IndianRupee size={12} /> एकूण व्यवहार</p>
                                    <p className="text-xl font-black text-green-600 mt-1">₹{(selectedCustomer.totalBusiness || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> नोंदणी तारीख</p>
                                    <p className="text-sm font-bold text-gray-700 mt-1">{new Date(selectedCustomer.createdAt || Date.now()).toLocaleDateString('mr-IN')}</p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-50">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">पत्ता</p>
                                        <p className="text-sm text-gray-700 font-bold">{selectedCustomer.address || 'नोंदवलेला नाही'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">आधार कार्ड</p>
                                        <p className="text-sm text-gray-700 font-mono tracking-widest">{selectedCustomer.aadhaar || 'नोंदवलेला नाही'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-400 mt-0.5 font-black text-sm">@</span>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">ईमेल</p>
                                        <p className="text-sm text-gray-700">{selectedCustomer.email || 'नोंदवलेला नाही'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
