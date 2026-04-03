// routes/eventRoutes.js
import express from 'express';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../contorllers/event.js";
import verifyToken from '../middleware/jwt_auth.js';
import isCreator from '../middleware/userRole.js';

const eventRouter = express.Router();

/**
 * @swagger
 * /events/createEvent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - totalSeats
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tech Conference 2025
 *               description:
 *                 type: string
 *                 example: A major tech meetup for developers.
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-07-15
 *               location:
 *                 type: string
 *                 example: 24th, Victoria Cresent, Lekki.
 *               totalSeats:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input or missing fields
 */
// create event
eventRouter.post('/createEvent', verifyToken, isCreator, createEvent, function (req, res){

});


/**
 * @swagger
 * /events/getAllEvents:
 *   get:
 *     summary: Retrieve all available events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 */
// get all events
eventRouter.get('/getAllEvents', getAllEvents, function (req, res){

});


/**
 * @swagger
 * /events/getEventById/{id}:
 *   get:
 *     summary: Get event details by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details retrieved
 *       404:
 *         description: Event not found
 */
// getEventById
eventRouter.get('/getEventById/:id', getEventById, function (req, res){

});


/**
 * @swagger
 * /events/updateEvent/{id}:
 *   put:
 *     summary: Update an event by ID (creator only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               totalSeats:
 *                 type: number
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
// update event
eventRouter.put('/updateEvent/:id', verifyToken, isCreator, updateEvent, function (req, res){

});


/**
 * @swagger
 * /events/deleteEvent:
 *   delete:
 *     summary: Delete an event (creator only)
 *     tags: [Events]
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
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 664d084f3c23e84a2e123456
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       403:
 *         description: Unauthorized or not creator
 *       404:
 *         description: Event not found
 */
// delete event
eventRouter.delete('/deleteEvent', verifyToken, isCreator, deleteEvent, function (req, res){

});

export default eventRouter;
