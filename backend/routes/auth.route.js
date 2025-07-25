import express from 'express';
import { 
    handleSignup,
    handleLogin,
    handleLogout,
    verifyEmail,
    forgotPassword,
    resetPassword,
     } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

router.post('/verify-email', verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
