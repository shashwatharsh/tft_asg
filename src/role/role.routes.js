const express = require('express');
const roleRouter = express.Router();
const roleController = require('./role.controller');


roleRouter.post('/', roleController.createRole)
roleRouter.get('/', roleController.getAllRole)

    

module.exports = roleRouter;