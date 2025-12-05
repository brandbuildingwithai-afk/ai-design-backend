import request from 'supertest';
import express from 'express';
import agentRoutes from '../../routes/agent.routes';
import prisma from '../../config/database';

// Mock all agent services
jest.mock('../../services/agents/planner.service', () => ({
    generateDesignBrief: jest.fn().mockResolvedValue({ platform: 'INSTAGRAM' })
}));
jest.mock('../../services/agents/layout.service', () => ({
    generateLayout: jest.fn().mockResolvedValue([{ type: 'text' }])
}));
jest.mock('../../services/agents/content.service', () => ({
    generateContent: jest.fn().mockResolvedValue({ headline: 'Test' })
}));
jest.mock('../../services/agents/stylist.service', () => ({
    applyBrandStyle: jest.fn().mockResolvedValue({
        elements: [{ type: 'text', text: 'Test' }],
        brand: { name: 'Test Brand' }
    })
}));

// Mock Prisma
jest.mock('../../config/database', () => ({
    user: {
        findUnique: jest.fn().mockResolvedValue({ id: 'user-123' })
    },
    brandProfile: {
        findFirst: jest.fn().mockResolvedValue({ brandName: 'Test Brand' })
    },
    agentLog: {
        create: jest.fn().mockResolvedValue({})
    }
}));

const app = express();
app.use(express.json());
app.use('/api/agents', agentRoutes);

describe('Agent Controller Integration', () => {
    it('POST /api/agents/design should return a generated design', async () => {
        const response = await request(app)
            .post('/api/agents/design')
            .send({ prompt: 'Test prompt' });

        expect(response.status).toBe(200);
        expect(response.body.design).toBeDefined();
        expect(response.body.design.brand.name).toBe('Test Brand');
    });

    it('should return 400 if prompt is missing', async () => {
        const response = await request(app)
            .post('/api/agents/design')
            .send({});

        expect(response.status).toBe(400);
    });
});
