import { Router } from 'express';
import { sendOTP, verifyOTPAndCreateUser, sendPhoneOTP, verifyPhoneOTP, completePhoneSignup, loginUser, getMe, getAllUsersAdmin } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', sendOTP);
router.post('/verify-otp', verifyOTPAndCreateUser);
router.post('/send-phone-otp', sendPhoneOTP);
router.post('/verify-phone-otp', verifyPhoneOTP);
router.post('/complete-phone-signup', completePhoneSignup);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/admin/users', protect, adminOnly, getAllUsersAdmin);

export default router;
