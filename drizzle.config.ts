import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit';

dotenv.config({
    path: `.env.local`,
});

export default defineConfig({
    out: './server/migrations',
    schema: './server/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
});
