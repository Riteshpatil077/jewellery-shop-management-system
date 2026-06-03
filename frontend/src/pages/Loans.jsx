import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Loader2, IndianRupee, Printer, X, Image as ImageIcon, Edit3 } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Loans() {
    const toast = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        customerName: '',
        mobileNumber: '',
        address: '',
        aadhaarCard: '',
        collateralItem: '',
        weight: '',
        purity: '22K',
        loanAmount: '',
        interestRate: 2,
        durationMonths: 12,
        repaymentDate: '',
        collateralImage: null
    });

    // Modals state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentLoanId, setPaymentLoanId] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('interest');

    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, collateralImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    }; const fetchLoans = async () => {
        try {
            setLoading(true);
            const data = await apiService.getLoans({ search: searchTerm });
            setLoans(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, [searchTerm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.addLoan(formData);
            setShowAddForm(false);
            fetchLoans();
            toast('नवीन कर्ज नोंद यशस्वीरित्या केली!', 'success');
            setFormData({
                customerName: '',
                mobileNumber: '',
                address: '',
                aadhaarCard: '',
                collateralItem: '',
                weight: '',
                purity: '22K',
                loanAmount: '',
                interestRate: 2,
                durationMonths: 12,
                repaymentDate: '',
                collateralImage: null
            });
        } catch (err) {
            toast('कर्ज नोंदवताना त्रुटी आली!', 'error');
        }
    };

    const openPaymentModal = (id) => {
        setPaymentLoanId(id);
        setShowPaymentModal(true);
    };

    const submitPayment = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:5000/api/loans/${paymentLoanId}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(paymentAmount), paymentType })
            });
            setShowPaymentModal(false);
            setPaymentAmount('');
            setPaymentType('interest');
            fetchLoans();
            toast('पेमेंट यशस्वीरित्या नोंदवले गेले!', 'success');
        } catch (err) {
            console.error(err);
            toast('पेमेंट जमा करताना त्रुटी आली!', 'error');
        }
    };

    const openReceipt = (loan) => {
        setSelectedLoan(loan);
        setShowReceiptModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDateChange = async (id, newDate) => {
        if (!newDate) return;
        try {
            await apiService.updateLoanDate(id, newDate);
            fetchLoans();
        } catch (err) {
            console.error(err);
            toast('तारीख बदलताना त्रुटी आली.', 'error');
        }
    };
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-royalBlue">कर्ज व्यवस्थापन (Loans)</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-royalBlue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95"
                >
                    <Plus size={20} />
                    <span>नवीन कर्ज नोंद</span>
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-royalBlue animate-in slide-in-from-top duration-300">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700 font-marathi">नवीन कर्ज फॉर्म</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3"><h4 className="text-gold font-black border-l-4 border-gold pl-2">▶ ग्राहक माहिती</h4></div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ग्राहकाचे नाव</label>
                            <input name="customerName" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} type="text" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">मोबाईल नंबर</label>
                            <input name="mobileNumber" required value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} type="text" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">पत्ता</label>
                            <input name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} type="text" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" />
                        </div>

                        <div className="md:col-span-3"><h4 className="text-gold font-black border-l-4 border-gold pl-2 mt-4">▶ कर्ज आणि गहाण माहिती</h4></div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">गहाण वस्तू</label>
                            <input name="collateralItem" required value={formData.collateralItem} onChange={(e) => setFormData({ ...formData, collateralItem: e.target.value })} type="text" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" placeholder="उदा. सोन्याची चेन" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">गहाण वस्तूचे वजन (ग्रॅम)</label>
                            <input name="weight" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} type="number" step="0.01" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" placeholder="उदा. १०.५" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">शुद्धता</label>
                            <select name="purity" value={formData.purity} onChange={(e) => setFormData({ ...formData, purity: e.target.value })} className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all">
                                <option value="24K">24K</option>
                                <option value="22K">22K</option>
                                <option value="18K">18K</option>
                                <option value="Silver">Silver</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">कर्जाची रक्कम (₹)</label>
                            <input name="loanAmount" required value={formData.loanAmount} onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })} type="number" className="w-full border-2 rounded-lg p-3 font-bold text-royalBlue focus:border-royalBlue outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">व्याजदर (% दरमहा)</label>
                            <input name="interestRate" required value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} type="number" step="0.1" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">मुदत (महिने)</label>
                            <input name="durationMonths" required value={formData.durationMonths} onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })} type="number" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">परतफेड तारीख</label>
                            <input name="repaymentDate" required value={formData.repaymentDate} onChange={(e) => setFormData({ ...formData, repaymentDate: e.target.value })} type="date" className="w-full border-2 rounded-lg p-3 focus:border-royalBlue outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">गहाण वस्तूचा फोटो (पर्यायी)</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border-2 rounded-lg p-2 focus:border-royalBlue outline-none transition-all text-sm" />
                            {formData.collateralImage && <img src={formData.collateralImage} alt="Preview" className="mt-2 h-16 w-16 object-cover rounded shadow" />}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setShowAddForm(false)}>रद्द करा</button>
                        <button type="submit" className="px-8 py-2 text-white bg-gold hover:bg-yellow-500 rounded-lg shadow-lg text-royalBlue font-black transition-all hover:scale-105 active:scale-95">नोंद करा</button>
                    </div>
                </form>
            )}

            {/* Table & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ग्राहक नावाने शोधा..."
                            className="w-full pl-10 pr-4 py-2 border-2 rounded-full focus:border-royalBlue outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-700 p-5 rounded-xl shadow-lg text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">थकित व्याज</h3>
                        <p className="text-2xl font-black">₹ १२,५००</p>
                    </div>
                    <IndianRupee className="text-white/20" size={40} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-2" size={40} />
                        <p>कर्ज माहिती लोड होत आहे...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-royalBlue text-white text-xs uppercase tracking-widest">
                                    <th className="p-4">ग्राहक</th>
                                    <th className="p-4">गहाण वस्तू</th>
                                    <th className="p-4">रक्कम</th>
                                    <th className="p-4">व्याजदर</th>
                                    <th className="p-4">परतफेड</th>
                                    <th className="p-4">स्थिती</th>
                                    <th className="p-4 text-center">कृती</th>
                                </tr>
                            </thead>
                            <tbody className="flex flex-col md:table-row-group p-4 md:p-0 gap-4 md:gap-0 bg-gray-50 md:bg-transparent">
                                {loans.map((l) => (
                                    <tr key={l.id} className="hover:bg-blue-50/50 border border-gray-200 md:border-b md:border-x-0 md:border-t-0 last:border-0 transition-colors flex flex-col md:table-row bg-white rounded-xl md:rounded-none overflow-hidden shadow-sm md:shadow-none">
                                        <td className="p-3 md:p-4 flex justify-between md:table-cell border-b md:border-b-0 border-gray-100 bg-gray-50 md:bg-transparent items-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-gray-500">ग्राहक:</span>
                                            <div className="text-right md:text-left">
                                                <p className="font-bold text-gray-800">{l.customerName}</p>
                                                <p className="text-xs text-gray-500">{l.mobileNumber}</p>
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4 flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-gray-500">गहाण वस्तू:</span>
                                            <span className="text-gray-600 font-medium text-right md:text-left">{l.collateralItem}</span>
                                        </td>
                                        <td className="p-3 md:p-4 flex justify-between md:table-cell items-center bg-blue-50/30 md:bg-transparent">
                                            <span className="md:hidden text-[10px] font-black uppercase text-gray-500">रक्कम:</span>
                                            <span className="font-black text-royalBlue text-right md:text-left text-lg md:text-base">₹ {l.loanAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="p-3 md:p-4 flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-gray-500">व्याजदर:</span>
                                            <span className="text-gray-600 font-bold text-right md:text-left">{l.interestRate}% <span className="text-[10px] opacity-50">दरमहा</span></span>
                                        </td>
                                        <td className="p-3 md:p-4 flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-gray-500">परतफेड:</span>
                                            {l.status === 'Closed' ? (
                                                <span className="text-gray-700 text-sm font-mono text-right md:text-left">{new Date(l.repaymentDate).toLocaleDateString('mr-IN')}</span>
                                            ) : (
                                                <div className="relative inline-block overflow-hidden bg-blue-50/50 p-1.5 rounded border border-blue-100">
                                                    <input
                                                        type="date"
                                                        title="तारीख बदला"
                                                        value={l.repaymentDate ? new Date(l.repaymentDate).toISOString().split('T')[0] : ''}
                                                        onChange={(e) => handleDateChange(l.id, e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <p className="font-bold text-sm whitespace-nowrap cursor-pointer hover:underline text-blue-700 flex items-center gap-1.5 justify-center font-mono">
                                                        {new Date(l.repaymentDate).toLocaleDateString('mr-IN')}
                                                        <Edit3 size={14} className="text-blue-400" />
                                                    </p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 md:p-4 flex justify-between md:table-cell items-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-gray-500">स्थिती:</span>
                                            <span className={`px-2 py-1 text-[10px] font-black rounded-full border ${l.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                {l.status === 'Active' ? 'सक्रिय' : 'बंद'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex flex-row justify-between md:justify-center gap-2 border-t md:border-t-0 border-gray-100 bg-gray-50 md:bg-transparent">
                                            <button onClick={() => openPaymentModal(l.id)} className="flex-1 md:flex-none text-xs font-black bg-royalBlue text-white px-4 py-2.5 md:py-2 rounded-lg hover:bg-blue-800 transition-colors shadow-md text-center">पेमेंट</button>
                                            <button onClick={() => openReceipt(l)} className="flex-1 md:flex-none text-xs font-black border-2 border-gold text-royalBlue px-4 py-2.5 md:py-2 rounded-lg hover:bg-gold transition-colors text-center bg-white">रसीद</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-xl font-bold text-royalBlue">पेमेंट जमा करा</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                        </div>
                        <form onSubmit={submitPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">पेमेंट प्रकार</label>
                                <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full border-2 p-2 rounded focus:border-royalBlue outline-none">
                                    <option value="interest">व्याज (Interest)</option>
                                    <option value="principal">मुद्दल (Principal)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">रक्कम (₹)</label>
                                <input type="number" required value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full border-2 p-2 rounded focus:border-royalBlue outline-none font-bold" placeholder="उदा. 1500" />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-gold text-royalBlue font-black px-6 py-2 rounded shadow-md hover:bg-yellow-500 transition-all">जमा करा</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showReceiptModal && selectedLoan && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto pt-8 pb-12">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl print:hidden">
                            <button onClick={handlePrint} className="flex items-center space-x-2 bg-royalBlue text-white px-4 py-2 rounded shadow hover:bg-blue-800 hover:shadow-lg transition-all"><Printer size={18} /> <span>Print रसीद</span></button>
                            <button onClick={() => setShowReceiptModal(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
                        </div>

                        <div className="p-8 print:p-6 print:m-0 bg-white text-gray-900 border-2 border-royalBlue print:border-gray-800 m-4 rounded-lg" id="receipt-print-area">
                            <div className="text-center border-b-2 border-royalBlue print:border-gray-800 pb-4 mb-6">
                                <h1 className="text-4xl font-black text-royalBlue print:text-black mb-1 font-marathi">श्री कृष्णा ज्वेलर्स</h1>
                                <p className="text-sm font-bold text-gray-700">मुख्य बाजारपेठ, शिवाजी चौक, दुकान क्र. १०५</p>
                                <p className="text-xs text-gray-500 mb-2">मोबाईल: 9876543210 | GSTIN: 27XXXXX1234X1ZX</p>
                                <div className="inline-block bg-gold print:bg-gray-200 text-royalBlue print:text-black font-black px-4 py-1 rounded-full text-sm border print:border-black">सुवर्ण तारण कर्ज पावती (Gold Loan Receipt)</div>
                            </div>

                            <div className="flex justify-between items-start mb-6 text-sm border-b pb-4 border-dashed border-gray-300">
                                <div>
                                    <p className="mb-1"><span className="text-gray-500 w-20 inline-block">पावती क्र.:</span> <span className="font-bold text-red-600 print:text-black text-lg">LN-{selectedLoan.id.toString().padStart(4, '0')}</span></p>
                                    <p><span className="text-gray-500 w-20 inline-block">दिनांक:</span> <span className="font-bold">{new Date().toLocaleDateString('mr-IN')}</span></p>
                                    <p><span className="text-gray-500 w-20 inline-block">कर्ज दिनांक:</span> <span className="font-bold">{new Date(selectedLoan.loanDate).toLocaleDateString('mr-IN')}</span></p>
                                </div>
                                <div className="text-right">
                                    <p><span className="text-gray-500 inline-block">स्थिती:</span> <span className="font-black border border-gray-300 px-2 rounded-sm ml-2">{selectedLoan.status === 'Active' ? 'सक्रिय (Active)' : 'बंद (Closed)'}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                                <div className="border p-4 rounded-lg bg-gray-50 print:bg-transparent print:border-gray-800">
                                    <h4 className="font-black text-gray-800 mb-3 border-b pb-1">ग्राहक माहिती</h4>
                                    <p className="mb-1"><span className="text-gray-500">नाव:</span> <span className="font-bold">{selectedLoan.customerName}</span></p>
                                    <p className="mb-1"><span className="text-gray-500">मोबाईल:</span> <span className="font-bold">{selectedLoan.mobileNumber}</span></p>
                                    <p><span className="text-gray-500">पत्ता:</span> <span className="font-bold">{selectedLoan.address || '-'}</span></p>
                                </div>

                                <div className="border p-4 rounded-lg bg-gray-50 print:bg-transparent print:border-gray-800 flex justify-between items-start">
                                    <div>
                                        <h4 className="font-black text-gray-800 mb-3 border-b pb-1">गहाण वस्तू तपशील</h4>
                                        <p className="mb-1"><span className="text-gray-500">वस्तू:</span> <span className="font-bold">{selectedLoan.collateralItem}</span></p>
                                        <p className="mb-1"><span className="text-gray-500">वजन:</span> <span className="font-bold">{selectedLoan.weight ? `${selectedLoan.weight} ग्रॅम` : '-'}</span></p>
                                        <p><span className="text-gray-500">शुद्धता:</span> <span className="font-bold">{selectedLoan.purity || '-'}</span></p>
                                    </div>
                                    {selectedLoan.collateralImage ? (
                                        <img src={selectedLoan.collateralImage} alt="Collateral" className="w-20 h-20 object-cover border-2 border-gray-300 rounded print:border-gray-800" />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
                                            <ImageIcon size={20} className="mb-1 opacity-50" />
                                            <span className="text-[10px] font-bold">फोटो नाही</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border border-gray-300 print:border-gray-800 rounded-lg overflow-hidden mb-6">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 print:bg-transparent border-b border-gray-300 print:border-gray-800">
                                        <tr>
                                            <th className="p-3 text-left">हिशोब तपशील</th>
                                            <th className="p-3 text-right">रक्कम (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 print:divide-gray-400">
                                        <tr>
                                            <td className="p-3 font-medium">१. एकूण दिलेले कर्ज (Principal Amount)</td>
                                            <td className="p-3 text-right font-black">₹ {selectedLoan.loanAmount.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-gray-600">   • निश्चित व्याजदर (Interest Rate)</td>
                                            <td className="p-3 text-right text-gray-600">{selectedLoan.interestRate}% प्रति महिना</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium">२. एकूण अपेक्षित व्याज (Total Interest)</td>
                                            <td className="p-3 text-right">₹ {selectedLoan.totalInterest.toLocaleString()}</td>
                                        </tr>
                                        <tr className="bg-gray-50 print:bg-transparent">
                                            <td className="p-3 font-bold">३. आतापर्यंत भरलेले मुद्दल (Principal Paid)</td>
                                            <td className="p-3 text-right font-bold text-gray-800">₹ {(selectedLoan.amountPaid || 0).toLocaleString()}</td>
                                        </tr>
                                        <tr className="bg-gray-50 print:bg-transparent">
                                            <td className="p-3 font-bold">४. आतापर्यंत भरलेले व्याज (Interest Paid)</td>
                                            <td className="p-3 text-right font-bold text-gray-800">₹ {(selectedLoan.interestPaid || 0).toLocaleString()}</td>
                                        </tr>
                                        <tr className="border-t-2 border-gray-400 print:border-gray-800 bg-gray-100 print:bg-transparent">
                                            <td className="p-3 font-black text-lg">शिल्लक मुद्दल रक्कम (Balance Principal)</td>
                                            <td className="p-3 text-right font-black text-lg">₹ {Math.max(0, selectedLoan.loanAmount - (selectedLoan.amountPaid || 0)).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-end mt-10 mb-12 pt-4 px-4 text-sm">
                                <div className="text-center w-1/3">
                                    <div className="border-b border-gray-400 print:border-gray-800 w-full mb-2"></div>
                                    <p className="font-bold text-gray-800">ग्राहक स्वाक्षरी</p>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="border-b border-gray-400 print:border-gray-800 w-full mb-2"></div>
                                    <p className="font-bold text-gray-800">अधिकृत स्वाक्षरी</p>
                                    <p className="text-gray-500 text-[10px] mt-1">(श्री कृष्णा ज्वेलर्स)</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 print:border-gray-800 text-xs text-gray-500 print:text-gray-800">
                                <h5 className="font-bold mb-2">नियम आणि अटी (Terms & Conditions):</h5>
                                <ol className="list-decimal pl-4 space-y-1">
                                    <li>कर्जाची मुदत संपल्यावर व्याजासह रक्कम भरणे बंधनकारक आहे.</li>
                                    <li>व्याज दरमहा आकारले जाईल.</li>
                                    <li>पावती सोबत असल्याशिवाय गहाण वस्तू परत दिली जाणार नाही.</li>
                                    <li>बदललेल्या पत्त्याची किंवा मोबाईल नंबरची माहिती देणे आवश्यक आहे.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-b-xl border-t print:hidden flex justify-center">
                            <button onClick={handlePrint} className="bg-gold text-royalBlue px-8 py-2 rounded-lg font-black shadow-lg hover:bg-yellow-500 transition-all flex items-center space-x-2">
                                <Printer size={20} />
                                <span>Print Receipt</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
