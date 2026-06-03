import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Jewelry() {
    const toast = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: 'अंगठी (Rings)',
        metalType: 'Gold',
        weight: '',
        ratePerGram: '',
        makingCharges: '',
        totalPrice: '',
        stockCount: 1
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await apiService.getProducts({ search: searchTerm });
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-calculate total price
            if (name === 'weight' || name === 'ratePerGram' || name === 'makingCharges') {
                const weight = parseFloat(updated.weight) || 0;
                const rate = parseFloat(updated.ratePerGram) || 0;
                const making = parseFloat(updated.makingCharges) || 0;
                updated.totalPrice = (weight * rate) + making;
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await apiService.updateProduct(editId, formData);
            } else {
                await apiService.addProduct(formData);
            }
            setShowAddForm(false);
            setEditId(null);
            fetchProducts();
            toast(editId ? 'उत्पादन यशस्वीरित्या अपडेट केले!' : 'नवीन उत्पादन यशस्वीरित्या जोडले!', 'success');
            setFormData({
                name: '',
                category: 'अंगठी (Rings)',
                metalType: 'Gold',
                weight: '',
                ratePerGram: '',
                makingCharges: '',
                totalPrice: '',
                stockCount: 1
            });
        } catch (err) {
            toast('उत्पादन जतन करताना त्रुटी आली!', 'error');
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            category: product.category,
            metalType: product.metalType,
            weight: product.weight,
            ratePerGram: product.ratePerGram,
            makingCharges: product.makingCharges,
            totalPrice: product.totalPrice,
            stockCount: product.stockCount
        });
        setEditId(product.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("तुम्हाला खात्री आहे की तुम्ही हे उत्पादन हटवू इच्छिता?")) {
            try {
                await apiService.deleteProduct(id);
                fetchProducts();
                toast('उत्पादन यशस्वीरित्या हटवले!', 'success');
            } catch (err) {
                console.error(err);
                toast('उत्पादन हटवताना त्रुटी आली!', 'error');
            }
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">दागिने व्यवस्थापन (Jewelry)</h2>
                <button
                    onClick={() => {
                        setEditId(null);
                        setFormData({
                            name: '',
                            category: 'अंगठी (Rings)',
                            metalType: 'Gold',
                            weight: '',
                            ratePerGram: '',
                            makingCharges: '',
                            totalPrice: '',
                            stockCount: 1
                        });
                        setShowAddForm(!showAddForm);
                    }}
                    className="bg-gold hover:bg-yellow-500 text-royalBlue font-bold py-2 px-4 rounded shadow flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>नवीन उत्पादन जोडा</span>
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-gold animate-in fade-in duration-300">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">{editId ? 'उत्पादन संपादित करा' : 'नवीन उत्पादन फॉर्म'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">उत्पादनाचे नाव</label>
                            <input name="name" required value={formData.name} onChange={handleInputChange} type="text" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" placeholder="उदा. सोन्याची अंगठी" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">श्रेणी</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none">
                                <option>अंगठी (Rings)</option>
                                <option>हार (Necklaces)</option>
                                <option>कर्णभूषण (Earrings)</option>
                                <option>बांगड्या (Bangles)</option>
                                <option>मंगळसूत्र (Mangalsutra)</option>
                                <option>नथ (Nose Pins)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">धातू प्रकार</label>
                            <select name="metalType" value={formData.metalType} onChange={handleInputChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none">
                                <option value="Gold">Gold (सोने)</option>
                                <option value="Silver">Silver (चांदी)</option>
                                <option value="Diamond">Diamond (हिरा)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">वजन (ग्रॅम)</label>
                            <input name="weight" required value={formData.weight} onChange={handleInputChange} type="number" step="0.001" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" placeholder="0.0" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">प्रतिग्राम दर (₹)</label>
                            <input name="ratePerGram" required value={formData.ratePerGram} onChange={handleInputChange} type="number" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">कारागीर खर्च (₹)</label>
                            <input name="makingCharges" value={formData.makingCharges} onChange={handleInputChange} type="number" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-bold text-royalBlue">एकूण किंमत: ₹ {formData.totalPrice || 0}</label>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">स्टॉक</label>
                            <input name="stockCount" value={formData.stockCount} onChange={handleInputChange} type="number" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button type="button" className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200" onClick={() => { setShowAddForm(false); setEditId(null); }}>रद्द करा</button>
                        <button type="submit" className="px-4 py-2 text-white bg-royalBlue rounded hover:bg-blue-800 shadow font-bold transition-all hover:scale-105 active:scale-95">जतन करा</button>
                    </div>
                </form>
            )}

            {/* Tools / Filters */}
            <div className="flex space-x-4 bg-white p-4 rounded shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="दागिन्याचे नाव शोधा..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-gold outline-none transition-all"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border rounded-full text-gray-600 hover:bg-gray-50 transition-colors">
                    <Filter size={20} />
                    <span className="hidden sm:inline">फिल्टर</span>
                </button>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-2" size={40} />
                        <p>माहिती लोड होत आहे...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">कोणतेही उत्पादन सापडले नाही.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-royalBlue text-white text-sm uppercase tracking-wider">
                                    <th className="p-4">नाव</th>
                                    <th className="p-4">श्रेणी</th>
                                    <th className="p-4">धातू</th>
                                    <th className="p-4">वजन</th>
                                    <th className="p-4">किंमत</th>
                                    <th className="p-4">स्टॉक</th>
                                    <th className="p-4 text-center">कृती</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-blue-50/50 border-b last:border-0 transition-colors group">
                                        <td className="p-4 font-bold text-gray-800">{p.name}</td>
                                        <td className="p-4 text-gray-600 text-sm">{p.category}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-full tracking-tighter ${p.metalType === 'Gold' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : p.metalType === 'Diamond' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                {p.metalType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 font-mono">{p.weight}g</td>
                                        <td className="p-4 font-bold text-green-600">₹ {p.totalPrice.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${p.stockCount < 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-green-50 text-green-600'}`}>
                                                {p.stockCount} शिल्लक
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center space-x-3">
                                            <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 hover:scale-125 transition-transform"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 hover:scale-125 transition-transform"><Trash2 size={18} /></button>
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
