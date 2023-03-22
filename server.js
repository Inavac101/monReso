const express = require('express');
const userRoutes = require('./routes/user.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: './config/.env'})
require('./config/db');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Router
app.use('/api/user', userRoutes);


//Server
app.listen (PORT, () => {
    console.log(`Listening on port ${PORT}`);
})