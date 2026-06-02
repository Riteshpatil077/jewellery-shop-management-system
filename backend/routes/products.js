import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category, metalType, search } = req.query;
        const products = await prisma.product.findMany({
            where: {
                AND: [
                    category ? { category } : {},
                    metalType ? { metalType } : {},
                    search ? { name: { contains: search, mode: 'insensitive' } } : {}
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, category, weight, metalType, ratePerGram, makingCharges, totalPrice, stockCount } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                category,
                weight: parseFloat(weight),
                metalType,
                ratePerGram: parseFloat(ratePerGram),
                makingCharges: parseFloat(makingCharges || 0),
                totalPrice: parseFloat(totalPrice),
                stockCount: parseInt(stockCount || 1)
            }
        });
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, category, weight, metalType, ratePerGram, makingCharges, totalPrice, stockCount } = req.body;
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                category,
                weight: parseFloat(weight),
                metalType,
                ratePerGram: parseFloat(ratePerGram),
                makingCharges: parseFloat(makingCharges || 0),
                totalPrice: parseFloat(totalPrice),
                stockCount: parseInt(stockCount || 1)
            }
        });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
