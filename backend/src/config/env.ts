import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET: z.string().min(32),
    ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    // Optional AI APIs
    STABILITY_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

let env: EnvConfig;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:', error.issues);
        throw new Error('Invalid environment configuration');
    }
    throw error;
}

export default env;
