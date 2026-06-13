import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        // totalBusiness is already stored on the Customer model — no JOIN needed
        const customers = await prisma.customer.findMany({
            where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                mobile: true,
                address: true,
                aadhaar: true,
                email: true,
                totalBusiness: true,
                createdAt: true,
                _count: { select: { transactions: true } }
            }
        });
        const result = customers.map(({ _count, ...c }) => ({
            ...c,
            transactionCount: _count.transactions
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const customer = await prisma.customer.create({ data: req.body });
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
