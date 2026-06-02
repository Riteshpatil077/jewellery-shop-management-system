import prisma from './prismaClient.js';

async function seed() {
    try {
        console.log("Cleaning database...");
        await prisma.collection.deleteMany();
        await prisma.loan.deleteMany();
        await prisma.product.deleteMany();
        await prisma.customer.deleteMany();

        console.log("Seeding customers...");
        await prisma.customer.createMany({
            data: [
                { name: 'रमेश पाटील', mobile: '9876543210', address: 'पुणे', totalBusiness: 150000 },
                { name: 'अनिता शर्मा', mobile: '9123456780', address: 'सातारा', totalBusiness: 100000 },
            ]
        });

        console.log("Seeding products...");
        await prisma.product.createMany({
            data: [
                { name: 'सोन्याची अंगठी', category: 'अंगठी (Rings)', weight: 5, metalType: 'Gold', ratePerGram: 6500, totalPrice: 32500, stockCount: 10 },
                { name: 'डायमंड हार', category: 'हार (Necklaces)', weight: 20, metalType: 'Diamond', ratePerGram: 8000, totalPrice: 160000, stockCount: 2 },
            ]
        });

        console.log("Seeding loans & collections...");
        await prisma.loan.create({
            data: {
                customerName: 'रमेश पाटील',
                mobileNumber: '9876543210',
                collateralItem: 'सोन्याची साखळी (20g)',
                loanAmount: 50000,
                interestRate: 2,
                durationMonths: 12,
                repaymentDate: new Date('2026-12-31'),
            }
        });

        await prisma.collection.create({
            data: {
                customerName: 'अनिता शर्मा',
                purchasedJewelry: 'सोन्याचा हार (15g)',
                totalAmount: 100000,
                advancePayment: 30000,
                balanceAmount: 70000,
                totalInstallments: 10,
                monthlyAmount: 7000,
                paidInstallments: 3,
                nextDueDate: new Date('2026-06-15'),
            }
        });

        console.log("✅ Seeding completed successfully for PostgreSQL!");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
