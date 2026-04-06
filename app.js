import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.js';
import eventRouter from "./routes/event.js";
import bookingRouter from "./routes/booking.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./documentation/swaggerUi.js";
import connectDB from './database/connect.js';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
dotenv.config();

const app = express();
connectDB();
app.use(morgan('dev'));

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 64,
});

app.use('/evently', limiter);

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


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.get("/evently", (req, res) => {
    res.status(200).send("Welcome to Evently. Create and manage your events seamlessly");
    console.log("Welcome to my resource");
})

// app.all('*', (req, res) =>{
//   res.status(404).json({
//     message: "Resource not found"
//   })
// })

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

app.use("/evently/users", userRouter);
app.use("/evently/events", eventRouter);  
app.use("/evently/bookings", bookingRouter);


const PORT = process.env.PORT || 2222
app.listen(PORT, ()=> {
    console.log(`Sever is listening on port ${PORT}...`);
})