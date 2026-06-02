import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
    customerName: { type: String, required: true }, // ग्राहकाचे नाव
    mobileNumber: { type: String, required: true }, // मोबाईल नंबर
    address: { type: String }, // पत्ता
    aadhaarCard: { type: String }, // आधार कार्ड
    collateralItem: { type: String, required: true }, // गहाण वस्तू
    weight: { type: Number }, // वजन
    purity: { type: String }, // शुद्धता (e.g. 22K)
    loanAmount: { type: Number, required: true }, // कर्जाची रक्कम
    interestRate: { type: Number, required: true }, // व्याजदर (%)
    durationMonths: { type: Number, required: true }, // कालावधी
    loanDate: { type: Date, default: Date.now }, // कर्ज तारीख
    repaymentDate: { type: Date, required: true }, // परतफेड तारीख
    totalInterest: { type: Number, default: 0 }, // एकूण व्याज
    interestPaid: { type: Number, default: 0 }, // व्याज भरलेले
    amountPaid: { type: Number, default: 0 }, // भरलेली रक्कम (Principal)
    status: { type: String, enum: ['Active', 'Closed', 'Defaulted'], default: 'Active' }
}, { timestamps: true });

export const Loan = mongoose.model('Loan', loanSchema);
