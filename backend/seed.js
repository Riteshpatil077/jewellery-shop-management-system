import prisma from './prismaClient.js';

async function seed() {
    try {
        console.log("🗑️ Cleaning database and resetting IDs...");
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Transaction", "Collection", "Loan", "Product", "Customer" RESTART IDENTITY CASCADE;`);

        console.log("🌱 Seeding Admin/Shop Owner...");

        // Shop Owner Data
        await prisma.customer.create({
            data: {
                name: 'रमेश पाटील',
                mobile: '9834253022',
                address: 'Rajapur, sangli',
                totalBusiness: 0
            }
        });

        /* Previous seed data commented out
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
                mobileNumber: '9834253022',
                collateralItem: 'सोन्याची साखळी (20g)',
                loanAmount: 50000,
                interestRate: 2,
                durationMonths: 12,
                repaymentDate: new Date('2026-12-31'),
            }
        });
        */

        console.log("✅ Seeding completed! Admin data added.");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
