const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

// Create a database connection pool
const pool = mariadb.createPool(process.env.DATABASE_URL);

// Initialize the Prisma adapter
const adapter = new PrismaMariaDb(pool);

// Pass the adapter to the Prisma Client
const prisma = new PrismaClient({ adapter });

module.exports = prisma;