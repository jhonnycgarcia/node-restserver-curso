/** 
 * Port (Puerto)
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento del Token
 * 60 seg * 60 min * 24 horas * 30 dias
 * 48 horas
 */
process.env.CADUCIDAD_TOKEN = '48h';
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
 * Seed de autenticación
 */
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * Base de datos
 */
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGODB_PROD_URI;
}

process.env.URLDB = urlDB;

/** 
 * Google Client-ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '987556709456-8dhe6qnk6hlb102ilm41pq089efn7f4c.apps.googleusercontent.com';