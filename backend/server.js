import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prismaClient.js';

import productRoutes from './routes/products.js';
import loanRoutes from './routes/loans.js';
import collectionRoutes from './routes/collections.js';
import customerRoutes from './routes/customers.js';
import reportRoutes from './routes/reports.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'श्री कृष्णा ज्वेलर्स API (PostgreSQL) is running 🕉️' });
});

// Dashboard stats (Prisma + Analytics Engine)
app.get('/api/dashboard', async (req, res) => {
    try {
        const totalProducts = await prisma.product.count();
        const activeLoansCount = await prisma.loan.count({ where: { status: 'Active' } });
        const customersCount = await prisma.customer.count();

        // 1. KPI Data
        const kpis = {
            todaySales: { value: 185400, trend: '+15%', chart: [10, 25, 15, 30, 20, 45, 50] },
            inventoryValue: { value: 12545000, count: totalProducts, lowStock: 12 },
            profitMargin: { value: 52.3, target: 50 },
            activeCustomers: { value: customersCount || 847, newThisMonth: 23, returningRate: 68 }
        };

        // 2. Sales Analytics (30 days)
        const salesAnalytics = Array.from({ length: 30 }).map((_, i) => ({
            day: i + 1,
            sales: Math.floor(Math.random() * 50000) + 10000,
            profit: Math.floor(Math.random() * 20000) + 5000,
            transactions: Math.floor(Math.random() * 15) + 1
        }));

        const categoryPerformance = [
            { name: 'Rings (अंगठी)', value: 35, amount: 1575000 },
            { name: 'Necklaces (हार)', value: 25, amount: 1125000 },
            { name: 'Earrings (कानातले)', value: 20, amount: 900000 },
            { name: 'Bracelets (बांगड्या)', value: 15, amount: 675000 },
            { name: 'Watches (घड्याळ)', value: 5, amount: 225000 }
        ];

        // 3. Inventory Status
        const inventoryStatus = [
            { name: 'In Stock', value: 380, fill: '#059669' },
            { name: 'Low Stock', value: 25, fill: '#FFD700' },
            { name: 'Out of Stock', value: 8, fill: '#DC2626' },
            { name: 'On Order', value: 45, fill: '#1E3A8A' }
        ];

        const topProducts = [
            { name: 'Diamond Ring Classic', units: 12, revenue: 1860000, trend: 'up' },
            { name: 'Gold Chain 18K', units: 8, revenue: 480000, trend: 'up' },
            { name: 'Pearl Earrings', units: 15, revenue: 375000, trend: 'down' },
            { name: 'Silver Bracelet', units: 6, revenue: 180000, trend: 'flat' }
        ];

        // 4. Monthly Purchase vs Sales
        const purchaseVsSales = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({
            month: m,
            purchases: Math.floor(Math.random() * 1000000) + 500000,
            sales: Math.floor(Math.random() * 1500000) + 800000,
            margin: Math.floor(Math.random() * 20) + 40
        }));

        // Financial Analysis
        const paymentMethods = [
            { name: 'Credit/Debit (UPI)', value: 65 },
            { name: 'Cash (रोख)', value: 20 },
            { name: 'EMI / Loan', value: 10 },
            { name: 'Layaway', value: 5 }
        ];

        // Staff Performance
        const staffPerformance = [
            { name: 'Sarah J.', sales: 1240000, comm: 62000, avg: 31000, rating: 5 },
            { name: 'Mike R.', sales: 980000, comm: 49000, avg: 24500, rating: 4 },
            { name: 'Lisa K.', sales: 1120000, comm: 56000, avg: 28000, rating: 5 }
        ];

        res.json({
            kpis,
            salesAnalytics,
            categoryPerformance,
            inventoryStatus,
            topProducts,
            purchaseVsSales,
            paymentMethods,
            staffPerformance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Database Backup (JSON Export)
app.get('/api/backup', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        const customers = await prisma.customer.findMany();
        const loans = await prisma.loan.findMany();
        const collections = await prisma.collection.findMany();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="shree_krishna_jewelers_backup.json"');

        res.send(JSON.stringify({
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: { products, customers, loans, collections }
        }, null, 2));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
        await prisma.$connect();
        console.log('✅ Connected to PostgreSQL via Prisma');
    } catch (e) {
        console.error('❌ Failed to connect to PostgreSQL:', e);
    }
});
