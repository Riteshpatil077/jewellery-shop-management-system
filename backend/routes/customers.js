import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        const customers = await prisma.customer.findMany({
            where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
            orderBy: { name: 'asc' }
        });
        res.json(customers);
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
