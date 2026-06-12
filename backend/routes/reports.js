import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        const [
            allTransactionsForStats,
            allLoansForStats,
            allCollectionsForStats,
            recentTransactions,
            loansList
        ] = await Promise.all([
            prisma.transaction.findMany({
                select: {
                    date: true,
                    type: true,
                    totalAmount: true,
                    purchaseRate: true,
                    weight: true
                }
            }),
            prisma.loan.findMany({
                select: {
                    loanAmount: true,
                    interestPaid: true,
                    status: true
                }
            }),
            prisma.collection.findMany({
                select: {
                    balanceAmount: true,
                    totalAmount: true
                }
            }),
            prisma.transaction.findMany({
                orderBy: { date: 'desc' },
                take: 100
            }),
            prisma.loan.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100
            })
        ]);

        // 1. Monthly Sales Report
        const monthlySalesMap = {};
        allTransactionsForStats.forEach(t => {
            const d = new Date(t.date);
            const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlySalesMap[monthYear]) monthlySalesMap[monthYear] = { count: 0, total: 0, profit: 0 };

            if (t.type === 'Sell' || t.type === 'Order') {
                monthlySalesMap[monthYear].count += 1;
                monthlySalesMap[monthYear].total += t.totalAmount;

                // basic profit calculation if purchaseRate exists
                if (t.purchaseRate && t.weight) {
                    const cost = t.purchaseRate * t.weight;
                    monthlySalesMap[monthYear].profit += (t.totalAmount - cost);
                } else {
                    monthlySalesMap[monthYear].profit += (t.totalAmount * 0.15); // 15% estimated margin fallback
                }
            }
        });

        const monthlySales = Object.entries(monthlySalesMap).map(([month, data]) => ({
            month,
            count: data.count,
            total: data.total,
            profit: data.profit
        })).sort((a, b) => b.month.localeCompare(a.month)); // descending

        // 2. Loan Report
        const totalLoansGiven = allLoansForStats.reduce((sum, l) => sum + l.loanAmount, 0);
        const totalInterestCollected = allLoansForStats.reduce((sum, l) => sum + l.interestPaid, 0);
        const activeLoans = allLoansForStats.filter(l => l.status === 'Active').length;

        // 3. Collection Report
        const totalPendingCollections = allCollectionsForStats.reduce((sum, c) => sum + c.balanceAmount, 0);
        const totalCollectedAmount = allCollectionsForStats.reduce((sum, c) => sum + (c.totalAmount - c.balanceAmount), 0);

        res.json({
            monthlySales,
            loanStats: {
                totalGiven: totalLoansGiven,
                interestEarned: totalInterestCollected,
                activeCount: activeLoans
            },
            collectionStats: {
                pending: totalPendingCollections,
                collected: totalCollectedAmount
            },
            recentTransactions,
            loansList,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
