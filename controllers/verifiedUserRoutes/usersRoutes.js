import express from 'express';
import{getUser, getUserFriends, addRemoveFriends} from './users.js';
import {verifyToken} from '../../middleware/verifyAuth.js';

const router = express.Router();

//  READ
// router.get('/', (req, res) => {res.json(' working user routes')})
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);

// update
router.patch('/:id/:friendId', verifyToken, addRemoveFriends);

export default router;