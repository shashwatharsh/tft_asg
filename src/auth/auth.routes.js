const express = require('express');
const authRouter = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('./auth.middleware');


authRouter.post('/signup', authController.signUp)
authRouter.post('/signin', authController.signIn)
authRouter.get('/me', authenticate, authController.getMe)

    

module.exports = authRouter;