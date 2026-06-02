import React, { useState } from 'react';
import { Save, Shield, Bell, Palette, Database, User } from 'lucide-react';

export default function SettingsPage() {
    const [shopName, setShopName] = useState(() => localStorage.getItem('shopName') || 'श्री कृष्णा ज्वेलर्स');
    const [goldRate, setGoldRate] = useState(() => localStorage.getItem('goldRate') || 6500);
    const [silverRate, setSilverRate] = useState(() => localStorage.getItem('silverRate') || 85);
    const [interestDefault, setInterestDefault] = useState(() => localStorage.getItem('interestDefault') || 2);
    const [lastBackup, setLastBackup] = useState(() => localStorage.getItem('lastBackup') || 'अद्याप नाही');

    const handleSaveSettings = () => {
        localStorage.setItem('shopName', shopName);
        localStorage.setItem('goldRate', goldRate);
        localStorage.setItem('silverRate', silverRate);
        localStorage.setItem('interestDefault', interestDefault);
        alert('सेटिंग्ज यशस्वीरीत्या जतन केल्या आहेत!');
    };

    const handleBackup = () => {
        const dateStr = new Date().toLocaleString('mr-IN');
        setLastBackup(dateStr);
        localStorage.setItem('lastBackup', dateStr);
        window.open('http://localhost:5000/api/backup', '_blank');
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-royalBlue">सेटिंग्ज (Settings)</h2>

            {/* Shop Profile */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-4 text-royalBlue"><User size={20} /><h3 className="text-lg font-semibold">दुकान माहिती</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">दुकानाचे नाव</label>
                        <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">मालकाचे नाव</label>
                        <input type="text" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" defaultValue="कृष्णा ज्वेलर्स" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">पत्ता</label>
                        <input type="text" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" defaultValue="मुख्य बाजार, पुणे" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">मोबाईल</label>
                        <input type="text" className="w-full border rounded p-2 focus:ring-2 focus:ring-royalBlue outline-none" defaultValue="9876543210" />
                    </div>
                </div>
            </div>

            {/* Rate Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-4 text-gold"><Palette size={20} /><h3 className="text-lg font-semibold text-gray-800">दर सेटिंग्ज</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">सोन्याचा दर (₹/ग्रॅम)</label>
                        <input type="number" value={goldRate} onChange={(e) => setGoldRate(e.target.value)} className="w-full border rounded p-2 focus:ring-2 focus:ring-gold outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">चांदीचा दर (₹/ग्रॅम)</label>
                        <input type="number" value={silverRate} onChange={(e) => setSilverRate(e.target.value)} className="w-full border rounded p-2 focus:ring-2 focus:ring-gold outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">डीफॉल्ट व्याजदर (%)</label>
                        <input type="number" value={interestDefault} onChange={(e) => setInterestDefault(e.target.value)} className="w-full border rounded p-2 focus:ring-2 focus:ring-gold outline-none" />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-4 text-green-600"><Bell size={20} /><h3 className="text-lg font-semibold text-gray-800">सूचना सेटिंग्ज</h3></div>
                <div className="space-y-3">
                    {['हप्ता आठवण SMS', 'व्याज देय तारीख सूचना', 'कमी स्टॉक अलर्ट', 'WhatsApp सूचना'].map((item, i) => (
                        <label key={i} className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 text-royalBlue rounded" />
                            <span className="text-gray-700">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-4 text-red-600"><Shield size={20} /><h3 className="text-lg font-semibold text-gray-800">सुरक्षितता</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">सध्याचा पासवर्ड</label>
                        <input type="password" className="w-full border rounded p-2 focus:ring-2 focus:ring-red-400 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">नवीन पासवर्ड</label>
                        <input type="password" className="w-full border rounded p-2 focus:ring-2 focus:ring-red-400 outline-none" />
                    </div>
                </div>
            </div>

            {/* Backup */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-4 text-purple-600"><Database size={20} /><h3 className="text-lg font-semibold text-gray-800">डेटा बॅकअप</h3></div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleBackup} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">बॅकअप तयार करा</button>
                    <button onClick={() => alert('रिस्टोर करण्यासाठी फाईल निवडा... (भविष्यात उपलब्ध होईल)')} className="border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50 transition-colors">बॅकअप रिस्टोर करा</button>
                    <button className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50 transition-colors">Excel एक्सपोर्ट</button>
                </div>
                <p className="text-xs text-gray-400 mt-2">शेवटचा बॅकअप: {lastBackup}</p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button onClick={handleSaveSettings} className="bg-royalBlue hover:bg-blue-800 text-white px-8 py-3 rounded-lg shadow-lg flex items-center space-x-2 font-bold text-lg transition-colors">
                    <Save size={20} /><span>सेटिंग्ज जतन करा</span>
                </button>
            </div>
        </div>
    );
}
