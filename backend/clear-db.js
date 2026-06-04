import prisma from './prismaClient.js';

async function clearDatabase() {
    try {
        console.log("🗑️  Clearing all demo data...");

        // Deleting in order to respect potential relations
        await prisma.transaction.deleteMany();
        await prisma.collection.deleteMany();
        await prisma.loan.deleteMany();
        await prisma.product.deleteMany();
        await prisma.customer.deleteMany();

        console.log("✅ All demo data cleared successfully!");
    } catch (err) {
        console.error("❌ Failed to clear data:", err);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
