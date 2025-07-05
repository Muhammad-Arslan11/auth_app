import express from 'express';
import { handleSignup, handleLogin, handleLogout } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/signup', handleSignup);
router.get('/login', handleLogin);
router.get('/logout', handleLogout);

export default router;
