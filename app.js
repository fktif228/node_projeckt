const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const gameRoute = require('./routes/game');
const adminRoute = require('./routes/adminGame');

const keys = require('./config/keys');
const app = express();


mongoose.connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('cors')());

app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/game', gameRoute);
app.use('/api/admin', adminRoute);


module.exports = app;