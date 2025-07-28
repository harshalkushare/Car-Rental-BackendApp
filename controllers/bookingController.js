const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");

const createBooking = async (req, res) => {
  try {
    const {
      startDate,
      pickupTime,
      pickupLocation,
      endDate,
      dropoffTime,
      dropoffLocation,
      totalAmount,
      carId,
    } = req.body;

    //validates date
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid Date format",
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date must be Before end date",
      });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found!!!",
      });
    }

    if (!car.isAvaible) {
      return res.status(400).json({
        success: false,
        message: "Car is not available for rental",
      });
    }

    const existingBooking = await Booking.findOne({
      carId,
      status: { $nin: ["cancelled", "completed"] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Car is already book",
      });
    }
    const booking = await Booking.create({
      carId,
      userId,
      startDate,
      endDate,
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation,
      totalAmount,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: booking._id,
        carId: booking.carId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //validate status
    const validStatus = ["pending", "confirmed", "cancelled", "completed"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    if (!req.user || req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User is not authed",
      });
    }

    const userId = req.user._id;

    const bookings = await Booking.find({ userId }).populate({
      path: "carId",
      select:
        "name brand year model transmission price image fuelType seats features",
    });

    const formattedBooking = bookings.map((booking) => ({
      _id: booking._id,
      carId: booking.carId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      status: booking.status,
    }));

    res.json({
        success:true,
        data:formattedBooking
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
     const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required"
            });
        }

        const booking = await Booking.findById(id).populate("carId");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: booking
        });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createBooking,
  updateBookingStatus,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
