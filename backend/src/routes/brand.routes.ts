import { Router } from 'express';
import multer from 'multer';
import { uploadBrandImages, analyzeBrand, createBrandProfile } from '../controllers/brand.controller';

const router = Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint: POST /api/brand/upload
router.post('/upload', upload.array('images', 5), uploadBrandImages);

// Endpoint: POST /api/brand/analyze
router.post('/analyze', analyzeBrand);

// Endpoint: POST /api/brand (Create Profile)
router.post('/', createBrandProfile);

export default router;
