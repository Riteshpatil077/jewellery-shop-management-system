import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        const loans = await prisma.loan.findMany({
            where: search ? { customerName: { contains: search, mode: 'insensitive' } } : {},
            orderBy: { createdAt: 'desc' }
        });
        res.json(loans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { loanAmount, interestRate, durationMonths, weight, repaymentDate, collateralImage, ...rest } = req.body;
        const parsedAmount = parseFloat(loanAmount);
        const parsedRate = parseFloat(interestRate);
        const parsedDuration = parseInt(durationMonths || 12);
        const parsedWeight = weight ? parseFloat(weight) : null;

        const monthlyInterest = (parsedAmount * parsedRate) / 100;
        const totalInterest = monthlyInterest * parsedDuration;

        const loan = await prisma.loan.create({
            data: {
                ...rest,
                weight: parsedWeight,
                loanAmount: parsedAmount,
                interestRate: parsedRate,
                durationMonths: parsedDuration,
                totalInterest,
                collateralImage,
                repaymentDate: new Date(repaymentDate)
            }
        });
        res.status(201).json(loan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/:id/payment', async (req, res) => {
    try {
        const { amount, paymentType } = req.body;
        const id = parseInt(req.params.id);
        const loan = await prisma.loan.findUnique({ where: { id } });
        if (!loan) return res.status(404).json({ error: 'Loan not found' });

        let updateData = {};
        if (paymentType === 'interest') {
            updateData.interestPaid = loan.interestPaid + parseFloat(amount);
        } else {
            updateData.amountPaid = loan.amountPaid + parseFloat(amount);
        }

        // Check closure
        if ((updateData.amountPaid || loan.amountPaid) >= loan.loanAmount && (updateData.interestPaid || loan.interestPaid) >= loan.totalInterest) {
            updateData.status = 'Closed';
        }

        const updated = await prisma.loan.update({
            where: { id },
            data: updateData
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch('/:id/date', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { repaymentDate } = req.body;

        const updated = await prisma.loan.update({
            where: { id },
            data: { repaymentDate: new Date(repaymentDate) }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
