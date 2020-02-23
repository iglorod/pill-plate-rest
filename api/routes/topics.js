const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const topicController = require('../controllers/topics');

router.post('/', checkAuth, topicController.postTopic);

router.get('/:idUser', checkAuth, topicController.getTopics);

router.get('/single/:idTopic', checkAuth, topicController.getTopic);

router.patch('/single/:idTopic', checkAuth, topicController.updateTopic);

router.patch('/single/share/:idTopic', checkAuth, topicController.shareTopic);

router.post('/single/leave/:idTopic', checkAuth, topicController.removeOrLeaveTopic);

module.exports = router;
