import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    customerName: { type: String, required: true }, // ग्राहकाचे नाव
    purchasedJewelry: { type: String, required: true }, // खरेदी केलेला दागिना
    totalAmount: { type: Number, required: true }, // एकूण किंमत
    advancePayment: { type: Number, default: 0 }, // आगाऊ रक्कम
    balanceAmount: { type: Number, required: true }, // शिल्लक रक्कम
    totalInstallments: { type: Number, required: true }, // हप्त्याची संख्या
    monthlyAmount: { type: Number, required: true }, // दर महिन्याची रक्कम
    paidInstallments: { type: Number, default: 0 }, // भरलेले हप्ते
    nextDueDate: { type: Date }, // पुढील हप्त्याची तारीख
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

export const Collection = mongoose.model('Collection', collectionSchema);
