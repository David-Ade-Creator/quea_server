const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    MONGODB_URL:process.env.MONGODB_URL || 'MONGODB_URL',
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
    PORT: process.env.PORT || 1100,
    MAIL_KEY :  process.env.MAIL_KEY || 'MAIL_KEY',
    CONFIRMATION_TOKEN_SECRET : process.env.CONFIRMATION_TOKEN_SECRET || 'CONFIRMATION_TOKEN_SECRET',
    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
    JWT_RESET_PASSWORD : process.env.JWT_RESET_PASSWORD || 'JWT_RESET_PASSWORD',
    EMAIL_TO : process.env.EMAIL_TO || 'EMAIL_FROM',
    EMAIL_FROM : process.env.EMAIL_FROM || 'EMAIL_FROM',
    CLIENT_URL: process.env.CLIENT_URL || 'CLIENT_URL',
    GOOGLE_CLIENT : process.env.GOOGLE_CLIENT || 'GOOGLE_CLIENT = 962563750549-c0kla6kearj160dt1p0qs54f89slpfil.apps.googleusercontent.com',
    ACCESSBUCKETKEY: process.env.ACCESSBUCKETKEY,
    SECRETACCESSBUCKETKEY: process.env.SECRETACCESSBUCKETKEY,
}