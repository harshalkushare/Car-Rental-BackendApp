const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/adminAuthMiddleware');
const {registerAdmin,loginAdmin,getProfile,updateProfile,changePassword} = require('../controllers/adminController');
const {addCar} = require('../controllers/carController');
const upload = require('../utils/multer');
const { updateBookingStatus, getBookingById } = require("../controllers/bookingController");


//auth routes
router.post('/login',loginAdmin);
router.post('/register',registerAdmin);

//profile routes
router.get('/profile',protect,getProfile);
router.put('/profile',protect,updateProfile);
router.put('/change-password',protect,changePassword);

//car route
router.post('/car',protect,upload.single('image'),addCar);

//booking route
router.put("/booking/status/:id", protect, updateBookingStatus);
router.get("/booking/:id", protect, getBookingById);


module.exports = router;