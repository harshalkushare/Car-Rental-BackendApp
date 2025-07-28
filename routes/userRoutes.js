const express = require('express');
const router = express.Router();
const {userRegister , loginUser, updateProfile, changePassword, getProfileWithBookings} = require('../controllers/userController');
const {protect} = require('../middlewares/userAuthMiddleware');

//Auth routes
router.post('/register',userRegister);
router.post('/login',loginUser);

//profile routes
router.put('/profile', protect ,updateProfile);
router.put('/change-password', protect ,changePassword);
router.put('/get-profile', protect ,getProfileWithBookings);

module.exports = router;