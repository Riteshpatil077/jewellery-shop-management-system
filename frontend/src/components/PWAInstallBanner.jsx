import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowBanner(true); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setShowBanner(false);
        setDeferredPrompt(null);
    };
    if (!showBanner) return null;
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-royalBlue to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
                <span className="text-2xl">💍</span>
                <div>
                    <p className="text-xs font-black">अॅप इन्स्टॉल करा - फोनवर वापरा</p>
                    <p className="text-[10px] text-blue-200 font-bold">इंटरनेटशिवायही काम करते</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleInstall} className="bg-gold text-royalBlue text-[11px] font-black px-4 py-2 rounded-xl active:scale-95 transition-all">इन्स्टॉल</button>
                <button onClick={() => setShowBanner(false)} className="text-blue-200 p-1"><X size={18} /></button>
            </div>
        </div>
    );
};

export default PWAInstallBanner;
