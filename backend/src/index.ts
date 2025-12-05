import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api', (_req: Request, res: Response) => {
    res.json({
        message: 'AI Design Platform API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            brand: '/api/brand',
            design: '/api/design',
            templates: '/api/templates'
        }
    });
});

// Import routes (will create these next)
import agentRoutes from './routes/agent.routes';
import brandRoutes from './routes/brand.routes';
import templateRoutes from './routes/template.routes';
import postRoutes from './routes/post.routes';

// API Routes
app.use('/api/agents', agentRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posts', postRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
