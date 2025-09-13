import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '15m',
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '1h',
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || '7d',
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  MSG91_API_KEY: process.env.MSG91_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

if (!env.MONGODB_URI || !env.JWT_SECRET) {
  console.error("FATAL ERROR: MONGODB_URI and JWT_SECRET must be defined.");
  process.exit(1);
}

export default env;