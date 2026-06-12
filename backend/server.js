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

app.use('/api/products', productRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Shree Krishna Jewellers API is running' });
});

app.get('/api/dashboard', async (req, res) => {
    try {
        const rangeDays = Math.max(7, Math.min(parseInt(req.query.range || '15', 10) || 15, 60));
        const monthParam = typeof req.query.month === 'string' && /^\d{4}-\d{2}$/.test(req.query.month) ? req.query.month : null;
        const now = new Date();
        const selectedMonth = monthParam ? new Date(`${monthParam}-01T00:00:00`) : new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0, 23, 59, 59, 999);
        const previousMonthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
        const previousMonthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 0, 23, 59, 59, 999);
        const rangeStart = new Date(now);
        rangeStart.setDate(rangeStart.getDate() - (rangeDays - 1));
        rangeStart.setHours(0, 0, 0, 0);

        const [
            inventoryStats,
            totalCustomers,
            newCustomers,
            loanSummary,
            collectionSummary,
            transactions,
            allProducts,
            customers
        ] = await Promise.all([
            // Inventory KPIs
            prisma.product.aggregate({
                _sum: { totalPrice: true },
                _count: { id: true }
            }),
            // Customer KPIs
            prisma.customer.count(),
            prisma.customer.count({
                where: { createdAt: { gte: monthStart, lte: monthEnd } }
            }),
            // Loan KPIs
            prisma.loan.aggregate({
                where: { status: 'Active' },
                _count: { id: true },
            }),
            // Collection KPIs
            prisma.collection.aggregate({
                where: { status: { not: 'Completed' } },
                _sum: { balanceAmount: true, totalAmount: true }
            }),
            // Transactions for charts (limited range for performance)
            prisma.transaction.findMany({
                where: { date: { gte: previousMonthStart } },
                select: {
                    id: true, type: true, totalAmount: true, date: true,
                    rate: true, purchaseRate: true, weight: true, makingCharges: true,
                    customerName: true, supplierName: true, itemName: true
                },
                orderBy: { date: 'asc' }
            }),
            // Low stock products for alerts
            prisma.product.findMany({
                where: { stockCount: { lte: 5 } },
                select: { id: true, name: true, stockCount: true }
            }),
            // Customers list for performance metrics
            prisma.customer.findMany({
                orderBy: { totalBusiness: 'desc' },
                take: 5
            })
        ]);

        const loanInterest = await prisma.loan.aggregate({
            _sum: { interestPaid: true }
        });

        const topProducts = await prisma.product.findMany({
            take: 4,
            orderBy: { totalPrice: 'desc' },
            select: { name: true, stockCount: true, totalPrice: true }
        });

        const dateKey = (date) => new Date(date).toISOString().slice(0, 10);
        const rangeTransactions = transactions.filter((transaction) => transaction.date >= rangeStart);
        const monthTransactions = transactions.filter((transaction) => transaction.date >= monthStart && transaction.date <= monthEnd);
        const previousMonthTransactions = transactions.filter((transaction) => transaction.date >= previousMonthStart && transaction.date <= previousMonthEnd);

        const salesAnalytics = Array.from({ length: rangeDays }, (_, index) => {
            const current = new Date(rangeStart);
            current.setDate(rangeStart.getDate() + index);
            const currentKey = dateKey(current);
            const items = rangeTransactions.filter((transaction) => dateKey(transaction.date) === currentKey);
            const sales = items.reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0);
            const profit = items.reduce((sum, transaction) => {
                if (transaction.type === 'Sell') {
                    return sum + ((((transaction.rate || 0) - (transaction.purchaseRate || 0)) * (transaction.weight || 0)) + (transaction.makingCharges || 0));
                }
                if (transaction.type === 'Order') {
                    return sum + (transaction.makingCharges || 0);
                }
                return sum;
            }, 0);

            return {
                date: currentKey,
                day: current.getDate(),
                label: current.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                sales,
                profit,
                transactions: items.length
            };
        });

        const calendarDays = Array.from({ length: monthEnd.getDate() }, (_, index) => {
            const current = new Date(monthStart);
            current.setDate(index + 1);
            const currentKey = dateKey(current);
            const items = monthTransactions.filter((transaction) => dateKey(transaction.date) === currentKey);
            return {
                date: currentKey,
                day: current.getDate(),
                sales: items.reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0),
                count: items.length,
                isToday: currentKey === dateKey(now)
            };
        });

        const monthTotalSales = monthTransactions.reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0);
        const previousMonthTotalSales = previousMonthTransactions.reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const todaySales = rangeTransactions
            .filter((transaction) => dateKey(transaction.date) === dateKey(now))
            .reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0);
        const yesterdaySales = rangeTransactions
            .filter((transaction) => dateKey(transaction.date) === dateKey(yesterday))
            .reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0);
        const grossProfit = monthTransactions.reduce((sum, transaction) => {
            if (transaction.type === 'Sell') {
                return sum + ((((transaction.rate || 0) - (transaction.purchaseRate || 0)) * (transaction.weight || 0)) + (transaction.makingCharges || 0));
            }
            if (transaction.type === 'Order') {
                return sum + (transaction.makingCharges || 0);
            }
            return sum;
        }, 0);
        const salesByType = monthTransactions.reduce((acc, transaction) => {
            acc[transaction.type] = (acc[transaction.type] || 0) + (transaction.totalAmount || 0);
            return acc;
        }, {});

        res.json({
            meta: {
                rangeDays,
                selectedMonth: monthStart.toISOString().slice(0, 7),
                previousMonth: previousMonthStart.toISOString().slice(0, 7)
            },
            kpis: {
                todaySales: {
                    value: todaySales,
                    trendValue: yesterdaySales > 0 ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100) : 0,
                    trend: todaySales === 0 && yesterdaySales > 0
                        ? 'आज विक्री नाही'
                        : yesterdaySales > 0
                            ? `${Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100)}%`
                            : '+0%',
                    chart: salesAnalytics.slice(-7).map((entry) => Math.round(entry.sales / 1000))
                },
                inventoryValue: {
                    value: Math.round(inventoryStats._sum.totalPrice || 0),
                    count: inventoryStats._count.id,
                    lowStock: allProducts.length
                },
                profitMargin: {
                    value: Math.round((grossProfit / Math.max(monthTotalSales, 1)) * 1000) / 10,
                    target: 50
                },
                activeCustomers: {
                    value: totalCustomers,
                    newThisMonth: newCustomers,
                    returningRate: totalCustomers > 0 ? Math.round((monthTransactions.length / totalCustomers) * 10) : 0
                },
                monthTotalSales: Math.round(monthTotalSales),
                previousMonthTotalSales: Math.round(previousMonthTotalSales)
            },
            salesAnalytics,
            calendarDays,
            categoryPerformance: Object.entries(salesByType).map(([name, amount]) => ({
                name: name === 'Sell' ? 'विक्री' : name === 'Purchase' ? 'खरेदी' : 'ऑर्डर',
                value: monthTotalSales > 0 ? Math.round((amount / monthTotalSales) * 100) : 0,
                amount
            })),
            inventoryStatus: [
                { name: 'कमी स्टॉक', value: allProducts.length, fill: '#FFD700' },
                { name: 'एकूण उत्पादने', value: inventoryStats._count.id, fill: '#1E3A8A' }
            ],
            topProducts: topProducts.map((product) => ({
                name: product.name,
                units: Math.max(product.stockCount || 0, 1),
                revenue: Math.round(product.totalPrice || 0)
            })),
            purchaseVsSales: Array.from({ length: previousMonthEnd.getDate() }, (_, index) => {
                const current = new Date(previousMonthStart);
                current.setDate(index + 1);
                const currentKey = dateKey(current);
                const items = previousMonthTransactions.filter((transaction) => dateKey(transaction.date) === currentKey);
                const dailySales = items.reduce((sum, transaction) => sum + (transaction.totalAmount || 0), 0);
                return {
                    month: current.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                    purchases: Math.round(dailySales * 0.7),
                    sales: dailySales
                };
            }).slice(-6),
            paymentMethods: [
                { name: 'UPI / कार्ड', value: monthTotalSales > 0 ? Math.round(((salesByType.Sell || 0) / monthTotalSales) * 100) : 0 },
                { name: 'रोख', value: monthTotalSales > 0 ? Math.round(((salesByType.Purchase || 0) / monthTotalSales) * 100) : 0 },
                { name: 'ऑर्डर', value: monthTotalSales > 0 ? Math.round(((salesByType.Order || 0) / monthTotalSales) * 100) : 0 }
            ],
            staffPerformance: customers.slice(0, 5).map((customer, index) => ({
                name: customer.name,
                sales: customer.totalBusiness || 0,
                comm: Math.round((customer.totalBusiness || 0) * 0.05),
                avg: customers.length > 0 ? Math.round(monthTotalSales / customers.length) : 0,
                rating: Math.max(3, 5 - index)
            })),
            recentTransactions: transactions.slice(-20).reverse(),
            loanStats: {
                activeCount: loanSummary._count.id,
                interestEarned: loanInterest._sum.interestPaid || 0
            },
            collectionStats: {
                pending: Number(collectionSummary._sum.balanceAmount || 0),
                collected: Number((collectionSummary._sum.totalAmount || 0) - (collectionSummary._sum.balanceAmount || 0))
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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
    console.log(`Server running on port ${PORT}`);
    try {
        await prisma.$connect();
        console.log('Connected to PostgreSQL via Prisma');
    } catch (error) {
        console.error('Failed to connect to PostgreSQL:', error);
    }
});
