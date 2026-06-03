import React from 'react';
import { X, Printer } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, data, type }) {
    if (!isOpen || !data) return null;

    const handlePrint = () => {
        window.print();
    };

    // Shop Info (Could be passed from settings context later)
    const shopName = "श्री कृष्णा ज्वेलर्स";
    const shopAddress = "मुख्य बाजारपेठ, शिवाजी चौक, दुकान क्र. १०५";
    const shopContact = "मोबाईल: 9876543210 | GSTIN: 27XXXXX1234X1ZX";

    let title = "";
    let invoicePrefix = "";
    if (type === "loan") {
        title = "सुवर्ण तारण कर्ज पावती (Gold Loan Receipt)";
        invoicePrefix = "LN-";
    } else if (type === "transaction") {
        title = data.type === 'Purchase' ? "खरेदी पावती (Purchase Memo)" : "विक्री पावती (Tax Invoice)";
        invoicePrefix = "INV-";
    } else if (type === "collection") {
        title = "हफ्ता पावती (Installment Receipt)";
        invoicePrefix = "REC-";
    }

    const receiptNo = `${invoicePrefix}${data.id.toString().padStart(4, '0')}`;
    const date = new Date(data.createdAt || data.date || data.loanDate || Date.now()).toLocaleDateString('mr-IN');

    // Dynamic fallback for total interest if it's missing from old database entries
    let expectedTotalInterest = data.totalInterest || 0;
    if (type === "loan" && expectedTotalInterest === 0 && data.interestRate > 0) {
        expectedTotalInterest = ((data.loanAmount * data.interestRate) / 100) * (data.durationMonths || 12);
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-start justify-center p-4 overflow-y-auto pt-8 pb-12">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 relative animate-in zoom-in-95 duration-200">

                {/* Modal Controls (Not printed) */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10">
                    <button onClick={handlePrint} className="flex items-center space-x-2 bg-royalBlue text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-800 transition-all font-bold">
                        <Printer size={18} /> <span>Print (प्रिंट करा)</span>
                    </button>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all focus:outline-none">
                        <X size={24} />
                    </button>
                </div>

                {/* Printable Document Area */}
                <div className="p-10 pt-12 print:p-6 print:m-0 bg-white text-black" id="receipt-print-area">

                    {/* Header */}
                    <div className="text-center border-b-[3px] border-black pb-5 mb-8">
                        <h1 className="text-5xl font-black mb-2 tracking-tight text-royalBlue print:text-black font-marathi">{shopName}</h1>
                        <p className="text-base font-bold text-gray-800 print:text-black">{shopAddress}</p>
                        <p className="text-sm font-medium text-gray-600 print:text-gray-900 mt-1">{shopContact}</p>
                        <div className="mt-4">
                            <span className="inline-block border-2 border-black px-6 py-1.5 rounded-full font-black text-sm uppercase tracking-widest bg-gray-100 print:bg-transparent">
                                {title}
                            </span>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                        <div className="space-y-2">
                            <div className="flex border-b border-dashed border-gray-300 pb-1">
                                <span className="w-32 font-bold text-gray-600 print:text-gray-800">पावती क्र. (No):</span>
                                <span className="font-black text-red-600 print:text-black">{receiptNo}</span>
                            </div>
                            <div className="flex border-b border-dashed border-gray-300 pb-1">
                                <span className="w-32 font-bold text-gray-600 print:text-gray-800">दिनांक (Date):</span>
                                <span className="font-bold">{date}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex border-b border-dashed border-gray-300 pb-1">
                                <span className="w-24 font-bold text-gray-600 print:text-gray-800">ग्राहक (Name):</span>
                                <span className="font-black truncate">{data.customerName}</span>
                            </div>
                            <div className="flex border-b border-dashed border-gray-300 pb-1">
                                <span className="w-24 font-bold text-gray-600 print:text-gray-800">मोबाईल (Mob):</span>
                                <span className="font-bold">{data.mobile || data.mobileNumber || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="mb-8 min-h-[200px]">
                        <table className="w-full text-sm border-collapse border border-black">
                            <thead className="bg-gray-100 print:bg-transparent">
                                <tr>
                                    <th className="border border-black p-3 text-left w-12 text-center">क्र.</th>
                                    <th className="border border-black p-3 text-left">तपशील (Description)</th>
                                    <th className="border border-black p-3 text-right">रक्कम (Amount)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Transaction specific logic */}
                                {type === "transaction" && (
                                    <>
                                        <tr>
                                            <td className="border-x border-black p-3 text-center h-12">1</td>
                                            <td className="border-x border-black p-3">
                                                <span className="font-bold">{data.itemName}</span>
                                                <span className="text-xs text-gray-600 ml-2">({data.metalType} • {data.weight}g @ ₹{data.rate})</span>
                                                {data.makingCharges > 0 && <div className="text-xs mt-1">+ मजुरी (Making): ₹{data.makingCharges}</div>}
                                            </td>
                                            <td className="border-x border-black p-3 text-right font-bold">₹ {data.totalAmount?.toLocaleString('en-IN')}</td>
                                        </tr>
                                        {/* Blank rows filler */}
                                        <tr><td className="border-x border-black p-3 h-16"></td><td className="border-x border-black p-3"></td><td className="border-x border-black p-3"></td></tr>
                                    </>
                                )}

                                {/* Loan specific logic */}
                                {type === "loan" && (
                                    <>
                                        <tr>
                                            <td className="border-x border-black p-3 text-center h-12">1</td>
                                            <td className="border-x border-black p-3">
                                                <div className="font-bold mb-1 border-b border-dashed pb-1">गहाण वस्तू: {data.collateralItem} ({data.weight}g, {data.purity})</div>
                                                <div className="text-sm mt-2">
                                                    • मुद्दल (Principal): ₹ {data.loanAmount?.toLocaleString('en-IN')}<br />
                                                    • मासिक व्याजदर: {data.interestRate}%<br />
                                                </div>
                                            </td>
                                            <td className="border-x border-black p-3 text-right font-bold align-top">₹ {data.loanAmount?.toLocaleString('en-IN')}</td>
                                        </tr>
                                        {/* Blank rows filler */}
                                        <tr><td className="border-x border-black p-3 h-16"></td><td className="border-x border-black p-3"></td><td className="border-x border-black p-3"></td></tr>
                                    </>
                                )}

                                {/* Summary Rows */}
                                {type === "loan" ? (
                                    <>
                                        <tr className="border-t border-black bg-gray-50 print:bg-transparent">
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-xs uppercase tracking-widest">
                                                एकूण दिलेले कर्ज (Total Principal Issued)
                                            </td>
                                            <td className="border border-black p-2 text-right font-black text-base">
                                                ₹ {(data.loanAmount || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-xs uppercase tracking-widest text-blue-700 print:text-black">
                                                अपेक्षित एकूण व्याज (Total Expected Interest)
                                            </td>
                                            <td className="border border-black p-2 text-right font-bold text-blue-700 print:text-black">
                                                ₹ {expectedTotalInterest.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-xs uppercase tracking-widest text-green-700 print:text-black">
                                                भरलेले मुद्दल (Principal Paid/Returned)
                                            </td>
                                            <td className="border border-black p-2 text-right font-bold text-green-700 print:text-black">
                                                ₹ {(data.amountPaid || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-xs uppercase tracking-widest text-orange-600 print:text-black">
                                                भरलेले व्याज (Interest Paid)
                                            </td>
                                            <td className="border border-black p-2 text-right font-bold text-orange-600 print:text-black">
                                                ₹ {(data.interestPaid || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-[11px] uppercase tracking-widest">
                                                शिल्लक व्याज बाकी (Balance Interest Due)
                                            </td>
                                            <td className="border border-black p-2 text-right font-bold text-red-600 print:text-black">
                                                ₹ {Math.max(0, expectedTotalInterest - (data.interestPaid || 0)).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-3 pr-4 text-right font-black text-sm uppercase tracking-widest">
                                                शिल्लक मुद्दल बाकी (Balance Principal Due)
                                            </td>
                                            <td className="border border-black p-3 text-right font-black text-lg bg-gray-100 print:bg-transparent text-red-600 print:text-black">
                                                ₹ {Math.max(0, (data.loanAmount || 0) - (data.amountPaid || 0)).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        <tr className="border-t border-black">
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-xs uppercase tracking-widest">
                                                एकूण रक्कम (Total Amount)
                                            </td>
                                            <td className="border border-black p-2 text-right font-black text-base bg-gray-50 print:bg-transparent">
                                                ₹ {(data.totalAmount || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-2 pr-4 text-right font-bold text-xs uppercase tracking-widest text-green-700 print:text-black">
                                                जमा रक्कम (Advance/Paid)
                                            </td>
                                            <td className="border border-black p-2 text-right font-bold text-green-700 print:text-black">
                                                ₹ {(data.advancePaid || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="border border-black p-3 pr-4 text-right font-black text-sm uppercase tracking-widest">
                                                बाकी रक्कम (Balance Due)
                                            </td>
                                            <td className="border border-black p-3 text-right font-black text-lg bg-gray-100 print:bg-transparent">
                                                ₹ {(data.balanceAmount ?? 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Amount in words */}
                    <div className="mb-10 text-sm font-bold text-gray-800">
                        * सर्व रक्कम भारतीय रुपयांमध्ये मोजली आहे.
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between items-end mt-16 pt-4 px-4 text-sm">
                        <div className="text-center w-48">
                            <div className="border-b-[1.5px] border-black w-full mb-2"></div>
                            <p className="font-bold text-gray-800">ग्राहकाची स्वाक्षरी<br /><span className="text-[10px] text-gray-500 font-normal">(Customer Signature)</span></p>
                        </div>
                        <div className="text-center w-48">
                            <div className="border-b-[1.5px] border-black w-full mb-2"></div>
                            <p className="font-bold text-gray-800">अधिकृत स्वाक्षरी<br /><span className="text-[10px] text-gray-500 font-normal">(Authorized Signature)</span></p>
                            <p className="text-[10px] font-black mt-1 italic">For {shopName}</p>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="mt-12 pt-4 border-t-[1.5px] border-dashed border-gray-400 text-[10px] text-gray-600 print:text-gray-800 text-justify">
                        <h5 className="font-bold mb-2 uppercase tracking-widest text-xs">नियम आणि अटी (Terms & Conditions):</h5>
                        <ol className="list-decimal pl-4 space-y-1 font-medium">
                            {type === 'loan' ? (
                                <>
                                    <li>कर्जाची मुदत संपल्यावर व्याजासह रक्कम भरणे बंधनकारक आहे.</li>
                                    <li>व्याज दरमहा आकारले जाईल. पावती सोबत असल्याशिवाय गहाण वस्तू परत दिली जाणार नाही.</li>
                                    <li>बदललेल्या पत्त्याची किंवा मोबाईल नंबरची माहिती देणे आवश्यक आहे.</li>
                                </>
                            ) : (
                                <>
                                    <li>विकलेला माल परत घेतला जाणार नाही. मालाची गॅरंटी नियमानुसार राहील.</li>
                                    <li>कोणत्याही विवादासाठी न्यायालयीन क्षेत्र स्थानिक राहील.</li>
                                    <li>Subject to Local Jurisdiction ONLY. E.& O.E.</li>
                                </>
                            )}
                        </ol>
                    </div>

                </div>
            </div>
        </div>
    );
}
