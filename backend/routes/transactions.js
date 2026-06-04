import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// GET profit analysis
router.get('/profit', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany();

        const summary = transactions.reduce((acc, t) => {
            if (t.type === 'Sell') {
                acc.totalSales += t.totalAmount;
                acc.salesWeight += t.weight;
                acc.totalMaking += t.makingCharges;
                acc.totalExchange += t.exchangeValue;

                if (t.purchaseRate && t.rate) {
                    acc.calculatedProfit += ((t.rate - t.purchaseRate) * t.weight) + t.makingCharges;
                } else {
                    acc.calculatedProfit += t.makingCharges;
                }
            } else if (t.type === 'Purchase') {
                acc.totalPurchases += t.totalAmount;
                acc.purchaseWeight += t.weight;
            } else if (t.type === 'Order') {
                acc.totalOrders += t.totalAmount;
                acc.orderWeight += t.weight;
                acc.totalAdvance += t.advancePaid;
                acc.calculatedProfit += t.makingCharges;
            }
            return acc;
        }, {
            totalSales: 0,
            totalPurchases: 0,
            totalOrders: 0,
            salesWeight: 0,
            purchaseWeight: 0,
            orderWeight: 0,
            totalMaking: 0,
            totalAdvance: 0,
            totalExchange: 0,
            calculatedProfit: 0
        });

        const grossProfit = (summary.totalSales + summary.totalOrders) - summary.totalPurchases;

        res.json({ ...summary, grossProfit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const { search, type } = req.query;
        let whereClause = {};

        if (search) {
            whereClause.customerName = { contains: search, mode: 'insensitive' };
        }
        if (type) {
            whereClause.type = type; // "Sell", "Purchase", or "Order"
        }

        let transactions = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: { customer: true }
        });

        // Push 'Completed' status downwards in the list
        transactions.sort((a, b) => (a.status === 'Completed' ? 1 : 0) - (b.status === 'Completed' ? 1 : 0));

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new transaction
router.post('/', async (req, res) => {
    try {
        const {
            type, customerName, supplierName, mobile, itemName, metalType, weight, rate,
            makingCharges, totalAmount, advancePaid, notes, dueDate,
            exchangeItemName, exchangeWeight, exchangeRate, exchangeValue,
            exchangePurity, exchangeFineWeight, purchaseRate, productId
        } = req.body;

        const actTotal = parseFloat(totalAmount || 0);
        let actAdvance = parseFloat(advancePaid || 0);
        const actMaking = parseFloat(makingCharges || 0);
        const actExchangeValue = parseFloat(exchangeValue || 0);

        // For Purchase (Buying for shop stock), usually it's fully paid from cash.
        // If it's a Purchase and no advance was explicitly entered, assume fully paid.
        if (type === 'Purchase' && actAdvance === 0) {
            actAdvance = actTotal;
        }

        // Final balance after considering exchange and advance
        const balance = Math.max(0, actTotal - actExchangeValue - actAdvance);

        const transaction = await prisma.$transaction(async (tx) => {
            // 1. Create the transaction record
            const newTransaction = await tx.transaction.create({
                data: {
                    type,
                    customerName: customerName || supplierName || 'अज्ञात',
                    supplierName: type === 'Purchase' ? (supplierName || customerName) : null,
                    mobile,
                    itemName,
                    metalType,
                    weight: parseFloat(weight || 0),
                    rate: parseFloat(rate || 0),
                    makingCharges: actMaking,
                    totalAmount: actTotal,
                    advancePaid: actAdvance,
                    balanceAmount: balance,
                    notes,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    status: balance <= 0 ? 'Completed' : 'Pending',
                    exchangeItemName,
                    exchangeWeight: exchangeWeight ? parseFloat(exchangeWeight) : null,
                    exchangePurity: exchangePurity ? parseFloat(exchangePurity) : null,
                    exchangeFineWeight: exchangeFineWeight ? parseFloat(exchangeFineWeight) : null,
                    exchangeRate: exchangeRate ? parseFloat(exchangeRate) : null,
                    exchangeValue: actExchangeValue,
                    purchaseRate: purchaseRate ? parseFloat(purchaseRate) : null,
                    productId: productId ? parseInt(productId) : null
                }
            });

            // 2. Adjust Stock if productId is present
            if (productId) {
                const pid = parseInt(productId);
                if (type === 'Sell') {
                    await tx.product.update({
                        where: { id: pid },
                        data: { stockCount: { decrement: 1 } }
                    });
                } else if (type === 'Purchase') {
                    await tx.product.update({
                        where: { id: pid },
                        data: { stockCount: { increment: 1 } }
                    });
                }
            }

            return newTransaction;
        });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST payment on transaction
router.post('/:id/pay', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { amount } = req.body;
        const transaction = await prisma.transaction.findUnique({ where: { id } });

        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        const paidAmount = parseFloat(amount || 0);
        const newAdvance = transaction.advancePaid + paidAmount;
        const newBalance = Math.max(0, transaction.totalAmount - newAdvance);

        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                advancePaid: newAdvance,
                balanceAmount: newBalance,
                status: newBalance <= 0 ? 'Completed' : 'Pending'
            }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
