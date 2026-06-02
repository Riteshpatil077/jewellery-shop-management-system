import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // उत्पादनाचे नाव
    category: { type: String, required: true }, // श्रेणी
    weight: { type: Number, required: true }, // वजन (Weight in grams)
    metalType: { type: String, enum: ['Gold', 'Silver', 'Diamond'], required: true }, // धातू प्रकार
    ratePerGram: { type: Number, required: true }, // प्रतिग्राम दर
    makingCharges: { type: Number, default: 0 }, // कारागीर खर्च
    totalPrice: { type: Number, required: true }, // एकूण किंमत
    images: [{ type: String }], // उत्पादन फोटो
    stockCount: { type: Number, default: 1 }, // स्टॉक उपलब्धता
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
