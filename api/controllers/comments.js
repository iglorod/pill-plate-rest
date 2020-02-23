const mongoose = require('mongoose');

const Comment = require('../models/comment');

exports.getComment = (req, res, next) => {
    const idMessage = req.params.idMessage;

    Comment.findOne({ messageId: idMessage, creatorId: req.body.creatorId })
        .exec()
        .then(comment => {
            res.status(200).json(comment);
        })
        .catch(err => res.status(500).json({ error: err }));
};

exports.postComment = (req, res, next) => {
    const idMessage = req.params.idMessage;

    const createObj = {};

    for (let key in req.body) {
        createObj[key] = req.body[key];
    }

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        messageId: idMessage,
        ...createObj
    })

    comment.save()
        .then(comment => {
            res.status(200).json(comment);
        })
        .catch(err => res.status(500).json({ error: err }))

};

exports.patchComment = (req, res, next) => {
    const idComment = req.params.idComment;

    const updateObj = {};

    for (let key in req.body) {
        updateObj[key] = req.body[key];
    }

    Comment.updateOne({ _id: idComment }, { $set: updateObj })
        .exec()
        .then(comment => {
            res.status(200).json(comment);
        })
        .catch(err => res.status(500).json({ error: err }))

}

exports.removeComment = (req, res, next) => {
    const idComment = req.params.idComment;

    Comment.deleteOne({ _id: idComment })
        .exec()
        .then(comment => {
            res.status(200).json(comment);
        })
        .catch(err => res.status(500).json({ error: err }))

};