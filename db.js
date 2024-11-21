const mysql = require('mysql2');
require('dotenv').config();

// Validate required environment variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("Faltam variáveis de ambiente para configurar o banco de dados.");
}

// Create a connection pool for efficient queries
const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
db.getConnection((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Exit the application if the database connection fails
    }
    console.log('Conectado ao banco de dados!');
});

module.exports = db;
