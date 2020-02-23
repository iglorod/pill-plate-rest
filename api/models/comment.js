const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    messageId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Message', required: true },
    creatorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    date: String,
    text: String,
    importantRevice: Boolean
})

module.exports = mongoose.model('Comment', commentSchema);