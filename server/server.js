// Connect React & MongoDB
// https://www.geeksforgeeks.org/how-to-connect-mongodb-with-reactjs/ 
// https://www.mongodb.com/resources/languages/mern-stack-tutorial
// https://chatgpt.com/share/6723dbae-0670-8011-a2c4-f5a392637bd1 


// Combined database.js & index.js from the example

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config(); 

const app = express();
const port = process.env.PORT || 8000;

// Parse JSON bodies and enable CORS for cross-origin requests
app.use(express.json());

// connect with React
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
  }));

// MongoDB connection setup
mongoose.connect(process.env.MONGODB)
.then(() => {
    console.log(`Mongoose ${mongoose.version} connected to MongoDB.`)
    console.log(`Host: ${mongoose.connection.host}`)
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

import { crudEndpoints } from './api/crud.js'
app.use('/api', crudEndpoints)

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function mongoReady(req, res, next) { 
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).send()
  }
  next();
}

export {mongoReady}
