const { Role } = require('../role/role.model');
const { Community } = require('./community.model');
const { Member } = require('../member/member.model');

let Validator = require('validatorjs');



async function createCommunity(req, res) {
    try {
        const { name } = req.body;

        const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');

        const ownerId = req.user._id;

        const community = await Community.create({
            name,
            slug,
            owner: ownerId,
        });

        const adminRole = await Role.findOne({ name: 'Community Admin' });
        const member = await Member.create({
            community: community._id,
            user: ownerId,
            role: adminRole._id,
        });

        res.status(201).json({
            message: 'Community created successfully',
            data: {
                community,
                member,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server Error',
        });
    }
}



async function getAllCommunities(req, res) {
    const page = Number(req.query.page) || 1;
    const perPage = 10;
    const skip = perPage * (page - 1);

    const [communities, total] = await Promise.all([
        Community.find()
            .populate('owner', 'id name')
            .skip(skip)
            .limit(perPage),
        Community.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    res.json({
        meta: {
            total,
            pages: totalPages,
            page,
        },
        data: communities,
    });
}



async function getAllMembers(req, res) {
    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const communityId = req.params.id;

        const totalCount = await Member.countDocuments({ community: communityId });
        const totalPages = Math.ceil(totalCount / perPage);
        const members = await Member.find({ community: communityId })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate('user', 'id name')
            .populate('role')
            .lean();

        res.status(200).json({
            meta: {
                total: totalCount,
                pages: totalPages,
                page: page,
            },
            data: members,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}


async function getMyOwnedCommunity(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const userId = req.user.toObject()._id;
        const count = await Community.countDocuments({ owner: userId });
        const communities = await Community.find({ owner: userId })
            .select('password') // exclude password field from owner object
            .populate({ path: 'owner', select: 'id name' })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(count / limit);
        const meta = {
            total: count,
            pages: totalPages,
            page: page,
        };

        res.status(200).json({ meta, communities });

    } catch (err) {
        res.status(500).json({
            message: "failed"
        })
    }

}



async function getMyJoinedCommunity(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    try {
        const members = await Member.find({ user: userId })
            .populate({
                path: 'community',
                select: '_id name owner',
                populate: {
                    path: 'owner',
                    select: '_id name',
                },
            })
            .populate({
                path: 'user',
                select: '_id name',
            })
            .populate({
                path: 'role',
                select: '_id name',
            })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const total = await Member.countDocuments({ user: userId });
        const pages = Math.ceil(total / limit);

        res.status(200).json({
            data: members,
            meta: {
                total,
                pages,
                page: parseInt(page),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = { createCommunity, getAllCommunities, getAllMembers, getMyOwnedCommunity, getMyJoinedCommunity };