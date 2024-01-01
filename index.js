const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Auth = require('./src/auth/auth.routes');
const Community = require('./src/community/community.routes');
const Member = require('./src/member/member.routes');
const Role = require('./src/role/role.routes');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/v1/auth', Auth);
app.use('/v1/community', Community);
app.use('/v1/member', Member);
app.use('/v1/role', Role);


mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.listen(process.env.PORT || 8080, () => {
    console.log('server started');
});