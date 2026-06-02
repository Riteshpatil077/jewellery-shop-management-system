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

// Dashboard stats (Prisma version)
app.get('/api/dashboard', async (req, res) => {
    try {
        const totalProducts = await prisma.product.count();
        const lowStock = await prisma.product.count({ where: { stockCount: { lte: 5 } } });
        const activeLoansCount = await prisma.loan.count({ where: { status: 'Active' } });

        const loanStats = await prisma.loan.aggregate({
            where: { status: 'Active' },
            _sum: { loanAmount: true }
        });

        const collectionStats = await prisma.collection.aggregate({
            where: { status: 'Pending' },
            _sum: { balanceAmount: true }
        });

        res.json({
            totalProducts,
            lowStock,
            activeLoans: activeLoansCount,
            totalLoanAmount: loanStats._sum.loanAmount || 0,
            pendingCollections: await prisma.collection.count({ where: { status: 'Pending' } }),
            pendingAmount: collectionStats._sum.balanceAmount || 0,
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
