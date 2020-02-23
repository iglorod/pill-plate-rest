const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    creatorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    membersId: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    note: { type: String, required: false },
    date: { type: String, required: true },
    lastChangesDate: { type: String, required: true },
})

module.exports = mongoose.model('Topic', topicSchema);