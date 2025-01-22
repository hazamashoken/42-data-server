import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle/migrations",
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/schema',
  dbCredentials: {
    url: `${process.env.DATABASE_URL}`
  },
  verbose: true,
  strict: true,
})