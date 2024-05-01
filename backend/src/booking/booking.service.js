const Booking = require("./booking.model");

const createBooking = async (bookingData) => {
  try {
    const booking = new Booking(bookingData);
    await booking.save();
    return booking;
  } catch (error) {
    throw error;
  }
};

const getBookings = async () => {
  try {
    const bookings = await Booking.find().populate("user").populate("room");
    return bookings;
  } catch (error) {
    throw error;
  }
};

const getBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    return booking;
  } catch (error) {
    throw error;
  }
};

const getBookingsByUserId = async (userId) => {
  try {
    const bookings = await Booking.find({ user: userId })
      .populate("user")
      .populate("room");
    return bookings;
  } catch (error) {
    throw error;
  }
};

const updateBooking = async (bookingId, bookingData) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      bookingData,
      { new: true }
    );
    return updatedBooking;
  } catch (error) {
    throw error;
  }
};

const deleteBooking = async (bookingId) => {
  try {
    await Booking.findByIdAndDelete(bookingId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  getBookingById,
  getBookingsByUserId,
  deleteBooking,
};
