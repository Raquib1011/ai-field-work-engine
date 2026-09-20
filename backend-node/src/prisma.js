const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

// Intercept the URL and swap the prefix for the driver
const connectionString = process.env.DATABASE_URL.replace('mysql://', 'mariadb://');

// Create a database connection pool using the modified string
const pool = mariadb.createPool(connectionString);

// Initialize the Prisma adapter
const adapter = new PrismaMariaDb(pool);

// Pass the adapter to the Prisma Client
const prisma = new PrismaClient({ adapter });

module.exports = prisma;