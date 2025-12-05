import { Router } from 'express';
import { savePost, getUserPosts, getPostById, deletePost } from '../controllers/post.controller';

const router = Router();

router.post('/', savePost);
router.get('/', getUserPosts);
router.get('/:id', getPostById);
router.delete('/:id', deletePost);

export default router;
