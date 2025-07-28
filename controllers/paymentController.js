//need stripe config and booking model
const stripe = require("../config/stripe");
const Booking = require("../controllers/bookingController");

const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).polulate("carId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalAmount * 100,
      currency: "usd",
      metadata: {
        bookingId: booking._id.toString(),
        carId: booking.carId._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//conform payment
const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrive(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    switch (paymentIntent.status) {
      case "succeeded":
        const booking = await Booking.findById(bookingId)
          .populate("userId", "name email")
          .polulate("carId", "name brand model");
        booking.status = "confirmed";
        await booking.save();

        const recipt = await generateRecipt(booking, paymentIntent);

        res.status({
          message: "payment confirmed successfully",
          booking,
          recipt,
        });
      case "processing":
        return res.status(202).json({ message: "payment is still processing" });
      case "require_payment_method":
        return res.status(400).json({ message: "payment failed" });
      default:
        return res.status(400).json({
          message: `Payment status: ${paymentIntent.status}.please contact support`
        });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
    createPaymentIntent,
    confirmPayment
}