import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Phone, MapPin, User, Eye, Loader2, X, FileText, Calendar, IndianRupee } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Customers() {
    const toast = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);   // true only on very first load
    const [fetching, setFetching] = useState(false); // true on every background refresh
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const abortRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        address: '',
        aadhaar: '',
        email: ''
    });

    const fetchCustomers = async (searchVal = debouncedSearchTerm) => {
        // Cancel any in-flight request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        // Show subtle fetching indicator; full spinner only on initial empty state
        setFetching(true);
        try {
            const query = new URLSearchParams(searchVal ? { search: searchVal } : {}).toString();
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? `http://${window.location.hostname}:5000` : 'https://jewellery-shop-management-system.onrender.com')}/api/customers${query ? `?${query}` : ''}`,
                { signal: controller.signal }
            );
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            if (err.name !== 'AbortError') console.error(err);
        } finally {
            setFetching(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // reduced from 500ms → 300ms for snappier search
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchCustomers(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

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
                    {fetching
                        ? <Loader2 className="absolute left-3 top-2.5 text-royalBlue animate-spin" size={20} />
                        : <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="ग्राहक नावाने शोधा..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-royalBlue"
                    />
                </div>
            </div>

            {/* Customer List / Table */}
            {loading && customers.length === 0 ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-royalBlue" size={40} /></div>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8fafc] hidden md:table-header-group">
                                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="p-6 border-b">ग्राहक</th>
                                    <th className="p-6 border-b">संपर्क</th>
                                    <th className="p-6 border-b">पत्ता</th>
                                    <th className="p-6 border-b text-right">एकूण व्यवहार</th>
                                    <th className="p-6 border-b text-center">कृती</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 flex flex-col md:table-row-group p-4 md:p-0">
                                {customers.map((c) => (
                                    <tr key={c.id} className="hover:bg-gold/5 transition-colors group flex flex-col md:table-row bg-white md:bg-transparent rounded-xl md:rounded-none mb-4 md:mb-0 shadow-sm md:shadow-none border border-gray-100 md:border-none p-4 md:p-0 relative">
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 border-b md:border-none flex justify-between md:table-cell items-center">
                                            <div className="flex items-center space-x-3 w-full">
                                                <div>
                                                    <h3 className="font-black text-gray-800 text-lg md:text-base leading-tight md:leading-normal">{c.name}</h3>
                                                    <p className="text-[10px] text-gray-400 font-bold hidden md:block">ID: #{c.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 flex items-center gap-2 md:table-cell">
                                            <Phone size={14} className="text-gray-400 md:hidden" />
                                            <div>
                                                <p className="font-bold text-gray-700">{c.mobile}</p>
                                                {c.email && <p className="text-[10px] text-gray-400">{c.email}</p>}
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-2 md:mb-0 flex items-start gap-2 md:table-cell bg-gray-50/50 md:bg-transparent rounded-lg md:rounded-none mt-2 md:mt-0">
                                            <MapPin size={14} className="text-gray-400 md:hidden mt-1" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-600 truncate max-w-[200px] md:max-w-xs">{c.address || 'पत्ता उपलब्ध नाही'}</p>
                                                {c.aadhaar && <p className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">UID: {c.aadhaar}</p>}
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-6 mb-4 md:mb-0 flex justify-between md:table-cell items-center border-t md:border-none md:text-right pt-4 md:pt-6 mt-2 md:mt-0">
                                            <span className="md:hidden text-[10px] font-black text-gray-400 uppercase">एकूण व्यवहार:</span>
                                            <p className="font-black text-lg text-green-600">₹{(c.totalBusiness || 0).toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="p-2 md:p-6 text-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-none flex justify-center md:table-cell absolute md:relative right-4 top-4 md:right-auto md:top-auto w-max md:w-auto">
                                            <button
                                                onClick={() => setSelectedCustomer(c)}
                                                className="bg-white md:bg-royalBlue text-royalBlue md:text-white border border-gray-200 md:border-transparent p-2 md:px-4 md:py-2 md:rounded-xl rounded-full shadow-sm md:shadow-md hover:bg-gray-50 md:hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Eye size={18} className="md:w-4 md:h-4" />
                                                <span className="hidden md:inline font-bold text-xs">प्रोफाईल पाहणे</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {customers.length === 0 && <div className="text-center text-gray-400 p-16 font-bold flex flex-col items-center"><User size={48} className="mb-4 opacity-50" />कोणतेही ग्राहक सापडले नाहीत.</div>}
                    </div>
                </div>
            )}

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setSelectedCustomer(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-royalBlue to-blue-800 p-6 text-white relative">
                            <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 text-blue-200 hover:text-white bg-white/10 p-1 rounded-full"><X size={20} /></button>
                            <div className="flex items-center space-x-4">
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
