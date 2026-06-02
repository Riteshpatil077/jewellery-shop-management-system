import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String },
    aadhaar: { type: String },
    email: { type: String },
    totalBusiness: { type: Number, default: 0 },
}, { timestamps: true });

export const Customer = mongoose.model('Customer', customerSchema);
