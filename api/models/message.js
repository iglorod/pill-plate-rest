const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    topicId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Topic', required: true },
    creatorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    redactDate: String,
    text: String,
    path: String,
    class: String,
    wasReadedBy: Array,
    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }],
})

module.exports = mongoose.model('Message', messageSchema);
