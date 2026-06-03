import React, { useState } from 'react';
import { Save, Shield, Bell, Palette, Database, User, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';


const NOTIFICATION_OPTIONS = [
    'हप्ता आठवण SMS',
    'व्याज देय तारीख सूचना',
    'कमी स्टॉक अलर्ट',
    'WhatsApp सूचना'
];

const ls = (key, fallback = '') => localStorage.getItem(key) ?? fallback;

export default function SettingsPage() {
    const toast = useToast();
    const [saved, setSaved] = useState(false);

    // Shop info
    const [shopName, setShopName] = useState(() => ls('shopName'));
    const [ownerName, setOwnerName] = useState(() => ls('ownerName'));
    const [address, setAddress] = useState(() => ls('address'));
    const [mobile, setMobile] = useState(() => ls('mobile'));

    // Rates
    const [goldRate, setGoldRate] = useState(() => ls('goldRate'));
    const [silverRate, setSilverRate] = useState(() => ls('silverRate'));
    const [interestDefault, setInterestDefault] = useState(() => ls('interestDefault'));

    // Notifications - stored as JSON array of enabled items
    const [notifications, setNotifications] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('notifications') || '[]');
        } catch {
            return [];
        }
    });

    const [lastBackup, setLastBackup] = useState(() => ls('lastBackup', 'अद्याप नाही'));

    // Security
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [passMsg, setPassMsg] = useState('');

    const toggleNotification = (item) => {
        setNotifications(prev =>
            prev.includes(item) ? prev.filter(n => n !== item) : [...prev, item]
        );
    };

    const handleSaveSettings = () => {
        localStorage.setItem('shopName', shopName);
        localStorage.setItem('ownerName', ownerName);
        localStorage.setItem('address', address);
        localStorage.setItem('mobile', mobile);
        localStorage.setItem('goldRate', goldRate);
        localStorage.setItem('silverRate', silverRate);
        localStorage.setItem('interestDefault', interestDefault);
        localStorage.setItem('notifications', JSON.stringify(notifications));

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChangePassword = () => {
        if (!currentPass || !newPass) {
            setPassMsg('कृपया दोन्ही पासवर्ड भरा.');
            return;
        }
        if (newPass.length < 6) {
            setPassMsg('नवीन पासवर्ड किमान ६ अक्षरे असावा.');
            return;
        }
        localStorage.setItem('appPassword', newPass);
        setCurrentPass('');
        setNewPass('');
        setPassMsg('पासवर्ड यशस्वीरित्या बदलला!');
        setTimeout(() => setPassMsg(''), 3000);
    };

    const handleBackup = () => {
        const dateStr = new Date().toLocaleString('mr-IN');
        setLastBackup(dateStr);
        localStorage.setItem('lastBackup', dateStr);
        window.open(`${window.location.protocol}//${window.location.hostname}:5000/api/backup`, '_blank');
    };

    const inputClass = "w-full border-2 border-gray-200 rounded-xl p-3 focus:border-royalBlue outline-none transition-all text-sm font-medium text-gray-800 bg-gray-50 focus:bg-white";

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-4xl pb-24 md:pb-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-royalBlue">सेटिंग्ज</h2>
                    <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">Settings & Configuration</p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-black px-4 py-2 rounded-xl shadow animate-in zoom-in duration-200">
                        <CheckCircle size={16} /> सेटिंग्ज जतन केल्या!
                    </div>
                )}
            </div>

            {/* Shop Profile */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-royalBlue/10 rounded-xl text-royalBlue"><User size={20} /></div>
                    <div>
                        <h3 className="text-base font-black text-gray-800">दुकान माहिती</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Shop Profile</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">दुकानाचे नाव</label>
                        <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="उदा. श्री कृष्णा ज्वेलर्स" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">मालकाचे नाव</label>
                        <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="उदा. रमेश पाटील" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">पत्ता</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="उदा. मुख्य बाजार, पुणे" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">मोबाईल नंबर</label>
                        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="उदा. 9876543210" className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Rate Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-gold/10 rounded-xl text-gold"><Palette size={20} /></div>
                    <div>
                        <h3 className="text-base font-black text-gray-800">दर सेटिंग्ज</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Rate Configuration</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">सोन्याचा दर (₹/ग्रॅम)</label>
                        <input type="number" value={goldRate} onChange={e => setGoldRate(e.target.value)} placeholder="उदा. 6500" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">चांदीचा दर (₹/ग्रॅम)</label>
                        <input type="number" value={silverRate} onChange={e => setSilverRate(e.target.value)} placeholder="उदा. 85" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">डीफॉल्ट व्याजदर (%)</label>
                        <input type="number" value={interestDefault} onChange={e => setInterestDefault(e.target.value)} placeholder="उदा. 2" className={inputClass} />
                    </div>
                </div>
                {goldRate && silverRate && (
                    <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-xl">
                        <p className="text-xs font-black text-gray-500">
                            📊 सध्याचे दर — सोने: <span className="text-gold">₹{Number(goldRate).toLocaleString()}/ग्रॅम</span> | चांदी: <span className="text-gray-700">₹{Number(silverRate).toLocaleString()}/ग्रॅम</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600"><Bell size={20} /></div>
                    <div>
                        <h3 className="text-base font-black text-gray-800">सूचना सेटिंग्ज</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Notification Preferences</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {NOTIFICATION_OPTIONS.map((item) => {
                        const isOn = notifications.includes(item);
                        return (
                            <label key={item} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isOn ? 'border-green-400 bg-green-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                <div onClick={() => toggleNotification(item)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isOn ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                    {isOn && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`text-sm font-bold ${isOn ? 'text-green-800' : 'text-gray-600'}`}>{item}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Security */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-red-50 rounded-xl text-red-500"><Shield size={20} /></div>
                    <div>
                        <h3 className="text-base font-black text-gray-800">सुरक्षितता</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Security Settings</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">सध्याचा पासवर्ड</label>
                        <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">नवीन पासवर्ड</label>
                        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="किमान ६ अक्षरे" className={inputClass} />
                    </div>
                </div>
                {passMsg && (
                    <p className={`mt-3 text-xs font-black ${passMsg.includes('यशस्वी') ? 'text-green-600' : 'text-red-500'}`}>{passMsg}</p>
                )}
                <button onClick={handleChangePassword} className="mt-4 px-6 py-2.5 bg-red-500 text-white text-xs font-black rounded-xl hover:bg-red-600 transition-all shadow-md">
                    पासवर्ड बदला
                </button>
            </div>

            {/* Backup */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Database size={20} /></div>
                    <div>
                        <h3 className="text-base font-black text-gray-800">डेटा बॅकअप</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Data Management</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleBackup} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-purple-700 transition-all shadow-md">💾 बॅकअप तयार करा</button>
                    <button onClick={() => toast('रिस्टोर सुविधा लवकरच उपलब्ध होईल.', 'info')} className="border-2 border-purple-500 text-purple-600 px-5 py-2.5 rounded-xl text-sm font-black hover:bg-purple-50 transition-all">🔁 बॅकअप रिस्टोर</button>
                    <button className="border-2 border-green-500 text-green-600 px-5 py-2.5 rounded-xl text-sm font-black hover:bg-green-50 transition-all">📊 Excel एक्सपोर्ट</button>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-3">🕒 शेवटचा बॅकअप: <span className="text-gray-600">{lastBackup}</span></p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end sticky bottom-6 md:static">
                <button onClick={handleSaveSettings} className="bg-royalBlue hover:bg-blue-800 text-white px-10 py-4 rounded-2xl shadow-2xl shadow-royalBlue/30 flex items-center gap-3 font-black text-base transition-all hover:scale-105 active:scale-95">
                    <Save size={20} /><span>सेटिंग्ज जतन करा</span>
                </button>
            </div>
        </div>
    );
}
