require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 4000;
const db = require('./configs/connectDb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mainRouter = require('./routes/mainRouter');

//Connect database
db();

//Create app server
const app = express();

//Config middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost/3000',
    methods: 'POST, GET, PATCH, PUT, DELETE',
    credentials: true,
  })
);

//Routes
mainRouter(app);

//Server listen PORT
app.listen(PORT, () => {
  console.log(`Server listen at http://localhost/${PORT}`);
});
