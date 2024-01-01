const {Member} = require('./member.model');

async function hasRole(communityId, userId, roleId) {
    const hasRole = await Member.findOne({
        community: communityId,
        user: userId,
        role: roleId
    });
    return hasRole;
}

module.exports = { hasRole }