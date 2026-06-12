import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';

// ─── Components ───────────────────────────────────────
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MobileBottomNav from './components/MobileBottomNav';
import PWAInstallBanner from './components/PWAInstallBanner';

// ─── Lazy Loaded Pages ───────────────────────────────
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Jewelry = lazy(() => import('./pages/Jewelry'));
const Loans = lazy(() => import('./pages/Loans'));
const Collections = lazy(() => import('./pages/Collections'));
const Customers = lazy(() => import('./pages/Customers'));
const Categories = lazy(() => import('./pages/Categories'));
const Reports = lazy(() => import('./pages/Reports'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const Transactions = lazy(() => import('./pages/Transactions'));

// ─── Loading Fallback ────────────────────────────────
const PageLoader = () => (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
            <Loader2 className="animate-spin text-royalBlue mx-auto" size={48} />
            <p className="text-sm font-bold text-gray-400">कृपया प्रतीक्षा करा...</p>
        </div>
    </div>
);

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ToastProvider>
            <BrowserRouter>
                <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-marathi">
                    <PWAInstallBanner />
                    <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <TopBar toggleSidebar={() => setSidebarOpen(true)} />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar pb-16 md:pb-0">
                            <Suspense fallback={<PageLoader />}>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/jewelry" element={<Jewelry />} />
                                    <Route path="/categories" element={<Categories />} />
                                    <Route path="/loans" element={<Loans />} />
                                    <Route path="/collections" element={<Collections />} />
                                    <Route path="/transactions" element={<Transactions />} />
                                    <Route path="/customers" element={<Customers />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <MobileBottomNav />
                    </div>
                </div>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
