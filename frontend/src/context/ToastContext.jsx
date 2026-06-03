import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
};

const BG = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-royalBlue',
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-20 md:bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 ${BG[t.type]} text-white px-4 py-3 rounded-2xl shadow-2xl max-w-xs pointer-events-auto
                                    animate-in slide-in-from-right-4 fade-in duration-300`}
                    >
                        <span className="text-lg flex-shrink-0">{ICONS[t.type]}</span>
                        <span className="text-sm font-bold leading-tight">{t.message}</span>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="ml-1 text-white/60 hover:text-white text-xs font-black flex-shrink-0"
                        >✕</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
