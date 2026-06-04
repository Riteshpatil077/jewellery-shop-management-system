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

        console.log("💍 Seeding Professional Jewelry Products...");
        await prisma.product.createMany({
            data: [
                { name: 'मंगळसूत्र (२२ कॅरेट)', category: 'मंगळसूत्र (Mangalsutra)', weight: 15.5, metalType: 'Gold', ratePerGram: 7200, totalPrice: 111600, stockCount: 5 },
                { name: 'सोन्याचा नेकलेस', category: 'हार व नेकलेस (Necklaces)', weight: 25.2, metalType: 'Gold', ratePerGram: 7200, totalPrice: 181440, stockCount: 3 },
                { name: 'डिझायनर अंगठी', category: 'अंगठी (Rings)', weight: 4.8, metalType: 'Gold', ratePerGram: 7200, totalPrice: 34560, stockCount: 12 },
                { name: 'साखळी चैन', category: 'साखळी व चैन (Chains)', weight: 10.0, metalType: 'Gold', ratePerGram: 7200, totalPrice: 72000, stockCount: 8 },
                { name: 'चांदीचे पैंजण', category: 'पैंजण व जोडवी (Payal)', weight: 50.0, metalType: 'Silver', ratePerGram: 95, totalPrice: 4750, stockCount: 20 },
            ]
        });

        console.log("📋 Seeding active Loans & Collections...");
        await prisma.loan.create({
            data: {
                customerName: 'रमेश पाटील',
                mobileNumber: '9834253022',
                collateralItem: 'सोन्याची साखळी (20g)',
                loanAmount: 50000,
                interestRate: 2,
                durationMonths: 12,
                repaymentDate: new Date('2026-12-31'),
                status: 'Active'
            }
        });

        console.log("✅ Seeding completed! Database is now professional and updated.");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
