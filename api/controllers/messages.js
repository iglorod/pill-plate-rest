const mongoose = require('mongoose');
const fs = require('fs');

const Message = require('../models/message');

exports.getMessages = (req, res, next) => {
    const idTopic = req.params.idTopic;
    const skip = +req.query.skip;
    const limit = +req.query.limit;

    Message.find({ topicId: idTopic })
        .populate({
            path: 'Comment',
            match: { creatorId: req.body.creatorId },
        })
        .populate({
            path: 'creatorId',
        })
        .select('_id topicId creatorId type date text path class wasReadedBy comments')
        .sort('-date')
        .skip(skip)
        .limit(limit)
        .exec()
        .then(messages => {
            res.status(200).json(messages);
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        });
};

exports.getMessagesByType = (req, res, next) => {
    const idUser = req.params.idUser;
    const type = req.query.type;
    const skip = +req.query.skip;
    const limit = +req.query.limit;

    Message.find({ creatorId: idUser, type: type })
        .populate({
            path: 'Comment',
            match: { creatorId: idUser },
        })
        .populate({
            path: 'creatorId',
        })
        .select('_id topicId creatorId type date text path class wasReadedBy comments')
        .sort('-date')
        .skip(skip)
        .limit(limit)
        .exec()
        .then(messages => {
            res.status(200).json(messages);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err })
        });
};

exports.postText = (req, res, next) => {
    const idTopic = req.params.idTopic;

    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        topicId: idTopic,
        creatorId: req.body.creatorId,
        type: req.body.type,
        date: req.body.date,
        text: req.body.text,
        wasReadedBy: [req.body.creatorId]
    })

    message.save()
        .then(message => {
            Message.populate(message, { path: "creatorId" }, (err, message) => {
                res.status(200).json(message);
            });
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.postFileData = (req, res, next) => {
    const idTopic = req.params.idTopic;

    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        topicId: idTopic,
        creatorId: req.body.creatorId,
        type: req.body.type,
        date: req.body.date,
        path: req.file.path,
        wasReadedBy: [req.body.creatorId]
    })

    message.save()
        .then(message => {
            Message.populate(message, { path: "creatorId" }, (err, message) => {
                res.status(200).json(message);
            });
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.getMessage = (req, res, next) => {
    const idMessage = req.params.idMessage;

    Message.findOne({ _id: idMessage })
        .populate({
            path: 'Comment',
            match: { creatorId: req.body.creatorId },
        })
        .select('_id topicId creatorId type date text path class wasReadedBy comments')
        .exec()
        .then(message => {
            res.status(200).json(message);
        })
        .catch(err => res.status(500).json({ error: err }));

};

exports.patchMessage = (req, res, next) => {
    const idMessage = req.params.idMessage;

    Message.findOneAndUpdate({ _id: idMessage }, { $set: { text: req.body.text } }, { new: true })
        .select('_id topicId creatorId type date text path class wasReadedBy comments')
        .exec()
        .then(message => {
            res.status(200).json(message);
        })
        .catch(err => res.status(500).json({ error: err }));
};

const updateReaders = (req, res, idMessage) => {
    Message.findOneAndUpdate({ _id: idMessage }, { $push: { wasReadedBy: req.body.wasReadedBy } }, { new: true })
        .select('_id topicId creatorId type date text path class wasReadedBy comments')
        .exec()
        .then(message => {
            console.log('return')
            return res.status(200).json(message);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: err })
        });
}

exports.patchReadersMessage = (req, res, next) => {
    const idMessage = req.params.idMessage;

    Message.findById(idMessage)
        .exec()
        .then(message => {
            if (!message.wasReadedBy.includes(req.body.wasReadedBy)) {
                console.log('start update')
                return updateReaders(req, res, idMessage);
            }
            else
                res.status(403).json(message);
            console.log('then')
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.removeMessage = (req, res, next) => {
    const idMessage = req.params.idMessage;

    Message.findByIdAndDelete(idMessage)
        .select('_id topicId creatorId type date text path class wasReadedBy comments')
        .exec()
        .then(message => {
            if (message.type !== 'text' && message.type !== 'link')
                fs.unlink(message.path, err => console.log(err));

            res.status(200).json(message);
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.notReadedCountMessages = (req, res, next) => {
    const topicId = req.params.topicId;

    Message.countDocuments({ topicId, wasReadedBy: { $ne: req.body.userId } })
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => res.status(500).json({ error: err }));
};

