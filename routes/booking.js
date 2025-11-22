import express from "express";
import { bookEvent, cancelBooking } from "../contorllers/booking.js";
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
 *               - eventId
 *               - seatsBooked
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
bookingRouter.post('/bookEvent', verifyToken, bookEvent, function (req, res) {

});


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
bookingRouter.put('/cancelBooking', verifyToken, cancelBooking, function (req, res) {

});

export default bookingRouter;