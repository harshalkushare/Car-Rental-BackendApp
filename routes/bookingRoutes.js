const express = require("express");
const router = express.Router();
const {createBooking,getUserBookings,cancelBooking} = require("../controllers/bookingController");
const {protect} = require('../middlewares/userAuthMiddleware');

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);
router.put("/cancel/:id", protect, cancelBooking);

module.exports = router;
