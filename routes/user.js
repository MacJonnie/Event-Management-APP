
import express from "express";
import { signUp, signIn, changeRole } from "../contorllers/user.js";
import verifyToken from "../middleware/jwt_auth.js";

const userRouter = express.Router();


/**
 * @swagger
 * /users/signUp:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (missing fields or validation error)
 */
// users signUp
userRouter.post("/signUp", signUp, function (req, res) {
    
});


/**
 * @swagger
 * /users/signIn:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
// users signIn
userRouter.post("/signIn", signIn, function (req, res) {

});


/**
 * @swagger
 * /users/changeRole:
 *   post:
 *     summary: Change a user's role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@something.com
 *     responses:
 *       200:
 *         description: Role changed successfully
 *       403:
 *         description: Unauthorized or forbidden
 */
// Change User Role
userRouter.post("/changeRole", verifyToken, changeRole, function (req, res) {

});

export default userRouter