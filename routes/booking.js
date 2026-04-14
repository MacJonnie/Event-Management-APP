import express from "express";
import { bookEvent, cancelBooking, confirmPayment, startPayment } from "../controllers/booking.js";
import verifyToken from "../middleware/jwt_auth.js";

const bookingRouter = express.Router()

/**
 * @swagger
 * /bookings/bookEvent:
 *   post:
 *     summary: Book seats for an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - seats_booked
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 665f67feb903a69621734a3b
 *               seatsBooked:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Booking successful
 *       400:
 *         description: Not enough seats available or bad request
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error during booking
 */
// book event
bookingRouter.post('/bookEvent', verifyToken, bookEvent);


/**
 * @swagger
 * /bookings/startPayment:
 *   post:
 *     summary: Start payment process for a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment initialized, return authorization URL
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
// Start a payment for a booking
bookingRouter.post('/startPayment', verifyToken, startPayment)


/**
 * @swagger
 * /bookings/confirmPayment/{reference}:
 *   put:
 *     summary: Confirm payment for a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Paystack payment reference
 *     responses:
 *       200:
 *         description: Payment confirmed and booking updated
 *       400:
 *         description: Payment verification failed
 *       500:
 *         description: Server error
 */
// Confirm payment for a booking
bookingRouter.put('/confirmPayment/:reference', verifyToken, confirmPayment);


/**
 * @swagger
 * /bookings/cancelBooking:
 *   put:
 *     summary: Cancel an existing booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: 666a12de019bc8123a54dc9e
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
// cancel booking
bookingRouter.put('/cancelBooking', verifyToken, cancelBooking)


export default bookingRouter;