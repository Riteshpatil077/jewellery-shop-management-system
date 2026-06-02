import prisma from './prismaClient.js';

async function check() {
    try {
        const products = await prisma.product.count();
        const customers = await prisma.customer.count();
        const loans = await prisma.loan.count();
        const collections = await prisma.collection.count();

        console.log("--- Database Table Status ---");
        console.log(`Product table exists and has ${products} records.`);
        console.log(`Customer table exists and has ${customers} records.`);
        console.log(`Loan table exists and has ${loans} records.`);
        console.log(`Collection table exists and has ${collections} records.`);
        console.log("------------------------------");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error checking tables:", err.message);
        process.exit(1);
    }
}

check();
