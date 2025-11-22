import pool from '../db.js'

// Function to check user role (User cannot create an event).
const isCreator = async function (req, res, next) {
    try {
        const id = req.user.id
        // grab the user id from the decoded token to query the DB
        const userId = await pool.query('SELECT * FROM users WHERE id = $1', [id])

        const user = userId.rows[0];

        if (user.role !== "CREATOR") {
            console.log("User cannot access this route");
            return res.status(400).json({
                alert: "Cannot access a secured route. User is not a creator!",
                message: "Update your role to access this route"
            });
        }
        console.log("User access granted");
        next();
    } catch (error) {
        console.error('An error occured.', error)
        res.status(500).send("Error accessing secured route.")
    };
}

export default isCreator;