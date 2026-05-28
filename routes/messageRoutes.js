import express from 'express';
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createMessage) // Public contact form submission
  .get(protect, adminOnly, getMessages); // Admin inbox fetch

router.route('/:id')
  .put(protect, adminOnly, updateMessageStatus)
  .delete(protect, adminOnly, deleteMessage);

export default router;
