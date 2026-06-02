import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

export default function Categories() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCat, setNewCat] = useState('');
    const [editId, setEditId] = useState(null);

    const [categories, setCategories] = useState([
        { id: 1, name: 'अंगठी (Rings)', icon: '💍', count: 45, color: 'from-yellow-400 to-yellow-600' },
        { id: 2, name: 'हार (Necklaces)', icon: '📿', count: 22, color: 'from-blue-400 to-blue-600' },
        { id: 3, name: 'कर्णभूषण (Earrings)', icon: '✨', count: 38, color: 'from-pink-400 to-pink-600' },
        { id: 4, name: 'बांगड्या (Bangles)', icon: '⭕', count: 60, color: 'from-green-400 to-green-600' },
        { id: 5, name: 'मंगळसूत्र (Mangalsutra)', icon: '🔗', count: 15, color: 'from-purple-400 to-purple-600' },
        { id: 6, name: 'नथ (Nose Pins)', icon: '💎', count: 30, color: 'from-red-400 to-red-600' },
    ]);

    const handleAddCategory = () => {
        if (!newCat.trim()) return;
        if (editId) {
            setCategories(categories.map(c => c.id === editId ? { ...c, name: newCat } : c));
        } else {
            setCategories([...categories, {
                id: Date.now(),
                name: newCat,
                icon: '✨',
                count: 0,
                color: 'from-gray-400 to-gray-600'
            }]);
        }
        setNewCat('');
        setEditId(null);
        setShowAddForm(false);
    };

    const handleEdit = (cat) => {
        setNewCat(cat.name);
        setEditId(cat.id);
        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("तुम्हाला खात्री आहे की तुम्ही ही श्रेणी हटवू इच्छिता?")) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">उत्पादन श्रेणी (Categories)</h2>
                <button onClick={() => { setShowAddForm(!showAddForm); setEditId(null); setNewCat(''); }} className="bg-gold hover:bg-yellow-500 text-royalBlue font-bold py-2 px-4 rounded shadow flex items-center space-x-2 transition-colors">
                    <Plus size={20} /><span>नवीन श्रेणी</span>
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-gold">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">{editId ? 'श्रेणी संपादित करा' : 'नवीन श्रेणी जोडा'}</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)} className="flex-1 border rounded p-2 focus:ring-2 focus:ring-gold outline-none" placeholder="श्रेणीचे नाव लिहा..." />
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200" onClick={() => { setShowAddForm(false); setEditId(null); setNewCat(''); }}>रद्द करा</button>
                            <button onClick={handleAddCategory} className="px-4 py-2 text-white bg-royalBlue rounded hover:bg-blue-800 shadow font-bold">जतन करा</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1">
                        <div className={`bg-gradient-to-r ${cat.color} p-6 text-white`}>
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">{cat.icon}</span>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(cat); }} className="p-1.5 bg-white/20 rounded hover:bg-white/40"><Edit size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }} className="p-1.5 bg-white/20 rounded hover:bg-white/40"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mt-3">{cat.name}</h3>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Package size={16} />
                                <span className="text-sm">एकूण उत्पादने</span>
                            </div>
                            <span className="text-2xl font-bold text-royalBlue">{cat.count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
