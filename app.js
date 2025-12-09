import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';
import userRoutes from './routes/user.js';
import eventRouter from "./routes/event.js";
import bookingRouter from "./routes/booking.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './documentation/swaggerUi.js';
import cors from 'cors'

const app = express()
app.use(cors())

// SwaggerUi Documentation
app.use('/Api-Doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  authorizations: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
        in: 'header'
      }
    }
}));

dotenv.config()

pool.query('SELECT NOW()')
.then(res => console.log('✅ PostgreSQL connected @', res.rows[0].now))
.catch(err => console.error('❌ PostgreSQL connection failed:', err));

app.use(express.json());
app.use(express.urlencoded ({
      extended: true
}))

app.use("/evently/users", userRoutes)
app.use("/evently/events", eventRouter)
app.use("/evently/bookings", bookingRouter)
// app.all('*', (req, res) =>{
//     res.status(404).json({
//         message: "Resource not found"
//     })
// })

app.get("/evently", (req, res) => {
    res.status(200).send("Welcome to Evently. Create and manage your events seamlessly")
    console.log("Welcome to my resource")
})


const PORT = process.env.PORT || 2222
app.listen(PORT, ()=> {
    console.log(`Sever is listening on port ${PORT}...`)
})