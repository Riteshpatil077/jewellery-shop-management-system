import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Search, ChevronRight, LayoutGrid, List } from 'lucide-react';

const INITIAL_CATEGORIES = [
    { id: 1, name: 'मंगळसूत्र (Mangalsutra)', icon: '🔗', count: 124, color: 'from-[#B45309] to-[#92400E]', type: 'Gold' },
    { id: 2, name: 'हार व नेकलेस (Necklaces)', icon: '📿', count: 86, color: 'from-[#1E3A8A] to-[#1E40AF]', type: 'Gold' },
    { id: 3, name: 'अंगठी (Rings)', icon: '💍', count: 215, color: 'from-[#D97706] to-[#B45309]', type: 'Gold/Silver' },
    { id: 4, name: 'झुमके व कानसाखळी (Earrings)', icon: '✨', count: 158, color: 'from-[#BE185D] to-[#9D174D]', type: 'Gold/Diamond' },
    { id: 5, name: 'बांगड्या व पाटल्या (Bangles)', icon: '⭕', count: 192, color: 'from-[#059669] to-[#047857]', type: 'Gold' },
    { id: 6, name: 'पैंजण व जोडवी (Payal)', icon: '👣', count: 340, color: 'from-[#4B5563] to-[#374151]', type: 'Silver' },
    { id: 7, name: 'साखळी व चैन (Chains)', icon: '⛓️', count: 95, color: 'from-[#4338CA] to-[#3730A3]', type: 'Gold' },
    { id: 8, name: 'नाथ व नथनी (Nose Pins)', icon: '💎', count: 64, color: 'from-[#DB2777] to-[#BE185D]', type: 'Gold' },
    { id: 9, name: 'सिक्के व वेढणी (Coins/Bars)', icon: '🪙', count: 42, color: 'from-[#F59E0B] to-[#D97706]', type: 'Investment' },
];

export default function Categories() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', type: 'Gold', icon: '✨' });
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = () => {
        if (!newCat.name.trim()) return;
        if (editId) {
            setCategories(categories.map(c => c.id === editId ? { ...c, ...newCat } : c));
        } else {
            setCategories([...categories, {
                id: Date.now(),
                ...newCat,
                count: 0,
                color: 'from-gray-500 to-gray-700'
            }]);
        }
        setNewCat({ name: '', type: 'Gold', icon: '✨' });
        setEditId(null);
        setShowAddForm(false);
    };

    const handleEdit = (cat) => {
        setNewCat({ name: cat.name, type: cat.type, icon: cat.icon });
        setEditId(cat.id);
        setShowAddForm(true);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0a1128] tracking-tight">उत्पादन श्रेणी <span className="text-royalBlue">व्यवस्थापन</span></h2>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Inventory & Category Control</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="शोध (नावे, धातू...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none focus:border-royalBlue/30 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => { setShowAddForm(true); setEditId(null); }}
                        className="bg-royalBlue hover:bg-blue-800 text-white p-3 rounded-2xl shadow-lg shadow-royalBlue/20 transition-all active:scale-95"
                    >
                        <Plus size={22} />
                    </button>
                </div>
            </div>

            {/* Quick Stats & Controls */}
            <div className="flex items-center justify-between bg-white px-5 py-4 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto scroll-hide gap-4">
                <div className="flex items-center gap-6 shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">एकूण श्रेणी</span>
                        <span className="text-xl font-black text-royalBlue">{categories.length}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">एकूण स्टॉक आयटम्स</span>
                        <span className="text-xl font-black text-gray-800">{categories.reduce((acc, curr) => acc + curr.count, 0)}</span>
                    </div>
                </div>

                <div className="flex items-center bg-gray-50 p-1 rounded-xl shrink-0">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-royalBlue shadow-sm' : 'text-gray-400'}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-royalBlue shadow-sm' : 'text-gray-400'}`}><List size={18} /></button>
                </div>
            </div>

            {/* Add/Edit Form Overlay */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-royalBlue/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-2xl font-black text-gray-800 mb-6">{editId ? 'श्रेणी संपादित करा' : 'नवीन श्रेणी'}</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">श्रेणीचे नाव</label>
                                <input
                                    type="text"
                                    value={newCat.name}
                                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-royalBlue/20 rounded-2xl p-4 text-sm font-bold outline-none transition-all placeholder:text-gray-300"
                                    placeholder="उदा. साखळी व चैन"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">धातू प्रकार</label>
                                    <select
                                        value={newCat.type}
                                        onChange={e => setNewCat({ ...newCat, type: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-royalBlue/20 rounded-2xl p-4 text-sm font-bold outline-none cursor-pointer"
                                    >
                                        <option>Gold</option>
                                        <option>Silver</option>
                                        <option>Diamond</option>
                                        <option>Mixed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">चिन्ह (Icon)</label>
                                    <input
                                        type="text"
                                        value={newCat.icon}
                                        onChange={e => setNewCat({ ...newCat, icon: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-royalBlue/20 rounded-2xl p-4 text-center text-xl font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-2xl font-black text-sm transition-all active:scale-95">रद्द करा</button>
                                <button onClick={handleSave} className="flex-2 bg-royalBlue hover:bg-blue-800 text-white py-4 px-8 rounded-2xl font-black text-sm transition-all shadow-lg shadow-royalBlue/20 active:scale-95">जतन करा</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => (
                        <div key={cat.id} className="group relative bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-[60px]`} />

                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg relative`}>
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-[2px]" />
                                    <span className="relative">{cat.icon}</span>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(cat)} className="p-2 text-gray-300 hover:text-royalBlue hover:bg-blue-50 rounded-xl transition-all"><Edit size={16} /></button>
                                    <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-black text-[#0a1128] leading-tight group-hover:text-royalBlue transition-colors">{cat.name}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{cat.type}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Package size={14} className="group-hover:animate-bounce" />
                                        <span className="text-[10px] font-black uppercase">स्टॉक आयटम्स</span>
                                    </div>
                                    <span className="text-lg font-black text-royalBlue">{cat.count}</span>
                                </div>
                            </div>

                            <ChevronRight className="absolute bottom-6 right-6 text-royalBlue opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={20} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="text-left py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">श्रेणी / धातू</th>
                                <th className="text-center py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">आयटम संख्या</th>
                                <th className="text-right py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">कृती</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((cat) => (
                                <tr key={cat.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-lg shadow-sm shadow-black/10`}>
                                                {cat.icon}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm">{cat.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{cat.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-center">
                                        <span className="bg-royalBlue/5 text-royalBlue px-3 py-1 rounded-full text-xs font-black">{cat.count} नमुना</span>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-royalBlue bg-gray-50 rounded-xl transition-all"><Edit size={16} /></button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
