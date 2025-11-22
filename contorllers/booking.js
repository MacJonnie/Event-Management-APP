import pool from '../db.js';

// BOOK EVENT
const bookEvent = async (req, res) => {
  try {
    const { event_id, seats_booked } = req.body;

    const eventRes = await pool.query('SELECT * FROM events WHERE id = $1 FOR UPDATE', [event_id]);
    const event = eventRes.rows[0];

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.available_seats < seats_booked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Begin booking
    await pool.query('BEGIN');

    const booking = await pool.query(
      `INSERT INTO bookings (user_id, event_id, seats_booked, status, payment_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, event_id, seats_booked, 'CONFIRMED', 'PENDING']
    );

    await pool.query(
      `UPDATE events SET available_seats = available_seats - $1 WHERE id = $2`,
      [seats_booked, event_id]
    );

    await pool.query('COMMIT');

    res.status(201).json({ message: 'Booking successful', booking: booking.rows[0] });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const bookingRes = await pool.query('SELECT * FROM bookings WHERE id = $1', [booking_id]);
    const booking = bookingRes.rows[0];

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    if (booking.status === 'CANCELED') return res.status(400).json({ message: 'Booking already canceled' });

    await pool.query('BEGIN');

    await pool.query(
      `UPDATE bookings SET status = 'CANCELED' WHERE id = $1`,
      [booking_id]
    );

    await pool.query(
      `UPDATE events SET available_seats = available_seats + $1 WHERE id = $2`,
      [booking.seats_booked, booking.event_id]
    );

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Cancellation failed:', error);
    res.status(500).json({ message: 'Cancellation failed' });
  }
};

export { bookEvent, cancelBooking };
