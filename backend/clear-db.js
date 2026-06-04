import prisma from './prismaClient.js';

async function clearDatabase() {
    try {
        console.log("🗑️  Clearing all data and resetting IDs...");

        // Using TRUNCATE with RESTART IDENTITY to reset auto-increment counters in PostgreSQL
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Transaction", "Collection", "Loan", "Product", "Customer" RESTART IDENTITY CASCADE;`);

        console.log("✅ All data cleared and IDs reset successfully!");
    } catch (err) {
        console.error("❌ Failed to clear data:", err);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
