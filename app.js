const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRouter = require('./routes/book');
const {connectMongoDb}= require('./connection');
const multer = require("multer");
const authRouter = require('./routes/authRoutes');
require("dotenv").config();


const app = express();
const port = process.env.PORT||8000 ;

// app.set("view engine","ejs");
// app.set("views",path.resolve("./views"));

// Connect MongoDB
connectMongoDb('mongodb://127.0.0.1:27017/booksDB')

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Routes
app.use('/books', bookRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth',authRouter); 

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
} );
