import express from 'express';
import {getFeedPosts, getUserPosts, likePosts, postComments} from './posts.js';
import { verifyToken } from '../../middleware/verifyAuth.js';

const router =express.Router();

//  Read routes
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

//  update routes
router.patch('/:id/like', verifyToken, likePosts);
router.patch('/:id/comment', verifyToken, postComments);

export default router;
