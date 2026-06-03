import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        const collections = await prisma.collection.findMany({
            where: search ? { customerName: { contains: search, mode: 'insensitive' } } : {},
            orderBy: { createdAt: 'desc' }
        });
        res.json(collections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { customerName, purchasedJewelry, totalAmount, advancePayment, totalInstallments, nextDueDate } = req.body;
        const total = parseFloat(totalAmount);
        const advance = parseFloat(advancePayment || 0);
        const balance = total - advance;
        const installments = parseInt(totalInstallments);
        const monthly = Math.ceil(balance / installments);

        const collection = await prisma.collection.create({
            data: {
                customerName,
                purchasedJewelry,
                totalAmount: total,
                advancePayment: advance,
                balanceAmount: balance,
                totalInstallments: installments,
                monthlyAmount: monthly,
                nextDueDate: nextDueDate ? new Date(nextDueDate) : null
            }
        });
        res.status(201).json(collection);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { customerName, purchasedJewelry, totalAmount, totalInstallments, advancePayment, nextDueDate } = req.body;

        // Fetch existing
        const existing = await prisma.collection.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ error: 'Collection not found' });

        const total = parseFloat(totalAmount);
        const advance = parseFloat(advancePayment || 0);
        const installments = parseInt(totalInstallments);

        // Recalculate balance properly: What have they paid so far (excluding old advance)?
        // originalPaidWithoutAdvance = (existing.totalAmount - existing.advancePayment) - existing.balanceAmount
        // newBalance = (total - advance) - originalPaidWithoutAdvance

        const oldPrincipal = existing.totalAmount - existing.advancePayment;
        const paidSoFar = oldPrincipal - existing.balanceAmount;

        const newPrincipal = Math.max(0, total - advance);
        const newBalance = Math.max(0, newPrincipal - paidSoFar);
        const monthly = Math.ceil(newBalance / installments) || 0;

        const updated = await prisma.collection.update({
            where: { id },
            data: {
                customerName,
                purchasedJewelry,
                totalAmount: total,
                advancePayment: advance,
                totalInstallments: installments,
                balanceAmount: newBalance,
                monthlyAmount: monthly,
                nextDueDate: nextDueDate ? new Date(nextDueDate) : existing.nextDueDate,
                status: newBalance <= 0 ? 'Completed' : 'Pending'
            }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/:id/pay', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { amount } = req.body;
        const collection = await prisma.collection.findUnique({ where: { id } });
        if (!collection) return res.status(404).json({ error: 'Collection not found' });

        let newBalance = collection.balanceAmount - parseFloat(amount);
        let status = newBalance <= 0 ? 'Completed' : 'Pending';

        let newPaid = collection.paidInstallments + 1;
        if (newBalance <= 0) {
            newPaid = collection.totalInstallments; // Cap progress if paid off completely
        } else if (newPaid > collection.totalInstallments) {
            newPaid = collection.totalInstallments; // Prevent overflow of progress
        }

        const nextDate = collection.nextDueDate ? new Date(collection.nextDueDate) : new Date();
        if (status !== 'Completed') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        const updated = await prisma.collection.update({
            where: { id },
            data: {
                balanceAmount: Math.max(0, newBalance),
                paidInstallments: newPaid,
                status,
                nextDueDate: status === 'Completed' ? null : nextDate
            }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch('/:id/date', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nextDueDate } = req.body;

        const updated = await prisma.collection.update({
            where: { id },
            data: { nextDueDate: new Date(nextDueDate) }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
