import pool from '../database/db.js';
import { initializePayment, verifyPayment } from '../services/paystack.js';

// Make a booking
const bookEvent = async (req, res) => {
  const client = await pool.connect();

  try {
    const { event_id, seats_booked } = req.body;

    await client.query('BEGIN');

    const eventRes = await client.query(
      'SELECT * FROM events WHERE id = $1 FOR UPDATE',
      [event_id]
    );

    const event = eventRes.rows[0];

    if (!event) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.available_seats < seats_booked) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Not enough sea  ts available' });
    }

    if (seats_booked <= 0) {
      return res.status(400).json({ message: "Invalid seat count" });
    }

    const bookingRes = await client.query(
      `INSERT INTO bookings (user_id, event_id, seats_booked, status, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, event_id, seats_booked, 'ACTIVE', 'PENDING']
    );

    // Reduce seats
    await client.query(
      `UPDATE events SET available_seats = available_seats - $1 WHERE id = $2`,
      [seats_booked, event_id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Booking created. Proceed to payment.',
      booking: bookingRes.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Booking error:', error);

    return res.status(500).json({
      message: 'Booking failed',
      error: error.message
    });

  } finally {
    client.release();
  }
};


// Start Payment
const startPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const bookingRes = await pool.query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId]
    );

    const booking = bookingRes.rows[0];

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.payment_status === "PAID") {
      return res.status(400).json({ message: "Already paid" });
    }

    const userRes = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [booking.user_id]
    );

    const eventRes = await pool.query(
      "SELECT price FROM events WHERE id = $1",
      [booking.event_id]
    );

    if (!eventRes.rows[0].price) {
      return res.status(400).json({ message: "Event price not set" });
    }

    const amount = eventRes.rows[0].price * booking.seats_booked;

    const paystack = await initializePayment(userRes.rows[0].email, amount);

    await pool.query(
      "UPDATE bookings SET payment_reference = $1 WHERE id = $2",
      [paystack.data.reference, bookingId]
    );

    return res.status(200).json({
      authorization_url: paystack.data.authorization_url
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Payment confirmation 
const confirmPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const verify = await verifyPayment(reference);

    if (verify.data.status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    const bookingRes = await pool.query(
      "SELECT * FROM bookings WHERE payment_reference = $1",
      [reference]
    );
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.payment_status === "PAID") {
      return res.status(400).json({ message: "Payment already confirmed" });
    }

    const booking = bookingRes.rows[0];

    await pool.query(
      `UPDATE bookings SET payment_status = 'PAID' WHERE id = $1 AND payment_status != 'PAID' `,
      [booking.id]
    );

    return res.status(200).json({
      message: "Payment successful"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Cancel a booking
const cancelBooking = async (req, res) => {
  const client = await pool.connect();

  try {
    const { booking_id } = req.body;

    await client.query('BEGIN');

    const bookingRes = await client.query(
      'SELECT * FROM bookings WHERE id = $1 FOR UPDATE',
      [booking_id]
    );

    const booking = bookingRes.rows[0];

    if (!booking) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user_id !== req.user.id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status === 'CANCELED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Already canceled' });
    }

    // Prevent cancel after payment (optional rule)
    if (booking.payment_status === 'PAID') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: 'Cannot cancel a paid booking (implement refund instead)'
      });
    }

    // Cancel booking
    await client.query(
      "UPDATE bookings SET status = 'CANCELED' WHERE id = $1",
      [booking_id]
    );

    //Restore seats
    await client.query(
      "UPDATE events SET available_seats = available_seats + $1 WHERE id = $2",
      [booking.seats_booked, booking.event_id]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      message: 'Booking canceled successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({
      message: 'Cancellation failed',
      error: error.message
    });

  } finally {
    client.release();
  }
};


export { bookEvent, cancelBooking, startPayment, confirmPayment };
