require('dotenv').config();
const mariadb = require('mariadb');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');

// Parse connection URL parameters
const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mariadb.createPool({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 4000,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace('/', ''),
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 5
});

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;