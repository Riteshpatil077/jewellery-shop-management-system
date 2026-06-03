import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { type: 'Sell', status: 'Completed' },
            orderBy: { date: 'desc' }
        });

        const loans = await prisma.loan.findMany();
        const collections = await prisma.collection.findMany();

        // 1. Monthly Sales Report
        const monthlySalesMap = {};
        transactions.forEach(t => {
            const d = new Date(t.date);
            const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlySalesMap[monthYear]) monthlySalesMap[monthYear] = { count: 0, total: 0, profit: 0 };
            monthlySalesMap[monthYear].count += 1;
            monthlySalesMap[monthYear].total += t.totalAmount;

            // basic profit calculation if purchaseRate exists
            if (t.purchaseRate && t.weight) {
                const cost = t.purchaseRate * t.weight;
                monthlySalesMap[monthYear].profit += (t.totalAmount - cost);
            } else {
                monthlySalesMap[monthYear].profit += (t.totalAmount * 0.15); // 15% estimated margin fallback
            }
        });

        const monthlySales = Object.entries(monthlySalesMap).map(([month, data]) => ({
            month,
            count: data.count,
            total: data.total,
            profit: data.profit
        })).sort((a, b) => b.month.localeCompare(a.month)); // descending

        // 2. Loan Report
        const totalLoansGiven = loans.reduce((sum, l) => sum + l.loanAmount, 0);
        const totalInterestCollected = loans.reduce((sum, l) => sum + l.interestPaid, 0);
        const activeLoans = loans.filter(l => l.status === 'Active').length;

        // 3. Collection Report
        const totalPendingCollections = collections.reduce((sum, c) => sum + c.balanceAmount, 0);
        const totalCollectedAmount = collections.reduce((sum, c) => sum + (c.totalAmount - c.balanceAmount), 0);

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
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
