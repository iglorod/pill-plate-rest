const mongoose = require('mongoose');
const aws = require('aws-sdk');

const Topic = require('../models/topic');
const User = require('../models/user');
const Message = require('../models/message');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY,
})

exports.postTopic = (req, res, next) => {
    const currDate = Math.floor((new Date().getTime() / 1000));

    const topic = new Topic({
        _id: new mongoose.Types.ObjectId(),
        creatorId: req.body.creatorId,
        membersId: [req.body.creatorId],
        name: req.body.name,
        note: req.body.note,
        date: currDate,
        lastChangesDate: currDate,
    })

    topic.save()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => res.status(500).json({ error: err }))
};

exports.getTopics = (req, res, next) => {
    const userId = req.params.idUser;
    Topic.find({ membersId: userId })
        .select('_id name note date membersId')
        .sort({ lastChangesDate: -1 })
        .exec()
        .then(topics => {
            res.status(200).json(topics)
        })
        .catch(err => res.status(500).json({ error: err }))
}

exports.getTopic = (req, res, next) => {
    const id = req.params.idTopic;
    Topic.findById(id)
        .select('_id name note date membersId')
        .exec()
        .then(topic => {
            res.status(200).json(topic)
        })
        .catch(err => res.status(500).json({ error: err }))
};

exports.updateTopic = (req, res, next) => {
    const id = req.params.idTopic;

    const updateObject = {};

    for (let key in req.body) {
        updateObject[key] = req.body[key];
    }

    const currDate = Math.floor((new Date().getTime() / 1000));
    updateObject.lastChangesDate = currDate;

    Topic.updateOne({ _id: id }, { $set: updateObject })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.shareTopic = (req, res, next) => {
    const id = req.params.idTopic;

    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            const membersId = [...req.body.currentMembers];

            if (membersId.includes('' + user._id))
                return res.status(403).json({
                    message: 'User is already a member of this topic'
                });

            membersId.push(user._id);

            Topic.updateOne({ _id: id }, { $set: { membersId: [...membersId] } })
                .exec()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => res.status(500).json({ error: err }));
        })
        .catch(err => {
            return res.status(404).json({
                message: 'User with this E-mail was not found'
            })
        });
};

const deleteMessage = (message) => {
    Message.deleteOne({ _id: message._id })
        .exec()
        .then(result => {
            if (message.type !== 'text' && message.type !== 'link') {
                var params = {
                    Bucket: 'pill-plate/' + getFileName(message.path, 2),
                    Key: getFileName(message.path, 1),
                };

                s3.deleteObject(params, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
}

const deleteTopicFiles = (result, topicId, res) => {
    Message.find({ topicId })
        .exec()
        .then(messages => {
            for (message of messages) {
                deleteMessage(message);
            }

            res.status(200).json(result);
        })
        .catch(err => res.status(500).json({ error: err }))
}

const removeTopic = (topic, res) => {
    Topic.deleteOne({ _id: topic._id })
        .exec()
        .then(result => {
            deleteTopicFiles(result, topic._id, res);
        })
        .catch(err => res.status(500).json({ error: err }))
}

const leaveTopic = (topic, userId, res) => {
    const membersId = topic.membersId;
    const indexOfUserId = membersId.indexOf('' + userId);
    membersId.splice(indexOfUserId, 1);

    Topic.updateOne({ _id: topic._id }, { $set: { membersId } })
        .exec()
        .then(response => {
            res.status(200).json(result);
        })
        .catch(err => res.status(500).json({ error: err }))
}

exports.removeOrLeaveTopic = (req, res, next) => {
    const id = req.params.idTopic;
    const userId = req.body.userId;

    Topic.findById(id)
        .exec()
        .then(topic => {
            if (topic.membersId.includes('' + userId)) {
                if (topic.membersId.length === 1) {
                    removeTopic(topic, res);
                } else if (topic.membersId.length > 1) {
                    leaveTopic(topic, userId, res);
                }
            }
        })
        .catch(err => res.status(500).json({ error: err }))
}
