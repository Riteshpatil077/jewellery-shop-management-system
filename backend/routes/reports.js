import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        const products = await prisma.product.findMany({ take: 10 });
        const loans = await prisma.loan.findMany({ take: 10 });

        // Aggregation for Prisma can be tricky, for summary we'll fetch then group or use groupBy
        const salesReport = await prisma.product.groupBy({
            by: ['createdAt'],
            _sum: { totalPrice: true },
            _count: { id: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            recentProducts: products,
            recentLoans: loans,
            salesReport: salesReport.map(s => ({
                _id: s.createdAt.toISOString().split('T')[0],
                total: s._sum.totalPrice,
                count: s._count.id
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
