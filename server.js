const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (_, res) => {
    res.status(200).send(res.locals.user._id)
});
// Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

//Server
app.listen (PORT, () => {
    console.log(`Listening on port ${PORT}`);
})