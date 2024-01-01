const express = require('express');
const communityRouter = express.Router();
const communityController = require('./community.controller');
const { authenticate } = require('../auth/auth.middleware');


communityRouter.post('/', authenticate, communityController.createCommunity)
communityRouter.get('/', authenticate, communityController.getAllCommunities)
communityRouter.get('/me/owner', authenticate, communityController.getMyOwnedCommunity)
communityRouter.get('/me/member', authenticate, communityController.getMyJoinedCommunity)
communityRouter.get('/:id/member', authenticate, communityController.getAllMembers)


module.exports = communityRouter;